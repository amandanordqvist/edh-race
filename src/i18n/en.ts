import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    siteName: 'EDH Racing',
    tagline: 'Pushing Swedish drag racing beyond limits',
  },
  nav: {
    home: 'Home',
    journey: 'The Journey',
    machine: 'The Machine',
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
    quickLinks: 'Quick links',
    contact: 'Contact',
    social: 'Social',
    rights: '© EDH Racing. All rights reserved.',
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
    tagline: 'Pushing Swedish drag racing beyond limits',
    cta: 'Experience the journey',
    statsTitle: 'Santa Pod. 5.74. 415.',
    statsLead:
      'The global breakthrough — quarter-mile and top speed that define The Beast.',
    stats: {
      quarter: { value: '5.74s', label: 'Quarter Mile' },
      topSpeed: { value: '415 km/h', label: 'Top Speed' },
      eighth: { value: '3.82s', label: 'Eighth Mile' },
      hp: { value: '2,500–3,000', label: 'Horsepower' },
    },
    sponsorsTitle: 'Built for sponsors. Driven by precision.',
    sponsorsBody:
      'A drag racing team at the absolute European elite needs more than horsepower — it demands extreme precision, endurance and passion. Anders Edh builds, develops and calibrates his 3,000 hp Camaro entirely on his own in the garage in Hudiksvall. Partnering with EDH Racing puts your brand on Europe’s fastest stages and associates it with Scandinavian excellence and engineering at its most extreme.',
    simulatorTitle: 'Dragstrip simulator',
    simulatorBody:
      'Stage the car, wait for green — and watch The Beast (5.74s) against Formula 1 and a passenger jet over 402 metres.',
    simulatorStage: 'Stage the car',
    simulatorAgain: 'Race again',
    simulatorStatus: {
      idle: 'Ready to stage',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Green!',
      racing: 'Race in progress',
      finished: 'Finish — The Beast wins',
    },
    simulatorCompare: {
      camaro: 'The Beast · 5.74s',
      f1: 'Formula 1',
      jet: 'Passenger jet',
    },
  },
  journey: {
    title: 'Anders’ journey',
    intro:
      'From the vibration in a mini-moped handlebar in Hudiksvall to the European elite — built in his own garage, never bought ready-made.',
    beatChildhood: 'The beginning',
    beatTurning: 'The turning point',
    beatPhilosophy: 'The philosophy',
    quote1:
      'I still remember the feeling when the engine started and the vibrations went through the bars. That feeling has never left me.',
    quote1Attr: 'Anders Edh',
    turningPoint:
      'At sixteen, Anders bought his first Chevrolet Camaro (1971) for SEK 14,800. But it was New Year’s Eve 2004 that sealed his drag racing fate — a spontaneous eBay purchase of a 1970 Camaro from New Jersey that changed everything.',
    philosophy:
      'Anders stands apart from many rivals by doing everything himself. Instead of buying a ready-made chassis from the USA, he builds, develops and tunes the cars in his own garage in Hudiksvall.',
    quote2:
      'Anyone can look up the information — the hard part is knowing what to look up.',
    quote2Attr: 'Anders Edh',
    timelineTitle: 'The verified timeline',
    timeline: {
      '1970s-first-camaro':
        'Buys his first Camaro (1971) for SEK 14,800 at age sixteen.',
      '2004-ebay': 'Spontaneous New Year’s Eve purchase of a 1970 Camaro on eBay.',
      '2005-license':
        'Introduced to drag racing by Kjell-Åke Kring (Norrbo) and earns his licence in Söderhamn. Mechanic Martin Ekstedt appears in the garage.',
      '2006-10s': 'Runs 10.0 seconds over 402 metres (the quarter mile).',
      '2010-nitrous': 'Reaches 7.8 seconds over 402 metres with a nitrous engine.',
      '2013-chassis':
        'Strips the car completely and builds a tube chassis from scratch. The street car is now a pure race machine.',
      '2016-680':
        'Posts 6.80 seconds over 402 metres. Anders stands at a crossroads and considers selling everything.',
      '2016-2017-blower':
        'Switches to a blower Chevrolet engine — the start of an entirely new era of success.',
      '2017-edrs6':
        'Almost immediately runs 4.15 seconds over 201 metres. Finishes 6th in the European Drag Racing Series.',
      '2018-runnerup':
        'Runner-up in the Northern European Summit Racing EDRS Series in Top Doorslammer.',
      '2019-champion':
        'Wins the Nordic Top Doorslammer series and takes 1st place in the European Drag Racing Series (EDRS).',
      '2021-record':
        'Final season with the steel-bodied car. Sets a historic European doorslammer record of 3.89 seconds over 201 metres.',
      '2023-beast':
        'Builds an all-new Camaro with carbon-fibre body, BAE 521 engine and MB chassis.',
      '2024-santapod':
        'Global breakthrough at Santa Pod in England. A spectacular personal best of 5.74 seconds @ 415 km/h.',
      '2025-podium':
        'Recruits Andreas Gröning to the team. Strong 3rd place overall in Top Doorslammer European Drag Racing Series.',
      '2026-season':
        'Opens the season with a win at Santa Pod. Runs 3.87 seconds on the asphalt track in Hudiksvall after intense four-link and weight-balance work.',
    },
  },
  machine: {
    title: 'The Machine',
    intro:
      'Deep technical detail on the Chevrolet Camaro “The Beast” — showcasing the team’s engineering excellence for enthusiasts and engineer-minded sponsors.',
    chassisTitle: 'Interactive chassis',
    chassisBody:
      'Tap the pulsing hotspots to explore The Beast’s anatomy — BAE 521, PSI blower, MB chassis and 4-link.',
    chassisHint: 'Move to tilt · click a hotspot',
    turntableHint: 'Drag or pick an angle',
    turntableLabel: 'Explore The Beast — drag, use arrow keys, or choose an angle',
    specsTitle: 'Technical specifications',
    narrativeTitle: 'Forces & curiosities',
    extremeForcesTitle: 'Extreme forces',
    extremeForces:
      'The parachutes deployed at the finish must withstand enormous loads to slow the car from 415 km/h. On the historic Santa Pod record run, so much force developed that the chutes lifted the rear of the car off the ground.',
    speedCompareTitle: 'Faster than a jet on takeoff',
    speedCompare:
      'At 415 km/h Anders travels faster than most commercial passenger jets during takeoff — around 290 km/h.',
    logisticsTitle: 'Logistics',
    logistics:
      'Transporting and racing this machine across Europe demands huge logistics — ferry and freight to England alone exceed SEK 30,000 per trip.',
    compareCamaro: 'The Beast',
    compareJet: 'Passenger jet (takeoff)',
    hotspots: {
      engine: {
        title: 'BAE 521 Hemi engine',
        body: '8.5-litre blown methanol machine delivering around 2,500–3,000 horsepower.',
      },
      compressor: {
        title: 'PSI screw blower',
        body: 'Delivers constant, brutal boost to the engine.',
      },
      chassis: {
        title: 'Mats Brag (MB) chassis',
        body: 'Chromoly tube chassis.',
      },
      fourLink: {
        title: 'MB 4-Link',
        body: 'The adjustable rear suspension that controls chassis angle and plants power into the asphalt.',
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
    standingsTitle: 'Championship results — EDRS Top Doorslammer',
    bestTimesTitle: 'Historic best times (201 m / 660 ft)',
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
      'Hundredths are won in the pits. The crew builds the precision — family and support keep the team rolling across Europe.',
    crewTitle: 'Key people in the pits',
    supportTitle: 'Support & family',
    members: {
      anders: {
        role: 'Driver & team owner',
        bio: 'Founder and the driving force who leads the entire team.',
      },
      martin: {
        role: 'Mechanic',
        bio: 'The backbone of the team — in the garage since 2005 (racing since 2007). Obsessively detail-focused and makes sure everything works on the start line.',
      },
      andreas: {
        role: 'Mechanic',
        bio: 'Joined ahead of the 2025 season. Quickly became an invaluable asset with his technical speed.',
      },
      john: {
        role: 'Mechanic',
        bio: '“Our cheerful John” joined in 2024 and has contributed strongly to the team’s technical progress with his broad knowledge.',
      },
      olle: {
        role: 'Technical advisor',
        bio: 'Anders’ brother. Passionate about motorsport and has contributed ingenious ideas and solutions for years with deep technical expertise.',
      },
      marie: {
        role: 'Logistics lead',
        bio: 'Anders’ partner and the team’s backbone. Handles food, logistics and keeps the pits running smoothly on race weekends.',
      },
      amanda: {
        role: 'Media & PR',
        bio: 'Anders’ daughter. Runs social media, the website and marketing to grow the team’s visibility.',
      },
      siggi: {
        role: 'Documentary filmmaker',
        bio: 'Follows the team closely to capture the journey and produce professional video.',
      },
    },
  },
  media: {
    title: 'Media',
    intro:
      'Anchored by The Miracle Run — Santa Pod 5.74s @ 415 km/h — then burnout, launch, pits and archive.',
    items: {
      miracle: {
        title: 'The Miracle Run',
        caption:
          'The historic Santa Pod record — 5.74s @ 415 km/h with tyre smoke and raw force.',
      },
      burnout: {
        title: 'Burnout Santa Pod',
        caption:
          'The Beast heats the slicks in front of Santa Pod Raceway — white smoke, blue paint, European elite.',
      },
      launch: {
        title: 'Launch · Tierp',
        caption:
          'Tyre wrinkle on launch — Anders Edh and The Beast planting power into the asphalt.',
      },
      pits: {
        title: 'Pit precision',
        caption:
          'The EDH Racing crew fine-tuning the parachute system — hundredths decided before the tree.',
      },
      staging: {
        title: 'Staging',
        caption:
          'Final check at the car — crew in EDH hoodies, driver in the cage, the start line waiting.',
      },
      archive: {
        title: 'Helsinge Open 2009',
        caption:
          'Anders on the start line at Helsinge Open 2009 with his earlier steel-bodied car.',
      },
    },
  },
  contact: {
    title: 'Sponsors & contact',
    pitchLead: 'More than a logo on a car.',
    pitch:
      'A partnership with EDH Racing puts your brand on Europe’s fastest stages and associates it with Scandinavian excellence — the same craft that builds The Beast in the garage in Hudiksvall.',
    valuesTitle: 'What you get',
    values: {
      exposure: {
        title: 'Elite European exposure',
        body: 'Hundreds of thousands of fans on site and via digital broadcasts in the Top Doorslammer elite.',
      },
      beast: {
        title: 'The Beast in your story',
        body: 'Use the team and Camaro in your own marketing, customer events or internal keynotes.',
      },
      precision: {
        title: 'Precision under pressure',
        body: 'Associate your brand with extreme engineering, endurance and teamwork when hundredths decide.',
      },
    },
    formTitle: 'Partner enquiry',
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
    mailtoSubject: 'Partnership enquiry — EDH Racing',
  },
}
