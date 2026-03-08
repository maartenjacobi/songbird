import { NextRequest, NextResponse } from "next/server";
import { searchTrack } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist") || "";
  const title = searchParams.get("title") || "";

  if (!title) {
    return NextResponse.json(
      { error: "Title is verplicht" },
      { status: 400 }
    );
  }

  try {
    const metadata = await searchTrack(artist, title);
    if (!metadata) {
      return NextResponse.json(
        { error: "Niet gevonden" },
        { status: 404 }
      );
    }
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json(
      { error: "Spotify API fout" },
      { status: 500 }
    );
  }
}
