# Last Orders at Senja — Design Notes

An original interactive narrative for **The Chroma Awards, Season 2 — Game division, Interactive Narrative category** (presented by Pickford).

- **Language:** English (all in-game text).
- **Length:** one sitting of roughly 20–30 minutes; 7,327 words of story prose across 90 story nodes.
- **Content note:** themes of grief and loss. No jump scares, no flashing/strobe imagery, no time pressure, no graphic content.
- **Originality:** all characters, the stall, the street and the story are fictional and invented for this game. No third-party IP, brands, franchises, logos or real likenesses. No personal data of any real person is used in the game.

## Synopsis

Rain has been falling since dusk over a fictional Jakarta street. Warung Senja — a tiny street coffee stall named for its late founder, Senja — closes for good at dawn. The player is Senja's child, who kept the stall going for one year after her death and signed the closing papers a month ago.

Over five hours of one rainy night (21:40 to dawn), five visitors arrive, one per chapter. Each wants a drink, and each brings a thread of the past with them. What the player brews, what they say, and what they keep decides which of five dawns arrives.

Themes: grief, forgiveness, letting go, memory, and the idea that a promise — like a stall, like kindness — can move and change shape without breaking.

## Characters (all fictional)

| Character | Chapter | Role |
|---|---|---|
| The Keeper (player, unnamed, gender-neutral) | All | Inherited the stall from their late mother; must decide what the night means. |
| Senja (deceased, seen only in memory) | — | Founder of the stall. Warm, stubborn, funny. Present through objects, letters and other people's stories. |
| Ardi | 1 — 22:00, The Brother | Younger brother, estranged for three years after walking out mid-argument. Returns on the last night. |
| Bu Ratna | 2 — 23:30, The Teacher | Retired teacher, 40 years at the school at the end of the street. Taught Senja, then the Keeper. |
| Dimas | 3 — 01:00, The Friend | Childhood best friend. Leaves Jakarta at dawn for a job across the sea. |
| Sinta | 4 — 03:00, The Stranger | A stranger in the rain carrying a dented thermos that belongs to the stall — and who knows the recipe exactly. Soft magical realism: the thermos is still warm after many years. Tasteful, no horror. |
| — (dawn) | 5 — 05:00, Dawn | A solo closing hour. The rain stops. The Keeper brews one last cup and decides the next thing. |

## Structure

- **Prologue** (21:40): the stall, the ritual, one opening choice.
- **Chapters 1–4**: one visitor each. Each chapter follows the same readable rhythm with different content:
  1. Arrival scene → **dialogue choice** (honest / kind / guarded — 3 options).
  2. Unique response scene → **drink choice** (kopi tubruk / teh jahe / cokelat panas — 3 options, each with a unique follow-up scene).
  3. **Shelf moment choice** (3 options, one of which keeps a memory object; Chapter 4 has one conditional option that only appears if the recipe card was kept).
  4. Closing scene that varies with how the chapter went (warm/cool variants in Chapters 1–3; thermos variant in Chapter 4).
- **Chapter 5 (Dawn)**: shelf choice → final brew (drink choice for the Keeper) → dawn decision (3 options) → ending.
- **Endings**: each ending is two full nodes — an ending scene plus a distinct epilogue. No two endings share text.

**Choice points: 16** (1 prologue + 3 per chapter × 4 + 3 in Chapter 5). Every choice changes meters, flags, items, journal entries, or which closing variant plays. There are no fake choices.

## Mechanics

### Three quiet meters: Memory, Warmth, Truth

- Meters start at 0 and grow through choices. They are shown in the HUD as labelled rows of 10 dots (no numbers, no colour-only information — labels + dots + aria-labels).
- **Drinks steer consistently**, so players can learn the language of the game: kopi tubruk (strong black coffee) → Truth +2; teh jahe (ginger tea) → Warmth +2; cokelat panas (hot chocolate) → Memory +2.
- **Dialogue:** honest options → Truth; kind options → Warmth; guarded options (silence, jokes, distance) → nothing. Guarded play is a valid choice with real consequences: the night passes unheld.
- **Shelf moments:** keeping an object → Memory +1; asking/learning → Warmth or Truth.
- After each choice, a short toast names what stirred ("A memory surfaces." / "Warmth grows." / "The truth lands."), and the changed meter pulses.

