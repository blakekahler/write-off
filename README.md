# Write-Off

An Oregon Trail style game about why studios shelve finished movies. You run a Hollywood studio the day after a merger, drive across Los Angeles for twelve months, and make decisions that real executives made. After each one you see what the real company did, with a source. Then you play the same year again with one rule changed, and the same decisions stop making sense. That flip is the argument.

**Play it:** https://blakekahler.github.io/write-off/ (works on phones; a round takes about ten minutes)

MNGT 301 semester project, team durKheim, University of Nebraska-Lincoln, Fall 2026.

## How to play

Pick one of the choices at each stop. Four numbers at the bottom of the screen tell you how it's going: cash, debt against the bankers' target, your bonus, and how many people still work for you. Your bonus pays on this year's savings, so shelving a finished movie looks great on paper. Play the year once, get your receipt, then pick one rule to change and drive it again.

## The twelve stops and the real cases behind them

The dollar effects inside the game are simplified so the incentive is easy to see. The real figures are on the cards, with these sources.

| Month | Stop | What really happened | Source |
| --- | --- | --- | --- |
| April | Day one | Warner Bros. Discovery paid its CEO $51.9M for 2024, with the cash bonus at 108.6% of target. | [Variety](https://au.variety.com/2025/biz/global/david-zaslav-2024-compensation-warner-bros-discovery-exceed-bonus-targets-23430/) |
| May | The news app | CNN+ launched March 29, 2022 and was shut down April 30, after about $300M spent. | [The Hollywood Reporter](https://www.hollywoodreporter.com/business/digital/cnn-plus-shutting-down-1235133393/) |
| June | The library purge | HBO Max removed 36 titles in August 2022, including Infinity Train and Summer Camp Island, and laid off about 70 people the same week. | [NPR](https://www.wfae.org/business/2022-08-19/hbo-max-cuts-dozens-of-titles-in-a-cost-cutting-move-before-a-merger-with-discovery) |
| July | The superhero movie | Warner Bros. Discovery shelved Batgirl in August 2022 with the budget at $90M after COVID delays, citing a "strategic shift" on DC and HBO Max. | [NPR](https://www.npr.org/2022/08/03/1115380005/warner-bros-kills-off-batgirl-movie-90-million-in) |
| August | The classic movie channel | WBD cut TCM's top staff in June 2023 after an order to cut its payroll by two-thirds. | [Fortune](https://fortune.com/2023/06/29/steven-spielberg-martin-scorsese-paul-thomas-anderson-turner-classic-movies-warner-bros-david-zaslav) |
| September | The $170 million film | Disney cancelled Fox's Mouse Guard two weeks before filming in April 2019, reportedly because it didn't want Fox making big-budget films that competed with Disney's own. | [SlashFilm](https://slashfilm.com/mouse-guard-cancelled-disney-fox) |
| October | The kids' show | Paramount+ pulled Star Trek: Prodigy and Grease: Rise of the Pink Ladies in June 2023 and took a write-off while season two of Prodigy was still being finished. | [SlashFilm](https://slashfilm.com/1322004/paramount-removing-star-trek-prodigy-grease-prequel) |
| November | The big write-off | Disney removed dozens of originals, including Willow, from Disney+ and Hulu on May 26, 2023 and reported a $1.5B write-off in an SEC filing. | [TheWrap](https://www.thewrap.com/disney-takes-write-off-after-removing-shows-disney-plus-hulu/) |
| December | The animated feature | Warner Bros. shelved the finished Coyote vs. Acme in November 2023 for a reported $30M tax write-off. The CEO reportedly never watched it. | [The Numbers](https://www.the-numbers.com/movie/Coyote-v-Acme-(2026)) |
| January | The congressman | Rep. Joaquin Castro called on the FTC and DOJ to review WBD's practice of scrapping finished films on November 13, 2023. | [TheWrap](https://www.thewrap.com/joaquin-castro-calls-on-ftc-to-review-wbd-over-coyote-vs-acme/) |
| February | The buyer | Coyote vs. Acme survived only because Ketchup Entertainment existed to buy it. Star Trek: Prodigy survived because Netflix did. | [TheWrap](https://www.thewrap.com/coyote-vs-acme-saved-ketchup-entertainment-warner-bros/) |
| March | The pay vote | Almost 60% of votes cast went against the CEO's $51.9M pay package at Warner Bros. Discovery in June 2025. | [Variety](https://au.variety.com/2025/tv/global/warner-bros-discovery-shareholders-vote-against-zaslav-ceo-pay-23379) |

Only about a third of these are tax write-offs. The rest come down to payments owed to creators, making the books look better, a new owner's strategy, cost-cutting orders, and mergers that leave one fewer buyer. The card after each choice names the reason in plain words.

## Round two: change one rule

- **Three-year bonus.** Your bonus pays out on three-year results, not this year's savings.
- **Rights revert.** Anything you shelve goes back to its creators after 12 months.
- **Creator veto.** You can't shelve a finished project without its creators' sign-off. They can force a sale instead.
- **Write-offs count.** Every write-off on finished work is subtracted from your bonus. (planned, not in this build)
- **One fewer buyer.** No new protections. Instead, another merger happened on day one and there's no one left to buy what you shelve. (planned, not in this build)

Under the rules as they are, shelving the finished animated feature in December is the best move for your bonus. Under a three-year bonus, releasing it wins. Under creator veto, you can't shelve it at all. Same movie, same numbers, different rule.

## Build log

One entry per iteration, oldest first, each with screenshots captured from that iteration's commit at phone size. The detailed per-change table is in [LOG.md](LOG.md).

### 1. The loop (Phase 1, Oct 27, 2026)

Title, setup with the pace choice, all twelve stops, the black "has been shelved" screen, the outcome card and the paper receipt, with flat placeholder scenes so the game was playable end to end on day one. The economics were in from the start: shelving the animated feature in December gave the biggest bonus jump of its three choices, which is the whole argument in one number.

![Phase 1: title with a placeholder scene, the December stop, the shelved screen, the receipt](docs/build-log/01-phase-1-the-loop.png)

### 2. Round two (Phase 2, Oct 27)

The rule picker (three cards live, two marked "Coming soon"), hints that change per rule (under the three-year bonus, December shows both this year's number and the three-year one, and release wins), the log download, the exit questions, and `checkFlip()`, which proved the flip with the shipped numbers. The final screen puts both rounds side by side.

![Phase 2: the rule picker, December under the three-year rule, the two-round comparison](docs/build-log/02-phase-2-round-two.png)

### 3. Los Angeles (Phase 3, Oct 27)

Ten pixel scenes from the 16-color palette on a 4px grid, three parallax layers each, the car and the travel beat, and a real tombstone. Reviewing the first gallery at 4x found a four-pixel strip of night sky between the hillside sign and the hill under it, the kind of thing you only see zoomed in.

![Phase 3: the title over the Burbank lot, a travel beat on the 101, the pixel tombstone](docs/build-log/03-phase-3-scenes.png)

![Phase 3: the first scene gallery](docs/build-log/03-phase-3-scene-gallery.png)

### 4. Events, tombstones, sources (Phase 4, Oct 27)

Random events gated by game state, the 405 crossing with a coin-flip outcome, "The bankers call" when cash goes below zero, tombstones from earlier players on the same device, and the Sources screen. Playtesting with animations on (the automated runs had used reduced motion) caught the event box sliding off center because its entrance animation and its centering both used the same CSS transform.

![Phase 4: the 405 crossing, a tombstone from an earlier round, the Sources screen](docs/build-log/04-phase-4-events-and-tombstones.png)

### 5. Plain words (Oct 27)

A read-through with the audience in mind (a management class, not a finance one) cut the jargon: comp committee, write-down, impairment charge, salary spend, advisory, term sheet, "the trades," slate. "Write-off" became the one money term the game teaches, and the June stop explains it the first time it comes up. The bonus meter switched to dollars with the percent of target under it. No number, date, title, or source changed, and `checkFlip()` still passed.

![Plain words: the June stop explaining a write-off, its outcome card, the receipt](docs/build-log/05-plain-words.png)

### 6. The car (Oct 29)

At 24 pixels wide the car read as scenery. It doubled to 48x24 with a clearer film reel, a strap, slanted windows, a headlight and taillight, exhaust puffs while driving, and a 2.5x idling version parked front and center on the title screen so the subject is obvious before anyone reads a word.

![Bigger car: the title screen hero car, the car parked on Hollywood Boulevard](docs/build-log/06-bigger-car.png)

### 7. Assume the player knows nothing (Oct 29)

An intro screen with the situation and what the four numbers mean. Every outcome card row got a label (Your call, What actually happened, What happened next, The real reason, The lesson, Source), and the one-word driver tags are said in plain words, so TAX reads as "a tax break." The car now follows cash, from a rusty junker below zero to a limo above $800M, with a one-line note on the road when it changes. Every scene got a detail pass. Testing found that a random event on the same drive as a tombstone had been skipping the tombstone line, so notes now show after the event.

![Intro screen, the labeled outcome card, the limo on the Sunset Strip](docs/build-log/07-intro-labels-car-tiers.png)

![The four car conditions: junker, rental, town car, limo](docs/build-log/07b-car-tiers.png)

![The detailed scene gallery](docs/build-log/07-detailed-scene-gallery.png)

## How it's built

Four static files (`index.html`, `scenarios.js`, `scenes.js`, `rules.js`), plain JavaScript, no framework and no build step, hosted on GitHub Pages. Every scene is drawn in code from a 16-color palette on a 4px grid. The scenario deck, the sources, and the game numbers were written by the team; the engine, the art, and the tests were built with Claude Code from a written spec ([SPEC.md](SPEC.md)), one phase at a time with a commit after each. A headless-browser script plays both rounds and checks that the December flip still holds after every change.

Working on the game? Editing content, deploying, and testing are covered in [docs/TEAM.md](docs/TEAM.md).
