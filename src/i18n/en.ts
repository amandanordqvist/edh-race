import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    siteName: 'EDH Racing',
    tagline: 'Garage-built in Hudiksvall',
  },
  nav: {
    home: 'Home',
    journey: 'The Journey',
    machine: 'The Machine',
    pass: 'The pass',
    results: 'Results',
    team: 'The Team',
    media: 'Media',
    contact: 'Sponsors',
  },
  lang: {
    sv: 'SV',
    en: 'EN',
    switchTo: 'Switch language',
  },
  footer: {
    quickLinks: 'Primary',
    more: 'More',
    contact: 'Contact',
    social: 'Social',
    rights: '© EDH Racing. All rights reserved.',
    ctaTitle: 'After the pass',
    ctaBody:
      'If the times, the car and the quiet work in Hudiksvall feel right: get in touch. We are a small team.',
  },
  common: {
    comingSoon: 'Coming soon',
    readMore: 'Read more',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    locationValue: 'Hudiksvall, Sweden',
  },
  home: {
    brand: 'EDH Racing',
    headline: '5.74 seconds. A whole team behind every hundredth.',
    heroKicker: 'Swedish Top Doorslammer',
    heroClass: 'Top Doorslammer',
    lead: 'Edh Racing from Hudiksvall races one of Sweden’s quickest doorslammers. Follow the team, the car, and the hunt for the next record.',
    ctaTeam: 'Meet the team',
    ctaMachine: 'Discover the car',
    statsTitle: '5.74 seconds. 415 km/h.',
    statsLead: 'Quickest quarter-mile pass. The times on the board.',
    statsMeta: 'Santa Pod · quarter mile',
    stats: {
      quarter: { code: 'ET', value: '5.74', unit: 's', label: '402 m' },
      topSpeed: { code: 'SPEED', value: '415', unit: 'km/h', label: 'Terminal' },
      eighth: { code: '1/8', value: '3.80', unit: 's', label: 'Eighth mile' },
      base: { code: 'CLASS', value: 'TDS', unit: '', label: 'Top Doorslammer' },
    },
    driverLabel: 'The driver',
    driverEyebrowMeta: 'Since 1998',
    driverTitle: 'Anders Edh',
    driverTagline: 'Builder  ·  Driver  ·  From Hudiksvall',
    driverBody:
      'Anders builds, tunes and drives from the same garage in Hudiksvall. The times do the talking.',
    driverQuote: 'I’d rather show the result than talk myself up.',
    driverCta: 'The full journey',
    driverCtaSecondary: 'See the car',
    driverCredits: 'Hudiksvall, SE  ·  Top Doorslammer  ·  Built in his own garage',
    driverCardMeta: 'Santa Pod · 2024',
    driverCardTime: '5.74 s · 415 km/h',
    driverAlt: 'Anders Edh standing in his racing suit',
    machineLabel: 'The car',
    machineTitle: 'The Beast',
    machineBody:
      'Chevrolet Camaro with a tube chassis, Five Star body and BAE Hemi. Built for Top Doorslammer — every detail visible.',
    machineCta: 'The tech behind it',
    machineAlt: 'EDH Racing Chevrolet Camaro in a dark setting',
    teamLabel: 'The team',
    teamTitle: 'Not a one-man show',
    teamBody:
      'Every pass starts long before Anders sits behind the wheel. Crew, logistics and family keep the car on the track.',
    teamQuote:
      'The car gets the spotlight. But every run starts long before Anders sits behind the wheel.',
    teamCta: 'Meet the full team',
    teamPhotoAlt: 'The EDH Racing team in the pits',
    storyLabel: 'The story',
    storyTitle: 'Then the quiet',
    storyBody:
      'Pause. Restart. A new Camaro. Back to the start line — and 5.74 at Santa Pod. The comeback matters as much as the record.',
    storyCta: 'Follow the timeline',
    nextRaceLabel: 'Season',
    nextRaceTitle: 'Next start',
    nextRaceClassLabel: 'Class',
    nextRaceClass: 'Top Doorslammer',
    nextRaceStatus: 'Upcoming',
    nextRaceSeasonDone: 'This season’s rounds are done. Follow the results and the next chapter.',
    nextRaceCta: 'Full calendar',
    sponsorsTitle: 'Build the next chapter with us',
    sponsorsBody:
      'Edh Racing races in front of engaged crowds in Sweden and the UK. As a partner, your brand becomes part of the car, the team, the events and the story around every pass.',
    sponsorsBenefits: [
      'Visibility on the car',
      'Visibility on team kit',
      'Social media content',
      'Company visits and events',
      'Tickets and race-day experiences',
      'Exposure on web and film',
    ],
    sponsorsCta: 'Get in touch',
    passTeaserTitle: 'The pass',
    passTeaserBody:
      'See the live comparison: 5.74 seconds over 402 metres against Formula 1 and a passenger jet.',
    passTeaserCta: 'Open the pass',
    passTeaserAlt: 'Santa Pod Raceway drag strip at dusk',
    imageFallback: 'Image could not be loaded',
  },
  pass: {
    title: 'The pass',
    lead: 'Santa Pod, quarter mile — 5.74 s against Formula 1 or a passenger jet.',
    stage: 'Stage the car',
    again: 'Race again',
    mute: 'Mute',
    unmute: 'Unmute',
    followCar: 'Follow car',
    zoomOut: 'Zoom out',
    loading: 'Loading Pass Arena…',
    modelCredit: '3D car: Camaro scan (Tripo3D)',
    modelCreditHref: 'https://tripo3d.ai',
    webglFallback:
      'Your device could not show the interactive comparison. The times below still show how quick the pass is over 402 metres.',
    continueJourney: 'Continue the journey',
    openTimeslip: 'Open the timeslip',
    closeTimeslip: 'Close timeslip',
    readTimeslip: 'Read the timeslip — decode the numbers',
    gapAhead: 'ahead',
    gapBehind: 'behind',
    reactionHint: 'Space on green measures your reaction.',
    launchWait: 'Wait for green',
    launchNow: 'LAUNCH!',
    launchKeyHint: 'Space',
    yourReaction: 'Your RT',
    reactionFaster: 'Faster than Anders — red-light if this were live',
    cockpitView: 'Cockpit',
    expandTrack: 'Full screen',
    collapseTrack: 'Close',
    scrubLabel: 'Scrub the pass',
    chuteStatus: 'Chutes out',
    scrubChute: 'Chutes',
    flyby: {
      highway: 'Past highway limit · 120 km/h',
      autobahn: 'Past Autobahn pace · 200 km/h',
      tgv: 'Past TGV cruise · 300 km/h',
      hypercar: 'Past Bugatti Chiron · 400 km/h',
    },
    pickOpponent: 'Race against',
    status: {
      idle: 'Pick opponent — inspect — stage',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Green!',
      racing: 'Race in progress',
      finished: 'Finish. The Beast first.',
    },
    compare: {
      camaro: 'The Beast',
      f1: 'Formula 1',
      jet: 'Passenger jet',
    },
    compareMeaning: {
      camaro:
        'A real Doorslammers pass from a standing start: 5.75 s and about 415 km/h over 402 m.',
      f1:
        'Approximate time for an F1 car from a standing start over the same 402 m. Slower hook at 60′ — built for circuit laps, not a drag launch.',
      jet:
        'Approximate time for a passenger jet from a standing start. Almost stationary at 60′; jet engines build speed slowly from the ground.',
    },
    timeslipTitle: 'Timeslip',
    timeslipDistance: '402 m · 1320 ft · quarter mile',
    timeslipPlace: 'Place',
    timeslipEvent: 'Doorslammers · 19 May 2024 · E2',
    timeslipGuide: 'How to read the slip — each row is a timing mark along the strip.',
    timeslipCompareTitle: 'Why F1 and the jet?',
    timeslipCompareLead:
      'This is not a real race between the vehicles. It is an educational comparison: the same 402 m, standing start, one rival in the other lane. The point is how extreme doorslammer acceleration really is.',
    primerLead:
      'EDH usually races 201 m in the European Drag Racing Series. Here you run a quarter-mile pass (402 m) from Santa Pod — the full acceleration, from zero to 415 km/h.',
    inspectHint: 'Drag to spin the car · scroll to zoom',
    context201: {
      title: '201 m vs 402 m — two different yardsticks',
      body:
        'In Scandinavia and the EDRS, series times are measured over 201 metres (660 ft). The quarter mile (402 m) is the classic distance — and the one that produced the Santa Pod record pass. Same pass, same car — different distance, different numbers.',
      edrsStat: 'At 201 m on this pass: 3.83 s · 326 km/h — EDH’s usual race distance.',
      quarterStat: 'At 402 m (finish): 5.75 s · 415 km/h — the quarter-mile reference.',
    },
    sportWhy: {
      title: 'Why the numbers matter',
      body:
        'Drag racing is about controlled acceleration — not top speed alone. Every hundredth on the slip is garage work: grip, engine, chassis and setup. In Top Doorslammer, 201 m is the series benchmark; the quarter mile puts the car in a global context. Teams chase both — it is the same craft behind them.',
    },
    anchorsTitle: 'Everyday reference points',
    anchors: {
      distance: '402 m ≈ a football pitch plus both penalty boxes in length.',
      time: '5.75 s — shorter than one deep breath (~4–6 s).',
      speed: '415 km/h — faster than a regional train at full speed.',
      trap: 'Trap speed = speed at the finish line, not average speed. The car is fastest just before the chutes.',
    },
    splitCallouts: {
      sixty: '60′ · ~18 m · launch and grip are decided here',
      threeThirty: '330′ · ~100 m · already faster than most cars ever go',
      eighth: '660′ · 201 m · EDH’s usual distance · 326 km/h',
      thousand: '1000′ · ~305 m · final push to the quarter-mile finish',
      quarter: '1320′ · 402 m · Santa Pod pace · 415 km/h',
      chutes: 'Chutes — now the car has to stop',
    },
    racingHud: {
      reaction: 'Reaction time',
      elapsed: 'ET',
      speedUnit: 'km/h',
      rpmUnit: 'RPM',
      tireLabel: 'Slick',
      chutes: 'Chutes',
    },
    timeslipSplits: {
      reaction: {
        label: 'Reaction',
        meaning: 'Time from green light until the car moves. Quicker reaction = better leave.',
      },
      sixty: {
        label: '60′ ET',
        meaning: 'Time to 60 feet (~18 m). Shows how hard the car hooks off the line.',
      },
      threeThirty: {
        label: '330′ ET',
        meaning: 'Time to 330 feet (~100 m). Measures pull just after the launch.',
      },
      eighth: {
        label: '1/8 ET',
        meaning:
          '660 ft = 201 m — EDH’s usual race distance in the EDRS. On this pass: 3.83 s and 326 km/h. Halfway on a quarter mile.',
      },
      thousand: {
        label: '1000′ ET',
        meaning: 'Time and speed at 1000 feet (~305 m), just before the traps.',
      },
      quarter: {
        label: '1320′ ET',
        meaning: 'Elapsed time for the full quarter mile (402 m) — the board time.',
      },
      trapMph: {
        label: '1320′ MPH',
        meaning: 'Trap speed at the finish. 258 mph ≈ 415 km/h.',
      },
    },
  },
  journey: {
    title: 'A running timeslip',
    intro:
      'A garage in Hudiksvall. A Camaro. A number that keeps falling. The whole career fits inside the times at the finish line — read the rows as they get filled in.',
    beatChildhood: 'The beginning',
    beatPhilosophy: 'The philosophy',
    quote1:
      'I still remember the feeling when the engine started and the vibrations went through the bars. That feeling has never left me.',
    quote1Attr: 'Anders Edh',
    philosophy:
      'Anders does not buy ready-made answers. He builds, develops and tunes in the garage in Hudiksvall, and digs into details others often skip.',
    quote2:
      'Anyone can look up the information. The hard part is knowing what to look up.',
    quote2Attr: 'Anders Edh',
    spineLabel: 'Timeslip: rows of a career',
    crossroadsLabel: 'The crossroads · 2016',
    crossroadsBody:
      'The fastest year yet, and still no fields were filled in. The car sat in the garage. The economy was recounted. No new time was recorded. Anders considered selling everything.',
    crossroadsCaption: 'Blank timeslip. Nothing measured.',
    finalRowCaption: 'The next row gets written at the track.',
    chapters: {
      roots: 'Roots',
      build: 'Build',
      elite: 'The tracks',
      record: 'Record',
    },
    timeline: {
      '1970s-first-camaro':
        'Sixteen years old, Anders buys his first Camaro (a 1971) for SEK 14,800. No times measured — only the feeling of owning an American car.',
      '2004-ebay':
        'New Year’s Eve. An impulse buy on eBay. A 1970 Camaro rolls off the boat from New Jersey.',
      '2005-license':
        'Kjell-Åke Kring drags Anders into the sport. Racing licence in Söderhamn. Mechanic Martin Ekstedt shows up in the garage.',
      '2006-10s':
        'First season with the clock running. The quarter mile — 402 metres — falls on ten seconds flat.',
      '2010-nitrous':
        'Nitrous in the engine. The quarter mile drops to 7.80 s. The steel-body car starts getting serious.',
      '2013-chassis':
        'The car comes apart completely. A tube chassis is welded up from scratch. The street car stops existing — a race machine replaces it.',
      '2016-680':
        'The fastest season yet with the steel body. 6.80 s over 402 m. Costs set hard limits at the same time.',
      '2016-crossroads': 'Blank row. No time measured.',
      '2016-2017-blower':
        'A new direction. A screw blower on the Chevrolet engine replaces the nitrous. The rebuild takes a whole winter.',
      '2017-edrs6':
        'New distance — 201 m in the European Drag Racing Series. 4.15 s straight out of the box. Sixth overall.',
      '2018-runnerup':
        'Runner-up in the Summit Racing EDRS Series in Top Doorslammer. Season read all the way through.',
      '2019-champion':
        'Nordic champion in Top Doorslammer. 1st in EDRS.',
      '2021-record':
        'Final season with the steel body. 3.89 s over 201 m — then the fastest doorslammer record in Europe.',
      '2023-beast':
        'The Beast takes shape. Carbon-fibre body, BAE 521 engine, MB chassis. The car exists, but the time has not been measured yet.',
      '2024-santapod':
        'Santa Pod, England. 5.7451 s @ 415 km/h. The record row of the career.',
      '2025-podium':
        'Andreas Gröning joins. Third overall in EDRS Top Doorslammer.',
      '2026-season':
        'Win in the first start at Santa Pod. 3.87 s on the asphalt track in Hudiksvall after four-link and weight-balance work.',
    },
    marks: {
      '2006-10s': '10.00 s',
      '2010-nitrous': '7.80 s',
      '2016-680': '6.80 s',
      '2017-edrs6': '4.15 s',
      '2018-runnerup': '2nd EDRS',
      '2019-champion': '1st EDRS',
      '2021-record': '3.89 s',
      '2024-santapod': '5.7451 s',
      '2026-season': '3.87 s',
    },
    timeslip: {
      eyebrow: 'EDH Racing · Timeslip',
      event: 'Career · 1970s–2026',
      distance: 'Read top to bottom',
      colYear: 'Year',
      colDistance: 'Distance',
      colEt: 'ET',
      colOutcome: 'Outcome',
      outcomeLabels: {
        quiet: 'Quiet year',
        race: 'Race',
        record: 'Record',
        championship: 'Championship',
        setback: 'Setback',
        rebuild: 'Rebuild',
      },
    },
    bookends: {
      'bookend-2011': {
        label: '2011–2012',
        caption:
          'Two winters without racing. The tube chassis is redrawn, the steel body is stripped, nothing is measured.',
      },
      'bookend-2022': {
        label: '2022',
        caption:
          'The Beast is coming together in the workshop. The old car stands still; the new one is not running yet.',
      },
    },
  },
  machine: {
    title: 'The Machine',
    intro:
      'Chevrolet Camaro The Beast: what it is built from, and how it works. For anyone who wants to look under the skin.',
    chassisTitle: 'Interactive chassis',
    chassisBody:
      'Tap the points to read about the BAE 521, PSI blower, MB chassis and 4-link.',
    chassisHint: 'Move to tilt · click a hotspot',
    turntableHint: 'Drag or pick an angle',
    turntableLabel: 'Explore The Beast: drag, use arrow keys, or choose an angle',
    specsTitle: 'Technical specifications',
    narrativeTitle: 'Forces & curiosities',
    extremeForcesTitle: 'Forces in the chutes',
    extremeForces:
      'The parachutes at the finish have to bring the car down from 415 km/h. At Santa Pod the force was so high the chutes lifted the rear off the ground.',
    speedCompareTitle: 'Compared with a jet on takeoff',
    speedCompare:
      'At 415 km/h the car is faster than many passenger jets during takeoff (around 290 km/h).',
    logisticsTitle: 'Logistics',
    logistics:
      'Taking the car through Europe costs time and money. Ferry and freight to England alone sit above SEK 30,000 per trip.',
    compareCamaro: 'The Beast',
    compareJet: 'Passenger jet (takeoff)',
    hotspots: {
      engine: {
        title: 'BAE 521 Hemi engine',
        body: '8.5-litre blown methanol engine. Roughly 2,500–3,000 horsepower.',
      },
      compressor: {
        title: 'PSI screw blower',
        body: 'Steady, high boost to the engine.',
      },
      chassis: {
        title: 'Mats Brag (MB) chassis',
        body: 'Chromoly tube chassis.',
      },
      fourLink: {
        title: 'MB 4-Link',
        body: 'Adjustable rear suspension that sets chassis angle and how power hits the asphalt.',
      },
    },
    specLabels: {
      model: 'Model',
      class: 'Class',
      body: 'Body',
      engine: 'Engine',
      displacement: 'Displacement',
      power: 'Power',
      transmission: 'Transmission',
      crankshaft: 'Crankshaft',
      fuel: 'Fuel',
      weight: 'Weight',
    },
  },
  results: {
    title: 'Races & results',
    heroEt: '5.74 s',
    heroSpeed: '415 km/h',
    heroCaption: 'Quickest quarter mile — Santa Pod.',
    heroCta: 'Championship calendar',
    heroAlt: 'EDH Racing Camaro on track at Santa Pod',
    standingsTitle: 'EDRS Top Doorslammer',
    standingsLead: 'Championship finishing place, season by season.',
    bestTimesTitle: 'Historic times (201 m / 660 ft)',
    bestTimesLead:
      'ET is the time over 201 metres. Speed is measured at the finish.',
    calendarTitle: 'Swedish Championship calendar 2026',
    nextStart: 'Next start',
    highlightBest: 'Best ET',
    highlightLatest: 'Latest',
    colYear: 'Year',
    colEvent: 'Event',
    colTime: 'ET',
    colSpeed: 'Speed',
    colPlace: 'Place',
    round: 'Round',
    final: 'Final',
  },
  team: {
    title: 'The Team',
    intro:
      'Hundredths are decided in the pits. The crew looks after the car. Family and support keep the team rolling across Europe.',
    crewTitle: 'Key people in the pits',
    supportTitle: 'Support & family',
    groupPhotoAlt: 'The EDH Racing team gathered in the pits',
    members: {
      anders: {
        role: 'Driver & team owner',
        bio: 'Builds, tunes and drives. Started with a Camaro and a garage in Hudiksvall. Prefers to show the result rather than talk himself up.',
      },
      martin: {
        role: 'Mechanic',
        bio: 'In the garage since 2005 (racing since 2007). Keeps an eye on the details so the car works on the start line.',
      },
      andreas: {
        role: 'Mechanic',
        bio: 'Joined ahead of the 2025 season. Extra hands and eyes between passes.',
      },
      john: {
        role: 'Mechanic',
        bio: 'Joined in 2024. Broad knowledge and good spirits in the pits.',
      },
      olle: {
        role: 'Technical advisor',
        bio: 'Anders’ brother. Motorsport nerd who has brought ideas and solutions over the years.',
      },
      marie: {
        role: 'Logistics',
        bio: 'Anders’ partner. Food, logistics and keeping the pits working on race weekends.',
      },
      amanda: {
        role: 'Media & web',
        bio: 'Anders’ daughter. Social media, the website and making the team visible.',
      },
      siggi: {
        role: 'Documentary filmmaker',
        bio: 'Follows the team and films the journey.',
      },
    },
  },
  media: {
    title: 'Media',
    intro:
      'Photos and clips from the strip and the pits. Santa Pod 5.74s @ 415 km/h, then burnout, launch, pits and archive.',
    feedTitle: 'Latest on Facebook',
    feedLead: 'Updates from the strip, the pits and the team — straight from EDH Racing.',
    feedCta: 'Open on Facebook',
    items: {
      miracle: {
        title: 'The Miracle Run',
        caption: 'Santa Pod: 5.74s @ 415 km/h.',
      },
      burnout: {
        title: 'Burnout Santa Pod',
        caption: 'The Beast heats the slicks in front of Santa Pod Raceway.',
      },
      launch: {
        title: 'Launch · Tierp',
        caption: 'Launch at Tierp: tyre wrinkle as the power takes hold.',
      },
      pits: {
        title: 'The pits',
        caption: 'The crew adjusts the parachute system before the start.',
      },
      staging: {
        title: 'Staging',
        caption: 'Final check at the car. The start line waits.',
      },
      archive: {
        title: 'Helsinge Open 2009',
        caption: 'Anders on the start line in 2009 with the earlier steel-bodied car.',
      },
      santapodLane: {
        title: 'Santa Pod',
        caption: 'The Beast on the strip during the record season.',
      },
      stripNight: {
        title: 'Evening on the strip',
        caption: 'Lights, smoke and the wait between passes.',
      },
      burnoutClose: {
        title: 'Burnout',
        caption: 'When the slicks catch and grip builds.',
      },
      crewMoment: {
        title: 'Between passes',
        caption: 'The crew works while the clock ticks.',
      },
      garageEra: {
        title: 'Garage years',
        caption: 'An earlier Camaro — built in Hudiksvall.',
      },
      earlyCamaro: {
        title: 'Early Camaro',
        caption: 'The roots before the Top Doorslammer era.',
      },
      recordFrame: {
        title: 'Record pass',
        caption: 'Still from the Santa Pod campaign.',
      },
    },
  },
  contact: {
    title: 'Sponsors & contact',
    pitchLead: 'A small team. A car from the garage.',
    pitch:
      'We do not boast. We show the times and the car. If you want to stand beside a garage build from Hudiksvall that runs 5.74s @ 415 km/h: get in touch.',
    proof: '5.74s · 415 km/h · Santa Pod',
    valuesTitle: 'What working together can mean',
    values: {
      exposure: {
        title: 'Visibility on the strip',
        body: 'Crowds and broadcast in Top Doorslammer, without pretending we are bigger than we are.',
      },
      beast: {
        title: 'The car in your story',
        body: 'The Camaro and the team can appear in your own communication, if it fits.',
      },
      precision: {
        title: 'An honest partnership',
        body: 'You get a team that works the details, not a ready-made ad product.',
      },
    },
    formTitle: 'Partner enquiry',
    formHint: 'Opens your email app with a ready message. No account required.',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    interest: 'Interest',
    interestOptions: {
      main: 'Title sponsor',
      gold: 'Gold partner',
      silver: 'Silver partner',
      material: 'Material partner',
    },
    submit: 'Send via email',
    afterSend: 'If your mail app did not open, write to the address in the contact card.',
    mailtoSubject: 'Partnership enquiry: EDH Racing',
    pitchAlt: 'EDH Racing partner offer — car and visibility',
  },
}
