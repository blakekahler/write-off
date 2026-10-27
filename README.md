# Write-Off

An Oregon Trail style game about why studios shelve finished movies. MNGT 301 semester project, team durKheim, University of Nebraska-Lincoln, Fall 2026.

## Play it

Live at https://blakekahler.github.io/write-off/ (GitHub Pages). Or open `index.html` in any browser. Works on phones. Number keys 1 to 3 pick choices on a keyboard.

## What's in here

| File | What it is | Who touches it |
| --- | --- | --- |
| `CLAUDE.md` | Project rules for Claude Code | Blake |
| `SPEC.md` | The full game spec: screens, state, economics, visuals | Blake |
| `PROMPTS.md` | The build phases to paste into Claude Code, in order | Blake |
| `scenarios.js` | Every stop, choice, outcome card, source, random event and rule card | Writers |
| `index.html` | The engine and styles | Claude Code |
| `scenes.js` | The pixel LA backgrounds, the car and the tombstone | Claude Code, then the art teammate |
| `rules.js` | Round-two rule math | Claude Code |
| `test/play.js` | Optional Playwright script that plays both rounds and reports errors | Claude Code |
| `test/scenes.html` | A gallery page showing all ten scenes side by side | The art teammate |

## Editing content

Writers only edit `scenarios.js`. Each stop has a three-sentence `setup`, three `choices` with one-line labels, and a `card` with `did`, `next`, `driver`, `chip` and `source`. Keep the setups at three sentences, keep the choices to one line, and don't change a number on a card without a source. The dollar effects on choices (`thisYear`, `threeYear`, `writeOff`) are game numbers; if you change the December ones, run `checkFlip()` in the browser console to make sure round two still flips the decision.

## Deploying

The game is four static files at the repo root (`index.html`, `scenarios.js`, `scenes.js`, `rules.js`). All script tags are relative paths, so the same files work opened from a folder on your laptop and served from GitHub Pages.

The repo is https://github.com/blakekahler/write-off and Pages serves `main` from the root, so every `git push origin main` redeploys the site at https://blakekahler.github.io/write-off/ within a minute or two. That link is what we submit to Canvas.

If Pages ever needs to be set up again: Settings > Pages > Build and deployment > Source: Deploy from a branch > Branch `main`, folder `/ (root)` > Save.

## Testing

Open `index.html` and play a round. For the automated check, `test/play.js` plays both rounds in headless Chromium at phone width, prints the two receipts, runs `checkFlip()`, and fails if anything throws, if the page scrolls sideways, if a choice button is under 48px, or if an outcome card needs a scroll bar.

```
node test/play.js                  # full speed, screenshots in test/out/
FAST=1 node test/play.js           # reduced motion, no travel animation
R1=shelve R2=release RULE=rightsRevert node test/play.js   # pick strategies and the round-two rule
```

It needs Playwright with Chromium available to Node (`npm i -g playwright && npx playwright install chromium`). That is a tool on your machine, not a project dependency; the game itself has none.

`checkFlip()` also runs from the browser console on any screen.

## Build log

Pedro asked for a log of what we built, tested, and changed. Keep it in `LOG.md` with a dated line per change and per playtest.
