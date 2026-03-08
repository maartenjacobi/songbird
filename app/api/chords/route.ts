import { NextRequest, NextResponse } from "next/server";

// Demo ChordPro data
const DEMO_SONGS: Record<string, string> = {
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

  "fleetwood mac_dreams": `{title: Dreams}
{artist: Fleetwood Mac}
{key: F}

{comment: Intro}
[F] [G] [F] [G]

{comment: Verse 1}
[F]Now here you [G]go again
You say [F]you want your free[G]dom
[F]Well who am [G]I to keep you down
[F] [G]

{comment: Verse 2}
[F]It's only [G]right that you should
[F]Play the way you [G]feel it
But [F]listen carefully to the [G]sound
Of your [F]loneliness like a [G]heartbeat drives you mad
In the [F]stillness of remem[G]bering what you had
And what you [F]lost [G]
And what you [F]had [G]
And what you [F]lost [G]

{comment: Chorus}
[Am]Oh [G]thunder only [F]happens when it's [G]raining
[Am]Players [G]only love you when they're [F]playing [G]
[Am]Say [G]women they will [F]come and they will [G]go
[Am]When the [G]rain washes [F]you clean you'll [G]know
You'll [F]know [G] [F] [G]`,

  "eagles_hotel california": `{title: Hotel California}
{artist: Eagles}
{key: Bm}

{comment: Intro}
[Bm] [F#7] [A] [E7] [G] [D] [Em] [F#7]

{comment: Verse 1}
[Bm]On a dark desert highway, [F#7]cool wind in my hair
[A]Warm smell of colitas, [E7]rising up through the air
[G]Up ahead in the distance, [D]I saw a shimmering light
[Em]My head grew heavy and my sight grew dim,
[F#7]I had to stop for the night

{comment: Verse 2}
[Bm]There she stood in the doorway, [F#7]I heard the mission bell
[A]And I was thinking to myself this could be [E7]heaven or this could be hell
[G]Then she lit up a candle, [D]and she showed me the way
[Em]There were voices down the corridor, [F#7]I thought I heard them say

{comment: Chorus}
[G]Welcome to the Hotel Cali[D]fornia
Such a [Em]lovely place, such a lovely place
Such a [F#7]lovely face
[G]Plenty of room at the Hotel Cali[D]fornia
Any [Em]time of year, any time of year
You can [F#7]find it here`,

  "nirvana_come as you are": `{title: Come As You Are}
{artist: Nirvana}
{key: Em}

{comment: Intro}
[Em] [D] [Em] [D]

{comment: Verse 1}
[Em]Come as you are, [D]as you were
[Em]As I want [D]you to be
[Em]As a friend, [D]as a friend
[Em]As an old [D]enemy

{comment: Pre-Chorus}
[Em]Take your time, [D]hurry up
[Em]The choice is yours, [D]don't be late
[Em]Take a rest, [D]as a friend
[Em]As an old memori[D]a

{comment: Chorus}
[C]Memoria [D]
[C]Memoria [D]
[C]Memoria [D]
[C]Memoria [D]

{comment: Verse 2}
[Em]Come doused in mud, [D]soaked in bleach
[Em]As I want [D]you to be
[Em]As a trend, [D]as a friend
[Em]As an old memori[D]a`,

  "bob marley_redemption song": `{title: Redemption Song}
{artist: Bob Marley}
{key: G}

{comment: Intro}
[G] [Em] [C] [G/B] [Am]

{comment: Verse 1}
[G]Old pirates, yes, they [Em]rob I
[C]Sold I to the [G/B]merchant [Am]ships
[G]Minutes after they [Em]took I
[C]From the [G/B]bottomless [Am]pit

{comment: Pre-Chorus}
But my [G]hand was made [Em]strong
[C]By the hand of the [G/B]Al[Am]mighty
We [G]forward in this gene[Em]ration
[D]Triumphantly

{comment: Chorus}
Won't you [G]help to [C]sing [D]
These [G]songs of [C]freedom [D]
'Cause [G]all I [C]ever [D]had
[Em]Redemption [C]songs [D]
[Em]Redemption [C]songs [D] [G]
[C] [D]

{comment: Verse 2}
E[G]mancipate your[Em]selves from mental [C]slavery
None but our[G/B]selves can [Am]free our minds
[G]Have no fear for [Em]atomic energy
[C]'Cause none of [G/B]them can [Am]stop the time`,
};

function findDemoSong(artist: string, title: string): string | null {
  const key = `${artist.toLowerCase()}_${title.toLowerCase()}`;
  if (DEMO_SONGS[key]) return DEMO_SONGS[key];

  // Fuzzy match: zoek op gedeeltelijke titel
  for (const [demoKey, chordpro] of Object.entries(DEMO_SONGS)) {
    const demoTitle = demoKey.split("_")[1];
    if (title.toLowerCase().includes(demoTitle) || demoTitle.includes(title.toLowerCase())) {
      return chordpro;
    }
  }

  return null;
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

  // 1. Demo data (altijd beschikbaar)
  const demo = findDemoSong(artist, title);
  if (demo) {
    return NextResponse.json({ chordpro: demo, source: "demo" });
  }

  // 2. Genereer placeholder ChordPro
  return NextResponse.json({
    chordpro: `{title: ${title}}\n{artist: ${artist}}\n\n{comment: Info}\nGeen akkoorden gevonden voor dit nummer.\nJe kunt ChordPro handmatig invoeren of een andere zoekopdracht proberen.\n\n{comment: Tip}\nProbeer: "John Mayer - Gravity", "Oasis - Wonderwall",\n"Eagles - Hotel California", "Nirvana - Come As You Are",\n"Bob Marley - Redemption Song", "Fleetwood Mac - Dreams"`,
    source: "placeholder",
  });
}
