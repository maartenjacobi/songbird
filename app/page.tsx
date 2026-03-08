"use client";

import { SongProvider } from "@/contexts/SongContext";
import { FretboardProvider } from "@/contexts/FretboardContext";
import { AppProvider } from "@/contexts/AppContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import TopBar from "@/components/layout/TopBar";
import LeftPanel from "@/components/layout/LeftPanel";
import RightPanel from "@/components/layout/RightPanel";
import SetlistPanel from "@/components/setlist/SetlistPanel";
import KeyboardHandler from "@/components/layout/KeyboardHandler";

export default function Home() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SongProvider>
          <FretboardProvider>
            <div className="h-screen flex flex-col">
              <KeyboardHandler />
              {/* Top bar */}
              <TopBar />

              {/* Main content */}
              <div className="flex-1 flex overflow-hidden">
                <ErrorBoundary
                  fallback={
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                      Fout bij laden van het nummer. Probeer opnieuw te zoeken.
                    </div>
                  }
                >
                  <LeftPanel />
                </ErrorBoundary>
                <ErrorBoundary
                  fallback={
                    <div className="w-[420px] flex items-center justify-center text-zinc-500 text-sm">
                      Fout bij laden van tools.
                    </div>
                  }
                >
                  <RightPanel />
                </ErrorBoundary>
              </div>

              {/* Bottom: Setlists */}
              <div className="border-t border-zinc-800/50 bg-zinc-950/80">
                <SetlistPanel />
              </div>
            </div>
          </FretboardProvider>
        </SongProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
