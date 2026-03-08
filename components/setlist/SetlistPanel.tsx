"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSetlists } from "@/hooks/useSetlists";
import { useSongContext } from "@/contexts/SongContext";
import { getSong } from "@/lib/storage";
import type { SetlistSong } from "@/types/setlist";

function SortableSongItem({
  item,
  onLoad,
  onRemove,
}: {
  item: SetlistSong;
  onLoad: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.songId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/50 rounded text-xs border border-zinc-700/30 group shrink-0"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-zinc-600 hover:text-zinc-400"
        title="Sleep om te herordenen"
      >
        &#x2630;
      </span>
      <button
        onClick={onLoad}
        className="text-zinc-300 hover:text-amber-400 truncate max-w-[120px] transition-colors"
        title={`${item.artist} - ${item.title}`}
      >
        {item.title}
      </button>
      {item.key && (
        <span className="text-zinc-600 text-[10px]">{item.key}</span>
      )}
      <button
        onClick={onRemove}
        className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
        title="Verwijder uit setlist"
      >
        &times;
      </button>
    </div>
  );
}

export default function SetlistPanel() {
  const {
    setlists,
    addSetlist,
    removeSetlist,
    addSongToSetlist,
    removeSongFromSetlist,
    getSetlistSongs,
    updateSetlist,
  } = useSetlists();
  const { song, setSong } = useSongContext();
  const [newName, setNewName] = useState("");
  const [activeSetlist, setActiveSetlist] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSetlist = () => {
    if (!newName.trim()) return;
    const setlist = addSetlist(newName.trim());
    setNewName("");
    setActiveSetlist(setlist.id);
  };

  const handleLoadSong = (songId: string) => {
    const s = getSong(songId);
    if (s) setSong(s);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeSetlist) return;

    const setlist = setlists.find((s) => s.id === activeSetlist);
    if (!setlist) return;

    const oldIndex = setlist.songIds.indexOf(String(active.id));
    const newIndex = setlist.songIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newSongIds = [...setlist.songIds];
    newSongIds.splice(oldIndex, 1);
    newSongIds.splice(newIndex, 0, String(active.id));

    updateSetlist({ ...setlist, songIds: newSongIds });
  };

  const activeSongs = activeSetlist ? getSetlistSongs(activeSetlist) : [];
  const activeSetlistObj = setlists.find((s) => s.id === activeSetlist);

  return (
    <div className="px-4 py-2 space-y-1.5">
      {/* Setlist tabs row */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {setlists.map((sl) => (
          <div key={sl.id} className="relative group shrink-0">
            <button
              onClick={() =>
                setActiveSetlist(activeSetlist === sl.id ? null : sl.id)
              }
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                activeSetlist === sl.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 border border-zinc-700/50"
              }`}
            >
              {sl.name}
              <span className="ml-1 text-zinc-600">
                ({sl.songIds.length})
              </span>
            </button>
            <button
              onClick={() => {
                if (activeSetlist === sl.id) setActiveSetlist(null);
                removeSetlist(sl.id);
              }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-zinc-700 rounded-full text-[8px] text-zinc-400 hover:text-red-400 hover:bg-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="Verwijder setlist"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Nieuwe setlist */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSetlist()}
            placeholder="+ Nieuwe setlist"
            className="w-32 px-2 py-1 text-xs bg-zinc-800/30 border border-zinc-800 rounded text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Voeg huidig nummer toe */}
        {song && activeSetlist && (
          <button
            onClick={() => addSongToSetlist(activeSetlist, song.id)}
            className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-500 hover:text-amber-400 rounded border border-zinc-700/50 whitespace-nowrap transition-colors shrink-0"
          >
            + Voeg &quot;{song.title}&quot; toe
          </button>
        )}
      </div>

      {/* Songs in actieve setlist */}
      {activeSetlist && activeSongs.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activeSongs.map((s) => s.songId)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {activeSongs.map((item) => (
                <SortableSongItem
                  key={item.songId}
                  item={item}
                  onLoad={() => handleLoadSong(item.songId)}
                  onRemove={() =>
                    removeSongFromSetlist(activeSetlist, item.songId)
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {activeSetlist && activeSongs.length === 0 && (
        <p className="text-[10px] text-zinc-700 py-1">
          Zoek een nummer en voeg het toe aan &quot;{activeSetlistObj?.name}&quot;
        </p>
      )}
    </div>
  );
}
