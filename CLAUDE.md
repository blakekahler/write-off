# Write-Off

An Oregon Trail style browser game for our MNGT 301 semester project (team durKheim, UNL, Fall 2026). You play the new head of a studio the day after a merger, drive across Los Angeles for twelve months making real decisions that real executives made (Coyote vs. Acme, Batgirl, CNN+, TCM, Star Trek: Prodigy, Disney+, Mouse Guard), and learn after each choice what the real company did and why. Round one rewards shelving finished work. Round two replays the year with one rule changed, and the same decision stops making sense. That flip is the argument.

Read `SPEC.md` before writing any code. Read `PROMPTS.md` for the build phases. The scenario content already exists in `scenarios.js`; do not rewrite the copy or the sources, only wire them up.

## Stack (do not change)

- One `index.html` holding the engine, styles, and screens. Vanilla JavaScript. No framework, no bundler, no build step, no npm install. Opening the file in a browser must work.
- `scenarios.js` holds all stops, random events, and the rule-card copy as plain data (`window.WRITEOFF_DATA`). Writers on the team edit this file and nothing else.
- `scenes.js` holds one function per background that returns an SVG string at 320x180 (`window.WRITEOFF_SCENES`).
- `rules.js` holds the round-two rule logic (`window.WRITEOFF_RULES`).
- Fonts from Google Fonts only (Press Start 2P, VT323). No other external resources, no CDNs, no images from the web.
- Deploys to GitHub Pages from the repo root. The URL is what we submit to Canvas.

## Non-negotiable design rules

These come from the team. Anything that breaks them is wrong even if it works.

1. Simple to read, fun to play. A classmate on a phone with no instructions finishes a round in ten to fifteen minutes. Every screen is readable in ten seconds. Setups are three sentences max. Choices are one line each in plain words. Never more than four lines of text on screen at once outside the outcome card.
2. Three meters plus a crew counter on the status bar: Cash, Debt vs. target, Your Bonus, Crew working. Nothing else is shown. Goodwill and buyer count are tracked but hidden.
3. Money in plain dollars, rounded ($70M film, $30M write-off). No EBITDA, no leverage ratios, no accounting terms where a player can see them.
4. Lesson chips use the plain-words version from `scenarios.js`. The textbook terms stay in our write-up, not in the game.
5. The outcome card is three short lines, a driver tag, a lesson chip, and one source link. If it needs a scroll bar, it is too long.
6. Funny on purpose. Keep the Oregon Trail beats: the black "has been shelved" screen, tombstones from earlier players, the pace setting, the 405 crossing.
7. One sitting, one argument. Round one, receipt, round two, final receipt, log. No side quests, inventory, tutorials, or settings menus.

## Content rules

- Never draw Wile E. Coyote or any Looney Tunes character, the WB shield, the Hollywood sign lettering, real logos, or real people's faces. The hillside sign in the Griffith scene reads WRITE-OFF. Real titles, companies, and names appear only as text on outcome cards and the sources screen.
- Never upgrade a report to a fact. The claim that Zaslav never watched Coyote vs. Acme is from a single anonymous source in TheWrap and stays "reportedly."
- In-game dollar effects are game numbers chosen to make the incentives legible. The real figures live on the outcome cards with their sources. Do not change a number on an outcome card without a source.
- Source links must be real URLs already in `scenarios.js`. Do not invent sources.

## Working conventions

- Keep the engine small and readable. Prefer plain functions over classes. One `render()` that redraws from `state`.
- Game numbers and formulas live in `SPEC.md` under "Economics." Implement them exactly; if a formula seems wrong, say so instead of silently changing it, because the round-two flip depends on them.
- Test by opening `index.html` in a browser and playing a full round. For automated checks, a small Playwright script in `test/` is fine but optional.
- Commit after each phase in `PROMPTS.md` with a short message naming the phase.
- Do not add dependencies, a package.json, a bundler, TypeScript, or a framework, even if it would be cleaner.
