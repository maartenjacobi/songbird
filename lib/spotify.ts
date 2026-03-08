import type { SongMetadata } from "@/types/song";

interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

let cachedToken: SpotifyToken | null = null;

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials niet geconfigureerd");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Spotify token ophalen mislukt");
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000 - 60000,
  };

  return cachedToken.access_token;
}

export async function searchTrack(
  artist: string,
  title: string
): Promise<SongMetadata | null> {
  const token = await getSpotifyToken();
  const query = encodeURIComponent(`track:${title} artist:${artist}`);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const track = data.tracks?.items?.[0];
  if (!track) return null;

  const metadata: SongMetadata = {
    albumArt: track.album?.images?.[0]?.url,
    spotifyId: track.id,
  };

  // Probeer audio features op te halen
  try {
    const featuresRes = await fetch(
      `https://api.spotify.com/v1/audio-features/${track.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (featuresRes.ok) {
      const features = await featuresRes.json();
      const keyNames = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ];
      if (features.key >= 0) {
        metadata.key =
          keyNames[features.key] + (features.mode === 0 ? "m" : "");
      }
      metadata.bpm = Math.round(features.tempo);
      metadata.timeSignature = `${features.time_signature}/4`;
    }
  } catch {
    // Audio features niet beschikbaar, geen probleem
  }

  return metadata;
}
