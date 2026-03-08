export async function searchYouTube(
  artist: string,
  title: string
): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const query = encodeURIComponent(`${artist} ${title} guitar`);
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${apiKey}`
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0]?.id?.videoId || null;
}
