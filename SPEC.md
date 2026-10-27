# Write-Off: Game Spec

This is the full spec for the engine. `scenarios.js` already contains the stops, events, and rule-card copy. `CLAUDE.md` has the design rules. Build in the order given in `PROMPTS.md`.

## 1. Screens

1. **Title.** "WRITE-OFF" in big pixel type over the Burbank scene. Subtitle: "An Oregon Trail through Los Angeles." Buttons: Start, Sources, About. About is three sentences on the project and the team name.
2. **Setup.** Two inputs and one choice, Oregon Trail style:
   - "Your name" (text, optional, default "Exec"). Used on tombstones.
   - "Name your studio" (text, optional, default "Burbank Pictures").
   - Pace: Steady, Aggressive, or Slash and Burn. Pace sets the debt target (see Economics). One line under each explaining it in plain words.
3. **Trail.** The main screen. Top: the scene (SVG, 16:9). Middle: the stop name and month, the setup text, and the choice buttons. Bottom: the status bar. Between stops a short travel beat plays (the car crosses the scene, the month ticks, a random event may appear).
4. **Outcome card.** An overlay that slides up after a choice. Contents, in order: "What actually happened" (one line), "What happened next" (one line), driver tag (one word, e.g. TAX), lesson chip (one short sentence), source link (outlet and date). One button: "Drive on."
5. **Shelved screen.** Black screen, pixel tombstone, text: "THE ANIMATED FEATURE has been shelved. Cause: impairment." then "Crew sent home: 300." Shown whenever a choice has `shelves: true`. Tap to continue.
6. **Receipt.** End of a round. Lines: Debt vs. target (hit or missed), Bonus (% of target and dollar figure), Projects shelved, Crew sent home, Talent trust (Low / Medium / High from hidden goodwill), the pay vote result. Then a stop-by-stop comparison: your choice vs. what the real company did, with a match count. Buttons: "Play round two" (after round one), "Download the log" and "Play again" (after round two).
7. **Rule picker.** Before round two. The five rule cards from `scenarios.js` as big buttons, one plain sentence each. Three are available in the first build (`threeYear`, `rightsRevert`, `creatorVeto`); `writeOffsCount` and `oneFewerBuyer` are stretch and can be shown greyed with "Coming soon."
8. **Sources.** A list of every source in `scenarios.js` (outlet, title, date, link), reachable from the title screen and from a small "Sources" button on the status bar.
9. **Exit prompt.** After the round-two receipt, two questions with text inputs: "Which decision was hardest?" and "Which rule would you change in real life?" Answers go into the log. Skippable.

## 2. State

```js
state = {
  screen, round (1|2), rule (null | ruleId), pace,
  player: { name, studio },
  month (0..11), stopIndex,
  cash,        // $M, starts 500
  debt,        // $B, starts 53.0
  debtTarget,  // $B from pace
  bonus,       // percent of target, starts 100
  crew,        // people working, starts 2400
  goodwill,    // hidden, 0..100, starts 50
  buyers,      // hidden, starts 2 in round 1
  shelved: [], // project ids shelved this round
  reverts: [], // for rightsRevert: shelved projects due to revert at receipt
  choices: [], // { stopId, choiceId } in order
  log: []      // see Log
}
```

## 3. Economics

Every choice in `scenarios.js` carries:

- `thisYear` ($M): the number finance quotes for this year. Savings positive, spending negative.
- `threeYear` ($M): net value over three years.
- `writeOff` ($M): the portion of `thisYear` that is a write-off or impairment (0 if none).
- `goodwill` (hidden delta), `crew` (delta), `shelves` (true if this kills a project), `needsBuyer` (true if the choice requires `buyers > 0`), `kills` (project id, if `shelves`).

**Bonus.** `bonus` starts at 100 (percent of target). Each choice applies `bonusDelta` based on the round and rule:

