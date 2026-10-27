// Write-Off: all game content lives here. Writers edit this file and nothing else.
// Dollar effects (thisYear, threeYear, writeOff) are in $M and are GAME NUMBERS chosen to make
// the incentives legible. The real figures are on the outcome cards with their sources.
// See SPEC.md section 3 for how the engine uses each field.

window.WRITEOFF_DATA = {

  projects: [
    { id: "newsapp",   name: "THE NEWS APP",          crew: 300 },
    { id: "superhero", name: "THE SUPERHERO MOVIE",   crew: 400 },
    { id: "bigfilm",   name: "THE $170M FILM",        crew: 350 },
    { id: "kidsshow",  name: "THE KIDS' SHOW",        crew: 120 },
    { id: "animated",  name: "THE ANIMATED FEATURE",  crew: 300 }
  ],

  stops: [
    {
      id: "dayone", month: 0, monthName: "April", stop: "The studio lot, Burbank", scene: "lot",
      title: "Day one",
      setup: "The merger closed yesterday and you run the studio now. The bankers want $53 billion of debt down to your target by March. The board's pay committee slides your bonus deal across the table: it pays you for this year's cost savings.",
      choices: [
        { id: "sign", label: "Sign it. Bonus pays on this year's savings.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 0, crew: 0,
          result: "You sign. The CFO nods." },
        { id: "threeyr", label: "Ask for a bonus tied to three-year results.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 2, crew: 0,
          result: "The committee says shareholders like the one-year number. You sign the one-year deal anyway." },
        { id: "people", label: "Ask what happens to the people who made the movies.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 3, crew: 0,
          result: "The committee looks at you. The CFO laughs. You sign." }
      ],
      real: "sign",
      card: {
        did: "Warner Bros. Discovery paid its CEO $51.9M for 2024, with the cash bonus at 108.6% of target.",
        next: "The company lost $11.5B that year. The pay committee counted $1.8B in cost savings and paid him more than his target bonus anyway.",
        driver: "PAY",
        chip: "You get what you measure.",
        source: { outlet: "Variety", title: "WBD lost $11.5 billion in 2024. So how did Zaslav exceed his bonus targets?", date: "June 5, 2025",
                  url: "https://au.variety.com/2025/biz/global/david-zaslav-2024-compensation-warner-bros-discovery-exceed-bonus-targets-23430/" }
      }
    },

    {
      id: "newsapp", month: 1, monthName: "May", stop: "The studio lot, Burbank", scene: "lot",
      title: "The news app",
      setup: "Your news division launched a $300 million streaming app four weeks ago, under the old owners. It has a staff of hundreds and a plan to spend hundreds of millions more. You never approved it.",
      choices: [
        { id: "fund", label: "Fund it for a year and see.",
          thisYear: -200, threeYear: -100, writeOff: 0, goodwill: 3, crew: 0,
          result: "The spending continues. The newsroom cheers. The bankers do not." },
        { id: "fold", label: "Fold it into the main app and keep half the staff.",
          thisYear: -50, threeYear: 20, writeOff: 0, goodwill: 0, crew: -150,
          result: "Half the team moves over. Half goes home." },
        { id: "shut", label: "Shut it down and lay off the staff.",
          thisYear: 200, threeYear: 150, writeOff: 0, goodwill: -5, crew: -300, shelves: true, kills: "newsapp",
          result: "The app goes dark on day 30." }
      ],
      real: "shut",
      card: {
        did: "CNN+ launched March 29, 2022 and was shut down April 30, after about $300M spent.",
        next: "Most staff lost their jobs with six months' severance. The call came from the new parent company, which wanted one streaming app.",
        driver: "NEW BOSS",
        chip: "The people who built it didn't get to decide.",
        source: { outlet: "The Hollywood Reporter", title: "CNN+ shutting down", date: "April 2022",
                  url: "https://www.hollywoodreporter.com/business/digital/cnn-plus-shutting-down-1235133393/" }
      }
    },

    {
      id: "purge", month: 2, monthName: "June", stop: "The 101, Cahuenga Pass", scene: "freeway",
      title: "The library purge",
      setup: "Finance has a list of 36 shows on your streaming service that don't pull big numbers. Pulling them stops the payments still owed to the people who made them, and lets you write the shows off: count them as a loss and pay less tax. The creators find out when the shows disappear.",
      choices: [
        { id: "pull", label: "Pull all 36 and write them off.",
          thisYear: 50, threeYear: 20, writeOff: 30, goodwill: -8, crew: -70,
          result: "Thirty-six shows vanish overnight. Seventy people are laid off the same week." },
        { id: "keep", label: "Keep them. They're already paid for.",
          thisYear: 0, threeYear: 10, writeOff: 0, goodwill: 2, crew: 0,
          result: "Nothing changes. Finance circles the number in red." },
        { id: "license", label: "License them to another platform.",
          thisYear: 20, threeYear: 40, writeOff: 0, goodwill: 4, crew: 0, needsBuyer: true,
          result: "The shows stay watchable, just not on your app. The checks keep coming." }
      ],
      real: "pull",
      card: {
        did: "HBO Max removed 36 titles in August 2022, including Infinity Train and Summer Camp Island, and laid off about 70 people the same week.",
        next: "The official reason was folding two streaming apps into one before the merger. Variety noted the removals would also save residuals, the payments still owed to the people who made the shows.",
        driver: "RESIDUALS",
        chip: "Nobody who made these shows was in the room.",
        source: { outlet: "NPR", title: "HBO Max cuts dozens of titles in a cost-cutting move before a merger with Discovery", date: "Aug 19, 2022",
                  url: "https://www.wfae.org/business/2022-08-19/hbo-max-cuts-dozens-of-titles-in-a-cost-cutting-move-before-a-merger-with-discovery" }
      }
    },

    {
      id: "superhero", month: 3, monthName: "July", stop: "Hollywood Boulevard", scene: "hollywood",
      title: "The superhero movie",
      setup: "A $90 million superhero movie is almost finished. The old owners planned it for streaming, which you've decided is the wrong strategy. Finance points out that if it never comes out, you can write off the whole $90 million this year.",
      choices: [
        { id: "theaters", label: "Put it in theaters. Spend $60M on marketing.",
          thisYear: -60, threeYear: 30, writeOff: 0, goodwill: 6, crew: 0,
          result: "Trailers drop. The box office is anyone's guess." },
        { id: "stream", label: "Release it on the streamer as planned.",
          thisYear: -10, threeYear: 15, writeOff: 0, goodwill: 4, crew: 0,
          result: "It premieres on a Thursday. The crew watches it at home." },
        { id: "shelve", label: "Shelve it. Call it a strategic shift.",
          thisYear: 90, threeYear: -30, writeOff: 90, goodwill: -10, crew: -400, shelves: true, kills: "superhero",
          result: "The press release goes out at 5 p.m. on a Tuesday." }
      ],
      real: "shelve",
      card: {
        did: "Warner Bros. Discovery shelved Batgirl in August 2022 with the budget at $90M after COVID delays, citing a \"strategic shift\" on DC and HBO Max.",
        next: "Scoob! Holiday Haunt was shelved the same day. Neither film has been released.",
        driver: "ACCOUNTING",
        chip: "New boss, new strategy, old movie.",
        source: { outlet: "NPR", title: "Warner Bros. kills off Batgirl movie, $90 million in", date: "Aug 3, 2022",
                  url: "https://www.npr.org/2022/08/03/1115380005/warner-bros-kills-off-batgirl-movie-90-million-in" }
      }
    },

    {
      id: "tcm", month: 4, monthName: "August", stop: "Sunset Strip", scene: "sunset",
      title: "The classic movie channel",
      setup: "Your classic movie channel is beloved and small. The budget order says cut its payroll by two-thirds. Three of the most famous directors alive have the channel on speed dial.",
      choices: [
        { id: "cut", label: "Cut the staff by two-thirds.",
          thisYear: 30, threeYear: -10, writeOff: 0, goodwill: -8, crew: -40,
          result: "The layoffs leak by lunch. Your phone starts ringing." },
        { id: "reverse", label: "Cut, then reverse part of it when the directors call.",
          thisYear: 10, threeYear: 5, writeOff: 0, goodwill: -2, crew: -15,
          result: "You give one executive his job back and promise the channel is protected." },
        { id: "protect", label: "Protect the channel up front.",
          thisYear: -5, threeYear: 15, writeOff: 0, goodwill: 4, crew: 0,
          result: "Finance notes the exception. The directors never have to call." }
      ],
      real: "reverse",
      card: {
        did: "WBD cut TCM's top staff in June 2023 after an order to cut its payroll by two-thirds.",
        next: "Spielberg, Scorsese and Paul Thomas Anderson stepped in. Zaslav reversed part of the cuts, and the three agreed to help pick the channel's movies, unpaid.",
        driver: "COST TARGET",
        chip: "Three phone calls beat the org chart.",
        source: { outlet: "Fortune", title: "Spielberg, Scorsese and Paul Thomas Anderson step in on Turner Classic Movies", date: "June 29, 2023",
                  url: "https://fortune.com/2023/06/29/steven-spielberg-martin-scorsese-paul-thomas-anderson-turner-classic-movies-warner-bros-david-zaslav" }
      }
    },

    {
      id: "bigfilm", month: 5, monthName: "September", stop: "Century City", scene: "century",
      title: "The $170 million film",
      onArrive: { buyers: -1, note: "You just absorbed a rival studio. One fewer buyer in town." },
      setup: "You bought a rival studio last month. One of its films is two weeks from shooting, with a $170 million budget and the cast signed. It looks a lot like something your own studio already makes.",
      choices: [
        { id: "shoot", label: "Let it shoot.",
          thisYear: -170, threeYear: 40, writeOff: 0, goodwill: 6, crew: 350,
          result: "Cameras roll in two weeks. The crew keeps their jobs." },
        { id: "cancel", label: "Cancel it. You don't need two of these.",
          thisYear: 170, threeYear: 100, writeOff: 0, goodwill: -8, crew: -350, shelves: true, kills: "bigfilm",
          result: "Sets come down before they go up." },
        { id: "shop", label: "Let the producers take it to another studio.",
          thisYear: 170, threeYear: 90, writeOff: 0, goodwill: 2, crew: 0, needsBuyer: true,
          result: "The producers take their meetings. Maybe it gets made. Not by you." }
      ],
      real: "shop",
      card: {
        did: "Disney cancelled Fox's Mouse Guard two weeks before filming in April 2019, reportedly because it didn't want Fox making big-budget films that competed with Disney's own.",
        next: "The producers were allowed to offer it to other studios. Disney also shut down Fox 2000, the division that made Hidden Figures and The Devil Wears Prada.",
        driver: "MERGER",
        chip: "Every merger is one fewer place a movie can go.",
        source: { outlet: "SlashFilm", title: "Disney scraps Fox's Mouse Guard two weeks before production begins", date: "April 18, 2019",
                  url: "https://slashfilm.com/mouse-guard-cancelled-disney-fox" }
      }
    },

    {
      id: "kidsshow", month: 6, monthName: "October", stop: "Culver City", scene: "culver",
      title: "The kids' show",
      setup: "A popular animated kids' show has a finished second season sitting on a drive. Finance wants it off the service so the company can write it off before the quarter ends. The fans have not been told.",
      choices: [
        { id: "writeoff", label: "Pull it and write it off.",
          thisYear: 40, threeYear: -10, writeOff: 40, goodwill: -6, crew: -120, shelves: true, kills: "kidsshow",
          result: "Season two never airs. The fan accounts notice within the hour." },
        { id: "keep", label: "Keep it. Kids watch it on repeat.",
          thisYear: 0, threeYear: 15, writeOff: 0, goodwill: 2, crew: 0,
          result: "It stays. The quarter closes a little uglier." },
        { id: "sell", label: "Pull it, but sell season two to a competitor.",
          thisYear: 25, threeYear: 30, writeOff: 0, goodwill: 1, crew: 0, needsBuyer: true,
          result: "A rival buys it. The animators finish it for someone else's app." }
      ],
      real: "sell",
      card: {
        did: "Paramount+ pulled Star Trek: Prodigy and Grease: Rise of the Pink Ladies in June 2023 and took a write-off while season two of Prodigy was still being finished.",
        next: "Netflix picked up Prodigy and released the finished second season in July 2024.",
        driver: "TAX",
        chip: "Worthless to you isn't worthless.",
        source: { outlet: "SlashFilm", title: "Paramount+ removing Star Trek: Prodigy and Grease prequel as Hollywood's worst trend continues", date: "June 23, 2023",
                  url: "https://slashfilm.com/1322004/paramount-removing-star-trek-prodigy-grease-prequel" }
      }
    },

    {
      id: "writedown", month: 7, monthName: "November", stop: "Santa Monica Pier", scene: "santamonica",
      title: "The big write-off",
      setup: "Finance has a bigger idea. Remove dozens of your own original shows and movies from the service and write off $1.5 billion all at once. Future quarters look cheaper, and the checks to the people who made them stop.",
      choices: [
        { id: "charge", label: "Take the write-off. Pull the titles.",
          thisYear: 100, threeYear: 20, writeOff: 150, goodwill: -10, crew: -200,
          result: "Dozens of shows disappear on a Friday. The writers are on strike that week." },
        { id: "keep", label: "Keep the titles.",
          thisYear: 0, threeYear: 10, writeOff: 0, goodwill: 2, crew: 0,
          result: "The library stays whole. Finance sends a frowning chart." },
        { id: "license", label: "License them out instead.",
          thisYear: 30, threeYear: 40, writeOff: 0, goodwill: 3, crew: 0, needsBuyer: true,
          result: "Your shows show up on someone else's app. You cash the check." }
      ],
      real: "charge",
      card: {
        did: "Disney removed dozens of originals, including Willow, from Disney+ and Hulu on May 26, 2023 and reported a $1.5B write-off in an SEC filing.",
        next: "The filing called it a \"strategic change in approach to content curation.\" It landed during a writers' strike and blindsided many of the creators.",
        driver: "ACCOUNTING",
        chip: "The spreadsheet made the call.",
        source: { outlet: "TheWrap", title: "Disney to take $1.5 billion content write-off charge after removing titles from streaming platforms", date: "June 2023",
                  url: "https://www.thewrap.com/disney-takes-write-off-after-removing-shows-disney-plus-hulu/" }
      }
    },

    {
      id: "animated", month: 8, monthName: "December", stop: "Griffith Observatory", scene: "griffith",
      title: "The animated feature",
      setup: "A $70 million animated film is finished and it tested great. Finance says shelving it is worth about $30 million in tax savings, plus the $40 million you won't spend on marketing. An independent distributor would pay $50 million for it today.",
      choices: [
        { id: "release", label: "Release it. Spend $40M on marketing.",
          thisYear: -40, threeYear: 80, writeOff: 0, goodwill: 10, crew: 0,
          result: "The premiere is in August. The crew gets to sit in the theater." },
        { id: "sell", label: "Sell it to the independent for $50M.",
          thisYear: 50, threeYear: 50, writeOff: 0, goodwill: 4, crew: 0, needsBuyer: true,
          result: "Someone else's logo goes on the poster. The movie exists." },
        { id: "shelve", label: "Shelve it and take the write-off.",
          thisYear: 70, threeYear: -50, writeOff: 30, goodwill: -15, crew: -300, shelves: true, kills: "animated",
          result: "Finance calls it the best option on the board." }
      ],
      real: "shelve",
      card: {
        did: "Warner Bros. shelved the finished Coyote vs. Acme in November 2023 for a reported $30M tax write-off. The CEO reportedly never watched it.",
        next: "After public backlash, Ketchup Entertainment bought it. It opened August 28, 2026 and has grossed about $120M worldwide.",
        driver: "TAX",
        chip: "The person who killed it never watched it.",
        source: { outlet: "The Numbers", title: "Coyote vs. Acme (2026) box office", date: "Oct 2026",
                  url: "https://www.the-numbers.com/movie/Coyote-v-Acme-(2026)" }
      }
    },

    {
      id: "congress", month: 9, monthName: "January", stop: "Your phone, 6:40 a.m.", scene: "capitol",
      title: "The congressman",
      setup: "A congressman has posted about you. He says scrapping finished films for tax breaks is predatory, and he's asking federal regulators to look into it. The post is doing numbers.",
      choices: [
        { id: "respond", label: "Put out a statement about tough choices.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 2, crew: 0,
          result: "The statement uses the word \"strategic\" four times." },
        { id: "ignore", label: "Ignore it. Posts aren't subpoenas.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: -4, crew: 0,
          result: "The post keeps doing numbers." },
        { id: "reopen", label: "Quietly reopen the sale of what you shelved.",
          thisYear: 20, threeYear: 50, writeOff: -30, goodwill: 6, crew: 0, needsBuyer: true, needsShelved: true, unshelves: true,
          result: "You give back the write-off. A distributor sends an offer by Friday." }
      ],
      real: "ignore",
      card: {
        did: "Rep. Joaquin Castro called on the FTC and DOJ to review WBD's practice of scrapping finished films on November 13, 2023.",
        next: "He quoted someone who said it was \"like burning down a building for the insurance money.\" WBD sold Coyote vs. Acme the next year.",
        driver: "PRESSURE",
        chip: "Legal isn't the same as defensible.",
        source: { outlet: "TheWrap", title: "Joaquin Castro calls on FTC to review WBD for axing films like Coyote vs. Acme", date: "Nov 13, 2023",
                  url: "https://www.thewrap.com/joaquin-castro-calls-on-ftc-to-review-wbd-over-coyote-vs-acme/" }
      }
    },

    {
      id: "buyer", month: 10, monthName: "February", stop: "Downtown Los Angeles", scene: "downtown",
      title: "The buyer",
      // The engine picks the variant: "offer" if buyers > 0 and something is shelved,
      // "nobuyer" if buyers == 0 and something is shelved, "nothing" if nothing is shelved.
      variants: {
        offer: {
          setup: "An independent distributor is in the lobby. They'll pay $50 million for each film you shelved, which means giving back the write-off on each one. Their card says they're the last independent left in town.",
          choices: [
            { id: "sellall", label: "Sell them everything you shelved.",
              thisYear: 20, threeYear: 50, writeOff: -30, goodwill: 5, crew: 0, perShelved: true, unshelves: true,
              result: "The films come back from the dead. Not under your name." },
            { id: "refuse", label: "Refuse. You already took the write-offs.",
              thisYear: 0, threeYear: -20, writeOff: 0, goodwill: -3, crew: 0, perShelved: true,
              result: "The distributor leaves. The drives stay in the vault." }
          ]
        },
        nobuyer: {
          setup: "You wait in the lobby for a buyer. Nobody comes. Every studio that might have bought your shelved films has been bought itself.",
          choices: [
            { id: "driveon", label: "Drive on.",
              thisYear: 0, threeYear: -20, writeOff: 0, goodwill: -5, crew: 0, perShelved: true,
              result: "The films stay in the vault. There is no one left to call." }
          ]
        },
        nothing: {
          setup: "An independent distributor is in the lobby looking for shelved films to buy. You don't have any. They wish you luck.",
          choices: [
            { id: "luck", label: "Shake hands and drive on.",
              thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 1, crew: 0,
              result: "A rare quiet month." }
          ]
        }
      },
      real: "sellall",
      card: {
        did: "Coyote vs. Acme survived only because Ketchup Entertainment existed to buy it. Star Trek: Prodigy survived because Netflix did.",
        next: "Paramount Skydance closed its $110B purchase of Warner Bros. Discovery in October 2026. Each merger leaves one fewer buyer for the next shelved film.",
        driver: "MERGER",
        chip: "Your movie only survived because someone else was still standing.",
        source: { outlet: "TheWrap", title: "Coyote vs. Acme back from the dead? Ketchup makes bid to acquire scrapped project", date: "March 19, 2025",
                  url: "https://www.thewrap.com/coyote-vs-acme-saved-ketchup-entertainment-warner-bros/" }
      }
    },

    {
      id: "payvote", month: 11, monthName: "March", stop: "The shareholder meeting, Downtown", scene: "downtown",
      title: "The pay vote",
      setup: "Twelve months are up. The shareholders vote on your pay. The vote is non-binding, which means it changes nothing either way.",
      choices: [
        { id: "collect", label: "Collect the bonus.",
          thisYear: 0, threeYear: 0, writeOff: 0, goodwill: 0, crew: 0,
          result: "The check clears." }
      ],
      real: "collect",
      card: {
        did: "Almost 60% of votes cast went against the CEO's $51.9M pay package at Warner Bros. Discovery in June 2025.",
        next: "The vote was non-binding. The pay was unchanged. The people who made the films had no vote at all.",
        driver: "PAY",
        chip: "The people who paid for this don't get a vote.",
        source: { outlet: "Variety", title: "WBD shareholders vote against CEO David Zaslav's $52 million pay package in a symbolic rebuke", date: "June 4, 2025",
                  url: "https://au.variety.com/2025/tv/global/warner-bros-discovery-shareholders-vote-against-zaslav-ceo-pay-23379" }
      }
    }
  ],

  // Random events between stops. `when` is evaluated by the engine against state.
  // Each fires at most once per round. Two lines each unless it has choices.
  events: [
    { id: "screening", when: "shelved.length < 3", text: "A test screening scores a 90. The crew is thrilled.", goodwill: 3 },
    { id: "traffic", when: "true", text: "Traffic on the 101. You lose a week and $2M in overtime.", cash: -2 },
    { id: "crossing", when: "month >= 4 && month <= 8", text: "It's 5 p.m. and you need to get to the Westside.",
      choices: [
        { label: "Take the 405.", outcomes: [
          { chance: 0.5, text: "Clear sailing. A miracle.", cash: 0 },
          { chance: 0.5, text: "Three hours. You miss the meeting. -$5M.", cash: -5, goodwill: -1 } ] },
        { label: "Take Sepulveda.", outcomes: [
          { chance: 1, text: "You arrive late but intact. -$1M.", cash: -1 } ] }
      ] },
    { id: "rivalmerger", when: "buyers > 0 && month >= 2", text: "A rival studio announces a merger. One fewer buyer in town.", buyers: -1, once: true },
    { id: "trades", when: "shelved.length > 0", text: "The Hollywood press runs a story on your write-offs. It's not flattering.", goodwill: -5 },
    { id: "storyboards", when: "shelved.length > 0", text: "An animator posts storyboards from the film you shelved. Two million views.", goodwill: -5 },
    { id: "cfochart", when: "true", text: "Your CFO sends a chart. Debt is down. He adds a smiley face.", bonus: 1 },
    { id: "strike", when: "month >= 1 && month <= 6", text: "The writers go on strike. Production slows everywhere.", goodwill: -3, cash: -10 },
    { id: "talentleaves", when: "goodwill < 30 && month >= 8", text: "Top directors are taking their next projects elsewhere. Next year's lineup is thin.", bonus: -5 },
    { id: "bankers", when: "cash < 0", text: "The bankers call. They've seen the cash number.", goodwill: -3, once: true }
  ],

  // Round-two rule cards. `available` marks the first build; the others are stretch.
  rules: [
    { id: "threeYear",     name: "Three-year bonus",  text: "Your bonus pays out on three-year results, not this year's savings.", available: true },
    { id: "rightsRevert",  name: "Rights revert",     text: "Anything you shelve goes back to its creators after 12 months.", available: true },
    { id: "creatorVeto",   name: "Creator veto",      text: "You can't shelve a finished project without its creators' sign-off. They can force a sale instead.", available: true },
    { id: "writeOffsCount", name: "Write-offs count", text: "Every write-off on finished work is subtracted from your bonus.", available: false },
    { id: "oneFewerBuyer", name: "One fewer buyer",   text: "No new protections. Instead, another merger happened on day one and there's no one left to buy what you shelve.", available: false }
  ],

  pace: [
    { id: "steady",     name: "Steady",         text: "Get debt down to $46.0B. You can get there without killing anything.", debtTarget: 46.0 },
    { id: "aggressive", name: "Aggressive",     text: "Get debt down to $45.5B. You'll need some savings.", debtTarget: 45.5 },
    { id: "slash",      name: "Slash and Burn", text: "Get debt down to $45.0B. Finance is very excited.", debtTarget: 45.0 }
  ],

  about: "Write-Off is a semester project for MNGT 301 at the University of Nebraska-Lincoln by team durKheim. Every decision in the game is based on a real one, cited on the card after you choose. Round two changes one rule to show how the same decision looks under different incentives. Game dollar amounts are simplified; the real figures are on the cards."
};
