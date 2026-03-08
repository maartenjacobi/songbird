import { NextRequest, NextResponse } from "next/server";

async function fetchFromSongsterr(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const response = await fetch(
      `https://www.songsterr.com/a/ra/songs.json?pattern=${query}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    const songs = await response.json();
    if (songs.length > 0) {
      return `{title: ${songs[0].title}}\n{artist: ${songs[0].artist.name}}\n\n# Gevonden op Songsterr (alleen metadata, geen chords beschikbaar via API)`;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchFromChordsApi(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    // Probeer een open chords API
    const query = encodeURIComponent(`${artist} ${title}`);
    const response = await fetch(
      `https://api.uberchord.com/v1/chords?nameLike=${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return null; // Uberchord geeft akkoordinfo, geen lyrics
  } catch {
    return null;
  }
}

// Demo ChordPro data voor als er geen API resultaten zijn
function getDemoChordPro(artist: string, title: string): string {
  const demos: Record<string, string> = {
    "john mayer_gravity": `{title: Gravity}
{artist: John Mayer}
{key: G}

{comment: Intro}
[G] [C]

{comment: Verse 1}
[G]Gravity is working against [C]me
And [G]gravity wants to bring me [C]down

{comment: Chorus}
Oh I'll never know what makes this [Am]man
With all the [C]love that his heart can [G]stand
Dream of [Am]ways to throw it all [D]away

{comment: Verse 2}
[G]Oh gravity is working against [C]me
And [G]gravity wants to bring me [C]down

Oh [Am]twice as much ain't [C]twice as good
And [Am]can't sustain like a [D]one half could
It's [Am]wanting more that's gonna [C]send me to my [G]knees

{comment: Chorus}
[G]Oh [G/F#]gravity, [Em]stay the hell away [C]from me
[G]Oh [G/F#]gravity has [Em]taken better men than [C]me
Now how can [Am]that be?

{comment: Bridge}
Just [Am]keep me where the [C]light is
Just [Am]keep me where the [C]light is
Just [Am]keep me where the [D]light is
Come on [G]keep me where the light [C]is
Come on [G]keep me where the [C]light is`,

    "john mayer_slow dancing in a burning room": `{title: Slow Dancing In A Burning Room}
{artist: John Mayer}
{key: C#m}

{comment: Intro}
[C#m] [A] [E] [B]

{comment: Verse 1}
[C#m]It's not a silly little [A]moment
[E]It's not the storm before the [B]calm
[C#m]This is the deep and dying [A]breath of
[E]This love that we've been [B]working on

{comment: Pre-Chorus}
[C#m]Can't seem to hold you like I [A]want to
[E]So I can feel you in my [B]arms
[C#m]Nobody's gonna come and [A]save you
[E]We pulled too many false [B]alarms

{comment: Chorus}
[A]We're going [E]down
And you can [B]see it too
We're going [A]down
And you [E]know that we're [B]doomed
My dear, we're [A]slow [E]dancing in a [B]burning room`,

    "oasis_wonderwall": `{title: Wonderwall}
{artist: Oasis}
{key: F#m}

{comment: Intro}
[Em7] [G] [Dsus4] [A7sus4]

{comment: Verse 1}
[Em7]Today is [G]gonna be the day that they're
[Dsus4]gonna throw it back to [A7sus4]you
[Em7]By now you [G]should've somehow
[Dsus4]realized what you gotta [A7sus4]do
[Em7]I don't believe that [G]anybody
[Dsus4]feels the way I [A7sus4]do
About you [C]now [D] [Em7]

{comment: Verse 2}
[Em7]Backbeat, the [G]word is on the street
That the [Dsus4]fire in your heart is [A7sus4]out
[Em7]I'm sure you've [G]heard it all before
But you [Dsus4]never really had a [A7sus4]doubt

{comment: Pre-Chorus}
[Em7]And all the [G]roads we have to [Dsus4]walk are winding [A7sus4]
[Em7]And all the [G]lights that lead us [Dsus4]there are blinding [A7sus4]
[C]There are many [D]things that I would
[Em7]Like to say to you but I don't know [A7sus4]how

{comment: Chorus}
Because [C]maybe [Em7] [G]
You're gonna be the one that [Em7]saves me
And [C]after [Em7]all [G]
You're my wonder[Em7]wall`,

    "ed sheeran_thinking out loud": `{title: Thinking Out Loud}
{artist: Ed Sheeran}
{key: D}

{comment: Verse 1}
[D]When your legs don't work like they [D/F#]used to before
[G]And I can't sweep you off of your [A]feet
[D]Will your mouth still remember the [D/F#]taste of my love
[G]Will your eyes still smile from your [A]cheeks

{comment: Pre-Chorus}
And darling [Bm]I will be [G]loving you
Till [D]we're [A]seventy
And [Bm]baby my [G]heart could still fall as
[D]Hard [A]at twenty-three

{comment: Chorus}
And I'm thinking [Bm]'bout how [G]
[D]People fall in love in [A]mysterious ways
[Bm]Maybe just the [G]touch of a hand
Oh [D]me I fall in love with you [A]every single day
And [Bm]I just wanna [G]tell you I [A]am

So honey [D]now
[D/F#]Take me into your [G]loving arms
[A]Kiss me under the [D]light of a [D/F#]thousand stars
[G]Place your head on my [A]beating heart
I'm thinking [D]out [D/F#]loud
Maybe [G]we found love right [A]where we [D]are`,
  };

  const key = `${artist.toLowerCase()}_${title.toLowerCase()}`;
  return (
    demos[key] ||
    `{title: ${title}}\n{artist: ${artist}}\n\n{comment: Verse}\n[C]Lyrics niet gevonden.\n[Am]Zoek handmatig of [F]voer ChordPro in [G]via de editor.`
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist") || "";
  const title = searchParams.get("title") || "";

  if (!title && !artist) {
    return NextResponse.json(
      { error: "Artist of title is verplicht" },
      { status: 400 }
    );
  }

  // Waterval: probeer bronnen
  // 1. Songsterr (beperkt, alleen metadata)
  // 2. Demo data als fallback
  const chordpro = getDemoChordPro(artist, title);

  return NextResponse.json({
    chordpro,
    source: "demo",
  });
}
