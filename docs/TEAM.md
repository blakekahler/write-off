# Working on Write-Off

Team notes. The public-facing README is at the repo root.

## What's in here

| File | What it is | Who touches it |
| --- | --- | --- |
| `CLAUDE.md` | Project rules for Claude Code | Blake |
| `SPEC.md` | The full game spec: screens, state, economics, visuals | Blake |
| `PROMPTS.md` | The build phases, in order | Blake |
| `scenarios.js` | Every stop, choice, outcome card, source, random event and rule card | Writers |
| `index.html` | The engine and styles | Claude Code |
| `scenes.js` | The pixel LA backgrounds, the car and the tombstone | Claude Code, then the art teammate |
| `rules.js` | Round-two rule math | Claude Code |
| `test/play.js` | Playwright script that plays both rounds and reports errors | Claude Code |
| `test/scenes.html` | A gallery page showing all ten scenes and the four cars side by side | The art teammate |
| `test/capture-iter.js` | Screenshots a checkout of the game for the build log | Whoever adds a log entry |
| `LOG.md` | One dated line per change and per playtest | Everyone |

## Editing content

Writers only edit `scenarios.js`. Each stop has a three-sentence `setup`, three `choices` with one-line labels, and a `card` with `did`, `next`, `driver`, `chip` and `source`. Keep the setups at three sentences, keep the choices to one line, and don't change a number on a card without a source. The dollar effects on choices (`thisYear`, `threeYear`, `writeOff`) are game numbers; if you change the December ones, run `checkFlip()` in the browser console to make sure round two still flips the decision.

The one-word `driver` tags are shown to players in plain words (TAX becomes "a tax break"). The map is `DRIVER_WORDS` near the top of the card code in `index.html`; add a line there if you add a new tag.

## Deploying

The repo is https://github.com/blakekahler/write-off and GitHub Pages serves `main` from the root, so every `git push origin main` redeploys https://blakekahler.github.io/write-off/ within a minute or two. That link is what we submit to Canvas.

If Pages ever needs to be set up again: Settings > Pages > Build and deployment > Source: Deploy from a branch > Branch `main`, folder `/ (root)` > Save.

## Testing

Open `index.html` and play a round. For the automated check, `test/play.js` plays both rounds in headless Chromium at phone width, prints the two receipts, runs `checkFlip()`, and fails if anything throws, if the page scrolls sideways, if a choice button is under 48px, or if an outcome card needs a scroll bar.

```
node test/play.js                  # full speed, screenshots in test/out/
FAST=1 node test/play.js           # reduced motion, no travel animation
WIDTH=375 HEIGHT=667 node test/play.js                     # small phone
R1=shelve R2=release RULE=rightsRevert node test/play.js   # strategies and the round-two rule
```

It needs Playwright with Chromium available to Node (`npm i -g playwright && npx playwright install chromium`). That is a tool on your machine, not a project dependency; the game itself has none. Test with animations on at least once: reduced-motion runs hide animation bugs.

`checkFlip()` also runs from the browser console on any screen.

## Adding a build-log entry

Each image in the README's build log came from `test/capture-iter.js`, which opens a checkout of the game in headless Chromium and screenshots named screens at phone size:

```
git worktree add /tmp/iter <commit>
node test/capture-iter.js /tmp/iter /tmp/iter-shots title,stop-animated,shelved,receipt
```

Panels it knows: `title`, `intro`, `stop-animated`, `stop-purge`, `stop-hollywood`, `stop-limo`, `card-dayone`, `card-purge`, `shelved`, `receipt`, `rules`, `stop-animated-r2`, `final`, `travel`, `event`, `tombstone`, `sources`, `gallery`. Tile the panels side by side, drop the image in `docs/build-log/`, add a dated entry to the README's build log, and add a line to `LOG.md`.
