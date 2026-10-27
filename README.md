# Write-Off

An Oregon Trail style game about why studios shelve finished movies. MNGT 301 semester project, team durKheim, University of Nebraska-Lincoln, Fall 2026.

## Play it

Open `index.html` in any browser, or visit the GitHub Pages URL once it's deployed. Works on phones.

## What's in here

| File | What it is | Who touches it |
| --- | --- | --- |
| `CLAUDE.md` | Project rules for Claude Code | Blake |
| `SPEC.md` | The full game spec: screens, state, economics, visuals | Blake |
| `PROMPTS.md` | The build phases to paste into Claude Code, in order | Blake |
| `scenarios.js` | Every stop, choice, outcome card, source, random event and rule card | Writers |
| `index.html` | The engine and styles | Claude Code |
| `scenes.js` | The pixel LA backgrounds | Claude Code, then the art teammate |
| `rules.js` | Round-two rule math | Claude Code |

## Editing content

Writers only edit `scenarios.js`. Each stop has a three-sentence `setup`, three `choices` with one-line labels, and a `card` with `did`, `next`, `driver`, `chip` and `source`. Keep the setups at three sentences, keep the choices to one line, and don't change a number on a card without a source. The dollar effects on choices (`thisYear`, `threeYear`, `writeOff`) are game numbers; if you change the December ones, run `checkFlip()` in the browser console to make sure round two still flips the decision.

## Deploying

Push to GitHub, then Settings > Pages > Deploy from a branch > `main` > `/ (root)`. The site goes live at `https://<user>.github.io/write-off/` in a minute or two. That link is what we submit to Canvas.

## Build log

Pedro asked for a log of what we built, tested, and changed. Keep it in `LOG.md` with a dated line per change and per playtest.
