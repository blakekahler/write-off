# Build phases for Claude Code

Open this folder in Claude Code (`cd write-off && claude`). It will read `CLAUDE.md` on its own. Paste the prompts below one at a time, in order. Each phase ends with a check you do yourself in a browser before moving on. Commit after each phase.

Before phase 1, run `git init` in the folder if it isn't a repo yet.

---

## Phase 1: the loop

> Read SPEC.md and scenarios.js. Build index.html with the Title, Setup, Trail, Outcome card and Receipt screens from SPEC section 1, the state from section 2, and the economics from section 3, using only the round-one bonus rule for now. Scenes can be a flat colored rectangle with the stop name on it for this phase; create scenes.js with a single placeholder function that every stop uses. Wire all twelve stops from scenarios.js including the February stop's three variants and the disabled state for needsBuyer and needsShelved choices. Show the "Finance says" hint under every choice. Implement the status bar, the shelved screen, and the receipt with the stop-by-stop comparison to the real choice. Skip random events, tombstones, round two and the log for now. Keep everything in one index.html plus scenes.js. When you're done, tell me how to open it and what to click to reach the receipt.

**Check:** open `index.html`, play through all twelve stops, shelve the animated feature in December. The receipt should show your debt, bonus, projects shelved, crew sent home and the comparison list. Shelving in December should have given the biggest bonus jump of its three choices.

---

## Phase 2: round two and the log

> Add rules.js with the five rule cards from scenarios.js and the bonus math from the table in SPEC section 3, including the rightsRevert receipt penalty, the creatorVeto disabled choices, and the oneFewerBuyer start state. Add the Rule picker screen between the round-one receipt and round two; show the three available cards as buttons and the two others greyed with "Coming soon." Make the choice hints change per rule exactly as SPEC section 3 describes. Add the log from SPEC section 5 with Download and Copy buttons on the final receipt, and the two-question Exit prompt. Then add a small hand-check function `checkFlip()` in the console that prints the December bonusDelta for each choice under each rule and says PASS or FAIL against the expectations in SPEC section 3.

**Check:** run `checkFlip()` in the browser console. All four expectations should pass. Play round two with Three-year bonus and confirm the December hint shows both numbers and release wins. Download the log and open it.

---

## Phase 3: the LA scenes

> Build scenes.js with the ten scenes from SPEC section 6 as SVG strings at 320x180 with three parallax layers, using only the 16 palette colors. Add the car sprite and the travel beat between stops (month ticks, car drives across, debt pays down 0.6), with prefers-reduced-motion skipping the animation. Add the pixel tombstone to the shelved screen. Load Press Start 2P and VT323 from Google Fonts with fallbacks and apply the type rules from section 6. Make sure the layout holds at 390px wide with no horizontal scroll and the choice buttons are at least 48px tall.

**Check:** resize the browser to phone width and play a few stops. Every scene should look like its location at a glance. Text should be readable without zooming.

---

## Phase 4: events, tombstones, polish

> Add the random events from scenarios.js per SPEC section 4, including the 405 crossing with two choices and chance outcomes, the once-only events, and the `when` conditions. Add tombstones using localStorage per section 4, wrapped in try/catch. Add the Sources screen reachable from the title screen and the status bar. Add the About text. Add the "Content failed to load" fallback. Then play a full round yourself with a script or by hand and fix anything that throws in the console.

**Check:** play two full rounds. Shelve something in round one, restart, and confirm a tombstone shows up on that stop. Open Sources and click two links.

---

## Phase 5: deploy

> Add a README section on deploying to GitHub Pages from main at root, and confirm all script tags are relative paths so the game works both as a local file and on Pages.

Then push to GitHub, turn on Pages (Settings > Pages > Deploy from branch > main, root), and open the URL on your phone. That URL is the Pin-Up #2 submission.

---

## Later phases (after Pin-Up #2)

- Replace SVG scenes with hand-drawn pixel art at 320x180 as the art teammate finishes them. Same function names, return an `<image>` element instead.
- Enable `writeOffsCount` and `oneFewerBuyer` once the first three cards are playtested.
- Add the two stretch stops if we cut any for time.
- A "creator mode" where you play the animator instead of the exec (outlined in the Project Brief, not built this semester).

## If Claude Code goes off the rails

- If it wants to add a framework, a bundler, or npm: say no, point it at CLAUDE.md.
- If it rewrites the scenario copy: say no, revert scenarios.js, and tell it to only wire the data.
- If a number in the economics doesn't produce the flip: that's a data problem. Adjust `thisYear`, `threeYear` or `writeOff` on the December choices in scenarios.js, not the formulas.
