import { NextRequest, NextResponse } from "next/server";
import { searchYouTube } from "@/lib/youtube";

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
    const videoId = await searchYouTube(artist, title);
    return NextResponse.json({ videoId });
  } catch (error) {
    return NextResponse.json(
      { error: "YouTube API fout" },
      { status: 500 }
    );
  }
}