| Rule | bonusDelta |
| --- | --- |
| Round one (no rule) | `thisYear / 10` |
| `threeYear` | `threeYear / 10` |
| `writeOffsCount` | `(thisYear - writeOff) / 10` |
| `rightsRevert` | `thisYear / 10` now; at the receipt, each shelved project applies `-(threeYear of the shelve choice) / 10` again as a reversion penalty (so shelving Coyote nets +7 then -(-50)/10... see note) |
| `creatorVeto` | `thisYear / 10`, but choices with `shelves: true` are disabled |
| `oneFewerBuyer` | `thisYear / 10`, buyers start at 0 |

Note on `rightsRevert`: at the receipt, for each project in `reverts`, apply a flat `-12` to bonus and `-5` goodwill, and add a receipt line: "Rights to THE ANIMATED FEATURE reverted. A rival released it and made $120M." The hint on the shelve choice in round two says: "+$70M this year, but the film goes back to its creators in 12 months."

Bonus is clamped to 0..200. The receipt converts it: bonus dollars = `24 * bonus / 100` in $M (so 100% = $24M, roughly the real 2024 cash bonus).

**Choice hints.** Under each choice button show what finance says, so the incentive is visible:
- Round one and `creatorVeto` / `oneFewerBuyer`: "Finance says: +$70M this year."
- `threeYear`: "This year: +$70M. Over three years: -$50M."
- `writeOffsCount`: "+$70M this year, minus a $30M write-off counted against your bonus."
- `rightsRevert`: as above for shelve choices; otherwise the round-one text.

**Debt.** Starts at 53.0 ($B). Each month, operations pay down 0.6. Each choice moves debt by `-thisYear / 1000` (so +$200M of savings lowers debt by 0.2). Targets by pace: Steady 46.0, Aggressive 45.5, Slash and Burn 45.0. Display one decimal.

**Cash.** Starts at 500 ($M). Each choice moves cash by `thisYear`. Cash can go negative; if it does, the status bar shows it in red and a random event "The bankers call" fires once (goodwill -3). Cash is mostly flavor; debt is the target that matters.

**Crew.** Starts at 2,400. Choices apply `crew`. Never below 0.

**Goodwill.** Hidden, starts 50, clamped 0..100. Drives events (see Events) and the Talent trust line on the receipt: Low under 35, Medium 35 to 65, High above 65.

**Buyers.** Hidden. Round one starts at 2. The September stop sets `buyers -= 1` on arrival (you absorbed a studio). The "rival merger" event sets `buyers -= 1` at most once. Choices with `needsBuyer` are disabled when `buyers == 0` and show "No buyer left in town." The February stop has two versions depending on `buyers` and `shelved.length` (see `scenarios.js`).

**Pay vote (March).** `against = clamp(35 + (bonus - 100) * 0.8 + (50 - goodwill) * 0.6, 15, 85)`, rounded. If `against > 50`: "{against}% of shares voted against your pay. The vote is advisory. Nothing changes." Otherwise: "{100 - against}% of shares approved your pay." Either way the bonus is paid.

**Hand-check before shipping.** Under round one, the December shelve choice must give the largest bonusDelta of the three. Under `threeYear`, release must win. Under `writeOffsCount`, sell must win. Under `creatorVeto`, shelve must be disabled. If any of those fail, the numbers in `scenarios.js` are wrong, not the engine; flag it.

## 4. Trail flow

```
Title -> Setup -> for each stop (12):
    travel beat (car moves, month ticks, debt pays down 0.6, maybe one random event)
    -> stop screen with setup + choices
    -> apply choice effects, log it
    -> if shelves: Shelved screen
    -> Outcome card
  -> Receipt (round one) -> Rule picker -> trail again with rule -> Receipt (round two) -> Exit prompt -> Download log
```

Random events: after each travel beat, 50% chance to draw one event whose `when` condition passes and which has not fired yet this round. Events are in `WRITEOFF_DATA.events`. Each is two lines and one "Drive on" button, except the 405 crossing, which has two choices.

Tombstones: when arriving at a stop, if localStorage holds earlier runs on this device that shelved the project tied to this stop, show one line on the travel beat: "Here lies THE SUPERHERO MOVIE. Shelved by {name}, Round {n}." Store `{ name, round, stopId, choiceId }` per shelve in localStorage under `writeoff.tombstones`, max 50 entries. Wrap every localStorage read and write in try/catch and work fine without it.

