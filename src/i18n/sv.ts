import type { Dictionary } from './types'

export const sv: Dictionary = {
  meta: {
    siteName: 'EDH Racing',
    tagline: 'Pushing Swedish dragracing beyond limits',
  },
  nav: {
    home: 'Hem',
    journey: 'Anders resa',
    machine: 'Maskinen',
    results: 'Resultat',
    team: 'Teamet',
    media: 'Media',
    contact: 'Sponsorer',
  },
  lang: {
    sv: 'SV',
    en: 'EN',
    switchTo: 'Byt språk',
  },
  footer: {
    quickLinks: 'Snabblänkar',
    contact: 'Kontakt',
    social: 'Sociala medier',
    rights: '© EDH Racing. Alla rättigheter förbehållna.',
  },
  common: {
    comingSoon: 'Kommer snart',
    readMore: 'Läs mer',
    email: 'E-post',
    phone: 'Telefon',
    location: 'Ort',
    locationValue: 'Hudiksvall, Sverige',
  },
  home: {
    brand: 'EDH Racing',
    tagline: 'Pushing Swedish dragracing beyond limits',
    cta: 'Upplev resan',
    statsTitle: 'Santa Pod. 5.74. 415.',
    statsLead:
      'Det globala genombrottet — kvartsmil och toppfart som definierar The Beast.',
    stats: {
      quarter: { value: '5.74s', label: 'Quarter Mile' },
      topSpeed: { value: '415 km/h', label: 'Toppfart' },
      eighth: { value: '3.82s', label: 'Eighth Mile' },
      hp: { value: '2 500–3 000', label: 'Hästkrafter' },
    },
    sponsorsTitle: 'Byggd för sponsorer. Driven av precision.',
    sponsorsBody:
      'Ett dragracingteam i den absoluta Europatoppen kräver mer än bara hästkrafter – det kräver extrem precision, uthållighet och passion. Anders Edh bygger, utvecklar och kalibrerar sin 3 000-hästars Camaro helt på egen hand i garaget i Hudiksvall. Genom att samarbeta med EDH Racing syns ert varumärke på Europas snabbaste arenor och förknippas med skandinavisk spetskompetens och ingenjörskonst i dess mest extrema form.',
    simulatorTitle: 'Dragstrip-simulator',
    simulatorBody:
      'Stagea bilen, vänta på grönt — och se The Beast (5.74s) mot Formel 1 och ett passagerarflygplan över 402 meter.',
    simulatorStage: 'Stagea bilen',
    simulatorAgain: 'Kör igen',
    simulatorStatus: {
      idle: 'Redo att stagea',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Grönt!',
      racing: 'Lopp pågår',
      finished: 'Mål — The Beast vinner',
    },
    simulatorCompare: {
      camaro: 'The Beast · 5.74s',
      f1: 'Formel 1',
      jet: 'Passagerarflygplan',
    },
  },
  journey: {
    title: 'Anders resa',
    intro:
      'Från vibrationen i ett mini-mopedstyre i Hudiksvall till Europatoppen — byggd i eget garage, inte köpt färdig.',
    beatChildhood: 'Början',
    beatTurning: 'Vändpunkten',
    beatPhilosophy: 'Filosofin',
    quote1:
      'Jag minns fortfarande känslan när motorn startade och vibrationerna gick genom styret. Den känslan har aldrig lämnat mig.',
    quote1Attr: 'Anders Edh',
    turningPoint:
      'Som 16-åring köpte Anders sin första Chevrolet Camaro (1971) för 14 800 kr. Men det var på nyårsafton 2004 som dragracing-ödet beseglades — ett spontant eBay-köp av en 1970 Camaro från New Jersey som förändrade allt.',
    philosophy:
      'Anders skiljer sig från många konkurrenter genom att han gör allt själv. Istället för att köpa ett färdigt chassi från USA bygger, utvecklar och tunar han bilarna i det egna garaget i Hudiksvall.',
    quote2:
      'Vem som helst kan ta reda på informationen – svårigheten är att veta vad man ska ta reda på.',
    quote2Attr: 'Anders Edh',
    timelineTitle: 'Den verifierade tidslinjen',
    timeline: {
      '1970s-first-camaro':
        'Köper sin första Camaro (1971) för 14 800 kr som 16-åring.',
      '2004-ebay': 'Spontanköp av 1970 Camaro på eBay på nyårsafton.',
      '2005-license':
        'Introduceras till dragracing av Kjell-Åke Kring (Norrbo) och tar licens i Söderhamn. Mekanikern Martin Ekstedt dyker upp i garaget.',
      '2006-10s': 'Kör 10,0 sekunder på 402 meter (kvartsmilen).',
      '2010-nitrous': 'Når 7,8 sekunder på 402 meter med en lustgasmotor.',
      '2013-chassis':
        'River bilen helt och bygger rörchassi från grunden. Gatubilen är nu en ren tävlingsmaskin.',
      '2016-680':
        'Presterar 6,80 sekunder på 402 meter. Anders står vid ett vägskäl och överväger att sälja allt.',
      '2016-2017-blower':
        'Byter till en kompressormotor (Chevrolet), vilket inleder en helt ny era av framgång.',
      '2017-edrs6':
        'Kör 4,15 sekunder på 201 meter nästan direkt. Slutar på 6:e plats i European Drag Racing Series.',
      '2018-runnerup':
        'Blir Runner Up (2:a) i nordeuropeiska Summit Racing EDRS Series i Top Doorslammer.',
      '2019-champion':
        'Vinner Top Doorslammer-serien i Norden och tar 1:a plats i European Drag Racing Series (EDRS).',
      '2021-record':
        'Sista säsongen med plåtbilen. Sätter ett historiskt plåtbilsrekord i Europa på 3,89 sekunder på 201 meter.',
      '2023-beast':
        'Bygger en helt ny Camaro med kolfiberkaross, BAE 521-motor och MB-chassi.',
      '2024-santapod':
        'Det globala genombrottet på Santa Pod i England. Kör ett spektakulärt personbästa på 5,74 sekunder @ 415 km/h.',
      '2025-podium':
        'Rekryterar Andreas Gröning till teamet. Slutar på en stark 3:e plats totalt i Top Doorslammer European Drag Racing Series.',
      '2026-season':
        'Inleder säsongen med vinst i första tävlingen på Santa Pod. Sätter 3,87 sekunder på asfaltsbana i Hudiksvall efter intensivt precisionsarbete med fyrlänk och viktbalans.',
    },
  },
  machine: {
    title: 'Maskinen',
    intro:
      'Djupgående teknisk information om Chevrolet Camaro "The Beast" – teamets tekniska excellens för teknikentusiaster och ingenjörsfokuserade sponsorer.',
    chassisTitle: 'Interaktivt chassi',
    chassisBody:
      'Klicka på de pulserande punkterna för att läsa om The Beasts anatomi — BAE 521, PSI-kompressor, MB-chassi och 4-link.',
    chassisHint: 'Peka för lätt 3D-tilt · klicka hotspot',
    turntableHint: 'Dra eller välj vinkel',
    turntableLabel: 'Utforska The Beast — dra, använd piltangenterna eller välj en vinkel',
    specsTitle: 'Tekniska specifikationer',
    narrativeTitle: 'Kuriosa & krafter',
    extremeForcesTitle: 'Extrema krafter',
    extremeForces:
      'Bromsskärmarna som fälls ut vid målgång måste tåla enorma påfrestningar för att bromsa ekipaget från 415 km/h. Vid det historiska rekordåket på Santa Pod utvecklades så mycket kraft att skärmarna lyfte bilens bakvagn från marken.',
    speedCompareTitle: 'Snabbare än startande flygplan',
    speedCompare:
      'Vid 415 km/h färdas Anders snabbare än de flesta kommersiella passagerarflygplan under start — omkring 290 km/h.',
    logisticsTitle: 'Logistiken',
    logistics:
      'Att transportera och tävla med denna maskin genom Europa kräver enorm logistik — enbart färja och frakt till England kostar över 30 000 SEK per resa.',
    compareCamaro: 'The Beast',
    compareJet: 'Passagerarflygplan (start)',
    hotspots: {
      engine: {
        title: 'BAE 521 Hemi-motor',
        body: '8,5-liters kompressormaskin matad med metanol som levererar runt 2 500–3 000 hästkrafter.',
      },
      compressor: {
        title: 'PSI Skruvkompressor',
        body: 'Ger ett konstant, brutalt tryck till motorn.',
      },
      chassis: {
        title: 'Mats Brag (MB) Chassi',
        body: 'Rörchassi i krommolybdenstål.',
      },
      fourLink: {
        title: 'MB 4-Link',
        body: 'Den ställbara bakhjulsupphängningen som kontrollerar chassits vinkel och planterar kraften i asfalten.',
      },
    },
    specLabels: {
      model: 'Modell',
      class: 'Klass',
      body: 'Kaross',
      engine: 'Motor',
      displacement: 'Slagvolym',
      power: 'Effekt',
      transmission: 'Växellåda',
      crankshaft: 'Vevaxel',
      fuel: 'Bränsle',
      weight: 'Vikt',
    },
  },
  results: {
    title: 'Tävlingar & resultat',
    standingsTitle: 'Mästerskapsmeriter — EDRS Top Doorslammer',
    bestTimesTitle: 'Historiska prestanda (201 m / 660 ft)',
    calendarTitle: 'SM-kalendern 2026',
    nextStart: 'Nästa start',
    highlightBest: 'Bästa ET',
    highlightLatest: 'Senaste',
    colYear: 'År',
    colEvent: 'Tävling / Event',
    colTime: 'Tid',
    colSpeed: 'Sluthastighet',
    colPlace: 'Placering',
    round: 'Deltävling',
    final: 'Final',
  },
  team: {
    title: 'Teamet',
    intro:
      'Hundradelar avgörs i depån. Crewet bygger precisionen — familj och stöd håller laget rullande genom Europa.',
    crewTitle: 'Nyckelpersoner i depån',
    supportTitle: 'Stöd & familj',
    members: {
      anders: {
        role: 'Förare & teamägare',
        bio: 'Grundare och den drivande kraften som styr och leder hela teamet.',
      },
      martin: {
        role: 'Mekaniker',
        bio: 'Teamets ryggrad som har varit med i garaget sedan 2005 (och tävlat sedan 2007). Oerhört detaljfokuserad och ser till att allt fungerar vid startlinjen.',
      },
      andreas: {
        role: 'Mekaniker',
        bio: 'Rekryterades inför säsongen 2025. Har snabbt utvecklats till en ovärderlig tillgång med sin tekniska snabbhet.',
      },
      john: {
        role: 'Mekaniker',
        bio: '"Vår allas glada John", anslöt till teamet 2024 och har med sin breda kunskap bidragit starkt till teamets tekniska utveckling.',
      },
      olle: {
        role: 'Teknisk rådgivare',
        bio: 'Anders bror. Brinner för motorsport och har med sin djupa tekniska kompetens bidragit med geniala idéer och lösningar genom alla år.',
      },
      marie: {
        role: 'Logistikchef',
        bio: 'Anders sambo och teamets stöttepelare. Ansvarar för mat, logistik och ser till att allt i depån flyter sömlöst under tävlingshelgerna.',
      },
      amanda: {
        role: 'Media & PR',
        bio: 'Anders dotter. Ansvarar för sociala medier, webbplatsen och marknadsföringen för att öka teamets synlighet.',
      },
      siggi: {
        role: 'Dokumentärfilmare',
        bio: 'Följer teamet tätt för att föreviga resan och producera professionellt videomaterial.',
      },
    },
  },
  media: {
    title: 'Media',
    intro:
      'Navet är The Miracle Run — Santa Pod 5.74s @ 415 km/h — sedan burnout, launch, depå och arkiv.',
    items: {
      miracle: {
        title: 'The Miracle Run',
        caption:
          'Det historiska rekordåket på Santa Pod — 5.74s @ 415 km/h med däckrök och rå kraft.',
      },
      burnout: {
        title: 'Burnout Santa Pod',
        caption:
          'The Beast värmer slicks framför Santa Pod Raceway — vit rök, blå lack, Europatopp.',
      },
      launch: {
        title: 'Launch · Tierp',
        caption:
          'Däckskak i launch — Anders Edh och The Beast planterar kraften i asfalten.',
      },
      pits: {
        title: 'Depåprecision',
        caption:
          'EDH Racing-crewet justerar fallskärmssystemet — hundradelar avgörs innan start.',
      },
      staging: {
        title: 'Staging',
        caption:
          'Sista checken vid bilen — crew i EDH-hoodie, förare i buren, startlinjen väntar.',
      },
      archive: {
        title: 'Helsinge Open 2009',
        caption:
          'Anders på startlinjen i Helsinge Open 2009 med sin tidigare plåtbil.',
      },
    },
  },
  contact: {
    title: 'Sponsorer & kontakt',
    pitchLead: 'Mer än en logotyp på en bil.',
    pitch:
      'Ett partnerskap med EDH Racing syns på Europas snabbaste arenor och förknippas med skandinavisk spetskompetens — densamma som bygger The Beast i garaget i Hudiksvall.',
    valuesTitle: 'Vad ni får',
    values: {
      exposure: {
        title: 'Europatopp-exponering',
        body: 'Hundratusentals fans på plats och via digitala sändningar i Top Doorslammer-eliten.',
      },
      beast: {
        title: 'The Beast i er story',
        body: 'Använd teamet och Camaron i egen marknadsföring, kundevent eller interna föreläsningar.',
      },
      precision: {
        title: 'Precision under press',
        body: 'Associera ert varumärke med extrem ingenjörskonst, uthållighet och samarbete när hundradelar avgör.',
      },
    },
    formTitle: 'Intresseanmälan',
    name: 'Namn',
    company: 'Företag',
    email: 'E-post',
    phone: 'Telefon',
    message: 'Meddelande',
    interest: 'Intresseområde',
    interestOptions: {
      main: 'Huvudsponsor',
      gold: 'Guldpartner',
      silver: 'Silverpartner',
      material: 'Materialpartner',
    },
    submit: 'Skicka via e-post',
    mailtoSubject: 'Intresseanmälan — EDH Racing partnerskap',
  },
}
