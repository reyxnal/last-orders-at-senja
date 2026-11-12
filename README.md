# Last Orders at Senja

An original interactive narrative for The Chroma Awards, Season 2 (Game division — Interactive Narrative). One rainy night, five visitors, five endings. English. No account, no backend, no data collected.

## Play it locally

**Option A — double-click:** open `index.html` in any modern browser. It works from `file://` with no server.

**Option B — local server** (recommended for the most browser-faithful behaviour):

```sh
cd chroma-game
python3 -m http.server 8000
# then open http://localhost:8000/
```

No build step. No dependencies. No internet needed.

## Controls

- Mouse / tap: click choices and buttons; click the story text to finish typing instantly.
- Keyboard: `Enter`/`Space` continue · `1`–`3` choose · `M` mute · `J` shelf & journal · `Esc` close panels.

## Files

| File | What it is |
|---|---|
| `index.html` | The game shell (title, HUD, modals). Start here. |
| `story.js` | Story graph data (90 nodes) + ending rules. |
| `game.js` | Game engine (rendering, save/load, gallery, chapter select). |
| `audio.js` | Original procedural music & sound (Web Audio, no audio files). |
| `style.css` | All styling (system fonts only). |
| `assets/` | 9 original AI-generated illustrations. |
| `DESIGN.md` | Synopsis, chapters, choice map, endings, asset prompts. |
| `AI-DISCLOSURE.md` | Draft AI disclosure text for the submission form. |
| `TEST-REPORT.md` | Test evidence, incl. verified choice sequences for all 5 endings. |
| `PRE-SUBMIT-CHECK.md` | Pre-submit verification + honest gap list. |
| `test-story.js` | Story-graph test harness (dev-only). Run: `node test-story.js` |
| `canonical-paths.json`, `ending-paths.json` | Test outputs (dev-only). |
| `test-evidence/` | Browser-test screenshots + results (dev-only). |
| `provenance/` | Artwork generation receipts (dev-only). |

## Submission file set

The playable game is exactly: `index.html`, `story.js`, `game.js`, `audio.js`, `style.css`, `assets/`. Everything else in this folder is documentation or dev evidence — exclude `test-story.js`, `*.json`, `test-evidence/` and `provenance/` from the submission zip/download, or keep them only if the form asks for supporting material.

## Credits (short)

Creative direction: Zul Zulfikar. Writing, design & code with the assistance of Muse. Artwork: original AI-generated images. Music & sound: 100% original procedural Web Audio code. Full disclosure: see the in-game Credits screen and `AI-DISCLOSURE.md`.