## 5. Log

Every action appends an entry: `{ t: ISO time, round, rule, month, stop, event?, choice?, effects: {cash, debt, bonus, crew}, card?: {did, next, source} }`. The receipt and the exit-prompt answers also append entries. "Download the log" writes a plain text file `writeoff-log-{studio}-{date}.txt` with one entry per line, readable by a human, via a Blob and a temporary anchor. Also offer "Copy log" (clipboard) because some viewers block downloads.

## 6. Visuals

- Scenes render at 320x180 as inline SVG with `shape-rendering="crispEdges"`, scaled to the container width with `image-rendering: pixelated`. Everything snaps to a 4px grid at that resolution.
- Palette (16 colors, use only these in scenes and UI):
  - sky `#9bd3e8`, skyDusk `#e9a26a`, skyNight `#141a3a`, sun `#ffd97a`
  - sand `#e8d8b0`, terracotta `#c96a4a`, palm `#3f8f4f`, palmDark `#2a5f36`
  - asphalt `#5d5d66`, concrete `#b8b4a8`, glass `#7fb2c9`, white `#f6f3ea`
  - ink `#1b1b1f`, crtGreen `#5cf27a`, red `#e5484d`, gold `#f2c14e`
- Status bar: black background, `crtGreen` text, Press Start 2P at 10px, four items left to right: CASH, DEBT (with target), BONUS, CREW. A small "Sources" link on the right.
- Type: Press Start 2P for headers, buttons, and the status bar; VT323 at 22px or larger for setup text and cards. Fallback stacks: `"Press Start 2P", monospace` and `VT323, "Courier New", monospace`.
- Layout: single column, max width 720px, centered. Side gutter `max(16px, env(safe-area-inset-left/right))`. Works at 390px wide with no horizontal scroll. Choice buttons are full width, at least 48px tall, stacked.
- Scenes (one function each in `scenes.js`, three parallax layers: far, mid, near):
  - `lot`: pale sky, hills, beige sound stages with numbers, a water tower on legs, a palm.
  - `freeway`: the 101 through Cahuenga Pass, green overhead sign, billboards, hills with a hillside sign reading WRITE-OFF in white blocks.
  - `hollywood`: theater marquees, a vertical sign, palms, gold stars on the sidewalk.
  - `sunset`: dusk gradient bands, billboards, low buildings, palms in silhouette.
  - `century`: glass towers with window grids, a low studio lot beside them.
  - `culver`: a studio gate arch, a water tower, low stages.
  - `santamonica`: ocean, pier on stilts, a ferris wheel (circle and spokes), sunset.
  - `griffith`: night, stars, the observatory dome on a hill, a grid of city lights below, the WRITE-OFF hillside sign.
  - `capitol`: a phone screen in the foreground showing a post, night city behind.
  - `downtown`: office towers at dawn, a hotel with a ballroom sign.
- Car sprite: a black town car with a film reel strapped to the roof, about 24x12 at scene resolution. It drives left to right across the near layer during the travel beat (1.2s, `prefers-reduced-motion` skips the animation).
- Shelved screen: black, a pixel tombstone (grey rounded rect on a base), white Press Start 2P text.
- Theme: single dark look by choice. Set `color-scheme: dark` on `:root`, explicit background on `body`, every color from the palette tokens.

## 7. Accessibility and resilience

- Every button is a real `<button>` with a visible focus ring.
- `prefers-reduced-motion`: no car animation, no card slide, instant transitions.
- No `alert`, `confirm`, or `prompt`. Confirmations are in-page.
- A refresh restarts the game; that is fine. Do not persist game state.
- If `scenarios.js` fails to load, show "Content failed to load" instead of a blank page.

## 8. Deploy

GitHub repo, Pages enabled from `main` at root. The live URL is the Pin-Up #2 submission. Keep `index.html`, `scenarios.js`, `scenes.js`, `rules.js` at root so relative script tags work on Pages and when opened as a local file.