### Memory shelf & journal

Five keepsakes, one per chapter, each kept through a specific choice:

| Item | Chapter | How it is kept |
|---|---|---|
| Ibu's recipe card | 1 | Show Ardi the card kept behind the jars. |
| The faded photograph | 2 | Open Bu Ratna's envelope. |
| Two old bus tickets | 3 | Open the drawer under the counter. |
| The dented thermos | 4 | Accept the thermos and set it on the shelf. |
| The chipped cup | 5 | Take down the cup from the highest shelf. |

The shelf/journal panel shows kept items (with art + description) and journal entries earned along the way. Keeping the recipe card unlocks an extra option in Chapter 4 (offering the recipe onward to Sinta). Keeping all five is required for the best ending.

### Endings and their exact conditions

Evaluated once, at the end of Chapter 5, by `pickEnding()` in `story.js` — in this priority order:

| # | Ending | Condition | Meaning |
|---|---|---|---|
| 1 | **Dawn Shift** (best) | Memory ≥ 5 AND Warmth ≥ 5 AND Truth ≥ 5 AND all 5 keepsakes | The balanced, fully-remembered night. The stall closes but the promise moves: a new dawn-hours place, with everyone in it. |
| 2 | **Open Again** | Warmth ≥ 6 AND Memory ≥ 4 (and not #1) | Warmth + remembrance. The street rallies; the stall stays open. |
| 3 | **The Unsent Letter** | Truth ≥ 6 AND Warmth ≤ 5 (and not #1–2) | The honest night. The stall closes, but the honest letter is finally written — and answered. |
| 4 | **The Last Cup** | Memory ≥ 6 (and not #1–3) | The remembering night. The stall closes; everything loved is carried into a new kitchen and taught onward. |
| 5 | **The Empty Chair** | Anything else (fallback) | The unheld night. A quiet, unresolved closing — with the door left open for a return. |

Design note: endings reward *combinations*, not single-meter maximising. A night of pure warmth with nothing kept and nothing faced ends with the Empty Chair; warmth *plus* kept memories reopens the stall. All five endings were verified reachable by exhaustive state search and by hand-designed canonical playthroughs (see TEST-REPORT.md). Every ending has a distinct scene + epilogue (10 nodes total).

### Conditional scenes

- Chapter closing variants: warm closings (Ch. 1: Warmth ≥ 3 or Truth ≥ 3; Ch. 2: Warmth ≥ 4 or Memory ≥ 4; Ch. 3: Warmth ≥ 5 or Truth ≥ 5) vs. cool closings; Chapter 4 has a dedicated thermos-accepted closing.
- Chapter 4 conditional choice: offering the recipe card onward appears only if the recipe card was kept in Chapter 1.

## Features

- Title screen with content note; Begin / Continue (save) / Chapter Select / Ending Gallery / Settings / Credits.
- Autosave to browser localStorage on every node; Continue resumes exactly. No account, no backend, no data leaves the device.
- Chapter progress indicator (chapter dots + time + guest) and meter HUD.
- Memory shelf + journal panel (key `J`).
- Ending gallery: unlocked endings show art + blurb; locked ones show `???` with a hint.
- Chapter select (unlocked after the first completed run): revisit any chapter with a balanced starting heart (meters 2/2/2) and the keepsakes of earlier chapters. Note: the truest ending (Dawn Shift) needs a full night from the prologue — chapter select starts cannot reach all five endings (see TEST-REPORT.md §6).
- Restart, mute, four text speeds (Slow / Normal / Fast / Instant), keyboard + mouse + tap play, responsive desktop/mobile layout, no timers.
- Credits screen with full, honest AI disclosure (also in AI-DISCLOSURE.md).

## Assets

All artwork is original AI-generated illustration made for this game, in one consistent style: warm cinematic painterly illustration — dark teal-blue night + amber lamplight, rainy Jakarta street. No text, logos or real likenesses in any image. Files in `assets/` (JPEG, ~4.5 MB total):

| File | Use | Dimensions |
|---|---|---|
| `hero-thumbnail.jpg` | Title background + submission thumbnail | 1920×1280 |
| `bg-warung-night.jpg` | Main scene background | 1920×1280 |
| `portrait-ardi.jpg` | Ardi portrait | 1600×1600 |
| `portrait-ratna.jpg` | Bu Ratna portrait | 1600×1600 |
| `portrait-dimas.jpg` | Dimas portrait | 1600×1600 |
| `portrait-sinta.jpg` | Sinta portrait (with thermos) | 1600×1600 |
| `vignette-recipe.jpg` | Recipe card / memory vignette | 1920×1280 |
| `vignette-photograph.jpg` | Photograph / memory vignette | 1920×1280 |
| `vignette-dawn.jpg` | Dawn scenes + Dawn Shift ending | 1920×1280 |

### Generation prompts (as issued, 12 Nov 2026)

Style block shared by all prompts: warm cinematic painterly illustration; dark teal-blue night + amber lamplight; soft brushwork; original fictional scene/character; no text, no logos, no real person.

1. **hero-thumbnail** — "Wide cinematic digital painting, 16:9 landscape: a small fictional street coffee stall in Jakarta at night in gentle rain, warm amber hanging bulbs glowing against a dark teal-blue night, steam rising from a kettle on a wooden counter, wet pavement reflecting golden light, silhouettes of shophouse facades and a rain-soaked street receding into mist, one empty wooden stool waiting, cozy and melancholic, painterly illustration style, soft brushwork, no text, no words, no logos, no real people, original fictional scene."
2. **bg-warung-night** — "Warm cinematic digital painting, wide interior view of a small fictional Jakarta street coffee stall at night seen from behind the wooden counter: shelves with glass jars, a dented kettle steaming on a small stove, hanging amber bulbs, rain visible through the open front, wet street and shophouse lights outside in dark teal-blue, a chalkboard with no readable words, chipped ceramic cups lined up, cozy intimate melancholic mood, painterly illustration, soft brushwork, no readable text, no logos, no people, original fictional scene."
3. **portrait-ardi** — "Painterly bust portrait illustration of a fictional young Indonesian man in his late twenties, tired eyes, short tousled black hair, wearing a damp dark hoodie, standing in warm amber lamplight against a dark teal-blue rainy night background, gentle rain bokeh, weary but kind expression, consistent warm cinematic illustration style, soft brushwork, original fictional character, not a likeness of any real person, no text, no logos."
4. **portrait-ratna** — "Painterly bust portrait illustration of a fictional elderly Indonesian woman in her seventies, silver hair in a neat bun, wearing a deep indigo batik shawl over a simple blouse, warm wise smile with laugh lines, holding a small umbrella, warm amber lamplight against a dark teal-blue rainy night background, gentle rain bokeh, consistent warm cinematic illustration style, soft brushwork, original fictional character, not a likeness of any real person, no text, no logos."
5. **portrait-dimas** — "Painterly bust portrait illustration of a fictional Indonesian man in his early thirties, warm friendly grin, short black hair, light stubble, wearing a mustard-yellow rain jacket with the hood down and a backpack strap over one shoulder, warm amber lamplight against a dark teal-blue rainy night background, gentle rain bokeh, consistent warm cinematic illustration style, soft brushwork, original fictional character, not a likeness of any real person, no text, no logos."
6. **portrait-sinta** — "Painterly bust portrait illustration of a fictional Indonesian woman in her mid-thirties, calm mysterious gentle expression, long black hair damp from rain, wearing a dark green raincoat, cradling an old dented steel thermos flask in both hands, warm amber lamplight against a dark teal-blue rainy night background, gentle rain bokeh, consistent warm cinematic illustration style, soft brushwork, original fictional character, not a likeness of any real person, no text, no logos."
7. **vignette-recipe** — "Warm painterly close-up illustration, memory vignette style with soft golden glow and gentle blur at the edges: an old handwritten recipe card with blurred unreadable handwriting resting beside a chipped ceramic cup of steaming coffee and a small spoon on a worn wooden counter, a dried flower pressed nearby, amber lamplight, dark teal shadows, nostalgic tender mood, soft brushwork, no readable text, no real handwriting, no logos, original fictional scene."
8. **vignette-photograph** — "Warm painterly illustration, faded memory vignette in soft sepia and amber tones with gentle blur at the edges: a small old photograph lying on a wooden counter showing the blurred silhouettes of a mother and a young child laughing together behind a tiny coffee stall, the photo edges curled and worn, a cup of coffee beside it, amber lamplight, tender nostalgic mood, faces soft and indistinct, soft brushwork, no readable text, no logos, original fictional scene, no real people."
9. **vignette-dawn** — "Warm painterly illustration, wide view: first dawn light breaking over a quiet Jakarta street after rain, soft gold and rose light washing over wet pavement, the small silhouette of a street coffee stall with its amber lamps still glowing, steam curling upward, sky shifting from deep teal-blue to pale gold, hopeful tender quiet mood, soft brushwork, consistent warm cinematic illustration style, no text, no logos, no people, original fictional scene."

Generation receipts (snapshot IDs + source references) are kept in `provenance/` (dev-only, not part of the game).

## Audio (100% original, synthesised live in code)

No audio files, samples or recordings. `audio.js` synthesises everything with the Web Audio API:

- **Melody:** a sparse random-walk pluck melody over a pentatonic scale, with rests — a different scale, rain level and brightness per chapter (Ch. 4 sparsest and lowest; Ch. 5 brightest, major pentatonic, rain nearly gone).
- **Pad:** two detuned low sine tones per chapter root.
- **Rain:** looped filtered-noise buffer (brown-ish noise through lowpass + highpass), mixed per chapter.
- **Foley:** pour (band-passed noise sweep), cup clink (two sine pings), item chime (three-note), UI tick.
- Audio starts only after the first user gesture (click/keypress), per browser autoplay rules. Mute toggle in HUD + Settings, persisted. If Web Audio is unavailable, the game plays silently with no errors.

## Technical architecture

Static site, zero dependencies, zero network calls:

| File | Role |
|---|---|
| `index.html` | Shell: title screen, game screen, HUD, modals (shelf, gallery, chapters, settings, credits). |
| `story.js` | Story graph data (90 nodes) + `pickEnding()`. Loadable in browser and Node (same file drives the game and the tests). |
| `game.js` | Engine: rendering, typewriter, choices, branches, meters, save/load, gallery, chapter select, keyboard. |
| `audio.js` | Procedural Web Audio engine (see above). |
| `style.css` | All styling. System font stack only — no external fonts. |
| `assets/*.jpg` | The 9 illustrations. |
| `test-story.js` | Node test harness (dev-only; not needed to play). |

Node schema: `{ id, ch, speaker, art, portrait, text, sfx, effects, choices[], next, branch[], ending, endingEval }`. Choices carry `{ label, next, effects, gives, journal, requires }`. Requirements support `flag / notFlag / meter+min / itemsMin / all / any`. Branch nodes resolve deterministically before rendering and are never displayed.

Runs from `file://` (double-click `index.html`) and from any static host. Works embedded in an iframe (no frame-busting, no top-navigation). localStorage is wrapped in try/catch with an in-memory fallback for restricted contexts.

## Accessibility

- Text/background contrast: warm off-white (#f5ead9) on near-black teal; amber accents pass for large/bold text.
- No information carried by colour alone: meters have text labels + dots; chapter progress has dots + text label; choices are full-text buttons.
- Buttons ≥ 44–48 px; keyboard play throughout (Enter/Space/1–3/M/J/Esc); visible focus outlines; `aria-live` story region; `prefers-reduced-motion` forces instant text and disables animation.
- No flashing, no autoplay audio, no time pressure.

## What was deliberately NOT copied

The brief forbade copying example ideas from the SpriteCook blog (lighthouse keeper, pixel phone mystery, mail delivery). None of those appear. The warung kopi setting, the five-visitor structure, the drink/meter language and all five endings are original to this game.
