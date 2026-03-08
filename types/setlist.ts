export interface Setlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SetlistSong {
  songId: string;
  title: string;
  artist: string;
  key?: string;
}
