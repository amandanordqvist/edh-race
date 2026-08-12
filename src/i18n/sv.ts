import type { Dictionary } from './types'

export const sv: Dictionary = {
  meta: {
    siteName: 'EDH Racing',
    tagline: 'Top Doorslammer team från Hudiksvall',
  },
  nav: {
    home: 'Hem',
    journey: 'Resan',
    machine: 'Maskinen',
    pass: 'Passet',
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
    quickLinks: 'Primärt',
    more: 'Mer',
    contact: 'Kontakt',
    social: 'Sociala medier',
    rights: '© EDH Racing. Alla rättigheter förbehållna.',
    ctaTitle: 'Efter passet',
    ctaBody:
      'Vill du bygga nästa kapitel tillsammans med oss? Hör av er.',
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
    headline: '5,74 sekunder. Ett helt team bakom varje hundradel.',
    heroKicker: 'Svensk Top Doorslammer',
    heroClass: 'Top Doorslammer',
    lead: 'Edh Racing från Hudiksvall tävlar med en av Sveriges snabbaste doorslammers. Följ teamet, bilen och jakten på nästa rekord.',
    ctaTeam: 'Möt teamet',
    ctaMachine: 'Upptäck bilen',
    statsTitle: '5,74 sekunder. 415 km/h.',
    statsLead: 'Snabbaste repan över en kvarts mile. Tiderna som står på tavlan.',
    statsMeta: 'Santa Pod · kvarts mile',
    stats: {
      quarter: { code: 'ET', value: '5.74', unit: 's', label: '402 m' },
      topSpeed: { code: 'SPEED', value: '415', unit: 'km/h', label: 'Toppfart' },
      eighth: { code: '1/8', value: '3.80', unit: 's', label: 'Åttondels mile' },
      base: { code: 'CLASS', value: 'TDS', unit: '', label: 'Top Doorslammer' },
    },
    driverLabel: 'Föraren',
    driverTitle: 'Anders Edh',
    driverBody:
      'Anders Edh bygger, finjusterar och kör från samma garage i Hudiksvall. Tiderna får tala.',
    driverQuote: '',
    driverCta: 'Hela resan',
    driverAlt: 'Anders Edh stående i racingoverall',
    machineLabel: 'Bilen',
    machineTitle: 'The Beast',
    machineBody:
      'Chevrolet Camaro med rörchassi, Five Star-kaross och BAE Hemi. Byggd för Top Doorslammer — synlig i varje detalj.',
    machineCta: 'Tekniken bakom',
    machineAlt: 'EDH Racing Chevrolet Camaro i mörk miljö',
    teamLabel: 'Teamet',
    teamTitle: 'Inte en ensam förare',
    teamBody:
      'Varje pass börjar långt innan Anders sätter sig bakom ratten. Crew, logistik och familj håller bilen på banan.',
    teamQuote:
      'Bilen syns mest. Men varje repa börjar långt innan Anders sätter sig bakom ratten.',
    teamCta: 'Hela teamet',
    teamPhotoAlt: 'EDH Racing-teamet i depån',
    storyLabel: 'Historien',
    storyTitle: 'Sedan tystnaden',
    storyBody:
      'Paus. Omstart. Ny Camaro. Tillbaka till startlinjen — och 5,74 på Santa Pod. Comebacken är lika viktig som rekordet.',
    storyCta: 'Följ tidslinjen',
    nextRaceLabel: 'Säsongen',
    nextRaceTitle: 'Nästa start',
    nextRaceClassLabel: 'Klass',
    nextRaceClass: 'Top Doorslammer',
    nextRaceStatus: 'Kommande',
    nextRaceSeasonDone: 'Säsongens starter är körda. Följ resultaten och nästa kapitel.',
    nextRaceCta: 'Hela kalendern',
    sponsorsTitle: 'Bygg nästa kapitel tillsammans med oss',
    sponsorsBody:
      'Edh Racing tävlar inför en engagerad publik i Sverige och Storbritannien. Som partner blir ert varumärke en del av bilen, teamet, tävlingarna och berättelsen runt varje pass.',
    sponsorsBenefits: [
      'Synlighet på bilen',
      'Synlighet på teamkläder',
      'Innehåll för sociala medier',
      'Företagsbesök och event',
      'Biljetter och upplevelser på tävling',
      'Exponering på webb och film',
    ],
    sponsorsCta: 'Hör av er',
    passTeaserTitle: 'Passet',
    passTeaserBody:
      'Se den live jämförelsen: 5.74 sekunder över 402 meter mot Formel 1 och ett passagerarflygplan.',
    passTeaserCta: 'Öppna passet',
    passTeaserAlt: 'Santa Pod Raceway dragbana i skymning',
    imageFallback: 'Bilden kunde inte laddas',
  },
  pass: {
    title: 'Passet',
    lead:
      'Välj motståndare. Stagea bilen. Vänta på grönt. Se 5.74 sekunder i en tvåfils jämförelse över 402 meter.',
    stage: 'Stagea bilen',
    again: 'Kör igen',
    mute: 'Stäng av ljud',
    unmute: 'Slå på ljud',
    followCar: 'Följ bilen',
    zoomOut: 'Zooma ut',
    loading: 'Laddar Pass Arena…',
    modelCredit: '3D-bil: Camaro-scan (Tripo3D)',
    modelCreditHref: 'https://tripo3d.ai',
    webglFallback:
      'Din enhet kunde inte visa den interaktiva jämförelsen. Tiderna nedan visar ändå hur snabbt passet är över 402 meter.',
    continueJourney: 'Fortsätt resan',
    openTimeslip: 'Öppna tidkortet',
    closeTimeslip: 'Stäng tidkortet',
    readTimeslip: 'Läs tidkortet — förstå siffrorna',
    pickOpponent: 'Racea mot',
    status: {
      idle: 'Välj motståndare — snurra bilen — stagea',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Grönt!',
      racing: 'Lopp pågår',
      finished: 'Mål. The Beast först.',
    },
    compare: {
      camaro: 'The Beast',
      f1: 'Formel 1',
      jet: 'Passagerarflyg',
    },
    compareMeaning: {
      camaro:
        'Verkligt Doorslammers-pass från stillastående: 5,75 s och cirka 415 km/h över 402 m.',
      f1:
        'Ungefärlig tid för en F1-bil från stillastående över samma 402 m. Långsammare hook vid 60′ — bilen är byggd för banvarv, inte dragstart.',
      jet:
        'Ungefärlig tid för ett passagerarflygplan från stillastående. Nästan stilla vid 60′; jetmotorer bygger fart långsamt från marken.',
    },
    timeslipTitle: 'Timeslip',
    timeslipDistance: '402 m · 1320 ft · quarter mile',
    timeslipPlace: 'Plats',
    timeslipEvent: 'Doorslammers · 19 maj 2024 · E2',
    timeslipGuide: 'Så läser du tidkortet — varje rad är en mätpunkt längs banan.',
    timeslipCompareTitle: 'Varför F1 och flygplanet?',
    timeslipCompareLead:
      'Det här är ingen riktig race mellan fordonen. Det är en pedagogisk jämförelse: samma sträcka (402 m), från stillastående, en rival i andra filen. Poängen är att visa hur extrem acceleration ett doorslammer-pass är.',
    primerLead:
      'EDH tävlar oftast 201 m i European Drag Racing Series. Här kör du ett kvarts-mile-pass (402 m) från Santa Pod — hela accelerationen, från noll till 415 km/h.',
    inspectHint: 'Dra för att snurra bilen · scrolla för att zooma',
    context201: {
      title: '201 m vs 402 m — två olika måttstockar',
      body:
        'I Norden och EDRS räknas serietider på 201 meter (660 ft). Kvarts mile (402 m) är den klassiska distansen — och den som gav rekordtempot på Santa Pod. Samma pass, samma bil — men olika distans ger olika siffror.',
      edrsStat: 'Vid 201 m på detta pass: 3,83 s · 326 km/h — EDH:s vanliga tävlingsdistans.',
      quarterStat: 'Vid 402 m (mål): 5,75 s · 415 km/h — kvarts-mile-referensen.',
    },
    sportWhy: {
      title: 'Varför siffrorna betyder något',
      body:
        'Drag racing handlar om acceleration under kontroll — inte bara toppfart. Varje hundradel på tidkortet är garagearbete: grepp, motor, chassi och setup. I Top Doorslammer är 201 m seriens måttstock; kvarts mile sätter bilen i ett världssammanhang. Därför jagar teamen båda — men det är samma hantverk bakom.',
    },
    anchorsTitle: 'Så kan man tänka',
    anchors: {
      distance: '402 m ≈ en fotbollsplan plus straffområden i längd.',
      time: '5,75 s — kortare än ett djupt andetag (~4–6 s).',
      speed: '415 km/h — snabbare än regionaltåg i full fart.',
      trap: 'Trap speed = farten i mål, inte medelhastighet. Bilen är som snabbast precis innan bromsarna.',
    },
    splitCallouts: {
      sixty: '60′ · ~18 m · launch och grepp avgörs här',
      threeThirty: '330′ · ~100 m · redan snabbare än de flesta bilar någonsin kör',
      eighth: '660′ · 201 m · EDH:s vanliga distans · 326 km/h',
      thousand: '1000′ · ~305 m · sista accelerationen mot kvarts-mile-mål',
      quarter: '1320′ · 402 m · Santa Pod-tempo · 415 km/h',
    },
    racingHud: {
      reaction: 'Reaktionstid',
      elapsed: 'Elapsed time',
      speedUnit: 'km/h',
      rpmUnit: 'RPM',
      tireLabel: 'Slick',
    },
    timeslipSplits: {
      reaction: {
        label: 'Reaction',
        meaning: 'Tid från grönt ljus till bilen rör sig. Snabbare reaktion = bättre start.',
      },
      sixty: {
        label: '60′ ET',
        meaning: 'Tid till 60 fot (~18 m). Visar hur bra greppet och starten är.',
      },
      threeThirty: {
        label: '330′ ET',
        meaning: 'Tid till 330 fot (~100 m). Mäter hur bilen drar efter starten.',
      },
      eighth: {
        label: '1/8 ET',
        meaning:
          '660 ft = 201 m — EDH:s vanliga tävlingsdistans i EDRS. På detta pass: 3,83 s och 326 km/h. Halvvägs på en kvarts mile.',
      },
      thousand: {
        label: '1000′ ET',
        meaning: 'Tid och fart vid 1000 fot (~305 m), strax innan mål.',
      },
      quarter: {
        label: '1320′ ET',
        meaning: 'Sluttiden över hela kvarts milen (402 m) — den siffra som står på tavlan.',
      },
      trapMph: {
        label: '1320′ MPH',
        meaning: 'Farten i mål (trap speed). 258 mph ≈ 415 km/h.',
      },
    },
  },
  journey: {
    title: 'Från ett spontanköp till ett rekord',
    intro:
      'Från vibrationen i ett mini-mopedstyre i Hudiksvall till startlinjen i Europa. Fortfarande samma garage. Fortfarande samma nyfikenhet.',
    beatChildhood: 'Början',
    beatPhilosophy: 'Filosofin',
    quote1:
      'Jag minns fortfarande känslan när motorn startade och vibrationerna gick genom styret. Den känslan har aldrig lämnat mig.',
    quote1Attr: 'Anders Edh',
    philosophy:
      'Anders köper inte färdiga lösningar. Han bygger, utvecklar och tunar i garaget i Hudiksvall, och gräver i detaljer som andra ofta hoppar över.',
    quote2:
      'Vem som helst kan ta reda på informationen. Svårigheten är att veta vad man ska ta reda på.',
    quote2Attr: 'Anders Edh',
    heroAlt: 'Anders Edh i depån vid sin blå Camaro',
    spineLabel: 'Kapitel i resan',
    crossroadsLabel: 'Vägskälet',
    chapters: {
      roots: 'Rötter',
      build: 'Bygget',
      elite: 'Banorna',
      record: 'Rekord',
    },
    timeline: {
      '1970s-first-camaro':
        'Köper sin första Camaro (1971) för 14 800 kr som 16-åring.',
      '2004-ebay':
        'Spontanköp av en 1970 Camaro från New Jersey på eBay på nyårsafton.',
      '2005-license':
        'Introduceras till dragracing av Kjell-Åke Kring (Norrbo) och tar licens i Söderhamn. Mekanikern Martin Ekstedt dyker upp i garaget.',
      '2006-10s': 'Kör 10,0 sekunder på 402 meter (kvartsmilen).',
      '2010-nitrous': 'Når 7,8 sekunder på 402 meter med en lustgasmotor.',
      '2013-chassis':
        'River bilen helt och bygger rörchassi från grunden. Gatubilen är nu en ren tävlingsmaskin.',
      '2016-680': 'Kör 6,80 sekunder på 402 meter.',
      '2016-crossroads': 'Står vid ett vägskäl och överväger att sälja allt.',
      '2016-2017-blower':
        'Byter till kompressormotor (Chevrolet). En ny riktning.',
      '2017-edrs6':
        'Kör 4,15 sekunder på 201 meter nästan direkt. Slutar på 6:e plats i European Drag Racing Series.',
      '2018-runnerup':
        'Runner Up (2:a) i nordeuropeiska Summit Racing EDRS Series i Top Doorslammer.',
      '2019-champion':
        'Vinner Top Doorslammer-serien i Norden och tar 1:a plats i European Drag Racing Series (EDRS).',
      '2021-record':
        'Sista säsongen med plåtbilen. 3,89 sekunder på 201 meter: då det snabbaste plåtbilsrekordet i Europa.',
      '2023-beast':
        'Bygger en ny Camaro med kolfiberkaross, BAE 521-motor och MB-chassi.',
      '2024-santapod':
        'Santa Pod, England. Personbästa 5,74 sekunder @ 415 km/h.',
      '2025-podium':
        'Andreas Gröning kommer in i teamet. 3:e plats totalt i Top Doorslammer European Drag Racing Series.',
      '2026-season':
        'Vinst i första tävlingen på Santa Pod. 3,87 sekunder på asfaltsbanan i Hudiksvall efter arbete med fyrlänk och viktbalans.',
    },
    marks: {
      '2006-10s': '10,0 s',
      '2010-nitrous': '7,8 s',
      '2016-680': '6,80 s',
      '2017-edrs6': '4,15 s',
      '2018-runnerup': '2:a EDRS',
      '2019-champion': '1:a EDRS',
      '2021-record': '3,89 s',
      '2024-santapod': '5,74 s',
      '2026-season': '3,87 s',
    },
  },
  machine: {
    title: 'Maskinen',
    intro:
      'Chevrolet Camaro The Beast: vad den är byggd av, och hur den fungerar. För den som vill titta under skalet.',
    chassisTitle: 'Interaktivt chassi',
    chassisBody:
      'Klicka på punkterna för att läsa om BAE 521, PSI-kompressor, MB-chassi och 4-link.',
    chassisHint: 'Peka för lätt 3D-tilt · klicka hotspot',
    turntableHint: 'Dra eller välj vinkel',
    turntableLabel: 'Utforska The Beast: dra, använd piltangenterna eller välj en vinkel',
    specsTitle: 'Tekniska specifikationer',
    narrativeTitle: 'Kuriosa & krafter',
    extremeForcesTitle: 'Krafter i chutes',
    extremeForces:
      'Bromsskärmarna som fälls ut vid målgång ska ta ner ekipaget från 415 km/h. På Santa Pod blev kraften så stor att skärmarna lyfte bakvagnen från marken.',
    speedCompareTitle: 'Jämfört med startande flygplan',
    speedCompare:
      'Vid 415 km/h går bilen fortare än många passagerarflygplan under start (runt 290 km/h).',
    logisticsTitle: 'Logistiken',
    logistics:
      'Att ta bilen genom Europa kostar tid och pengar. Enbart färja och frakt till England ligger över 30 000 SEK per resa.',
    compareCamaro: 'The Beast',
    compareJet: 'Passagerarflygplan (start)',
    hotspots: {
      engine: {
        title: 'BAE 521 Hemi-motor',
        body: '8,5-liters kompressormaskin matad med metanol. Ungefär 2 500–3 000 hästkrafter.',
      },
      compressor: {
        title: 'PSI Skruvkompressor',
        body: 'Ger ett jämnt, högt tryck till motorn.',
      },
      chassis: {
        title: 'Mats Brag (MB) Chassi',
        body: 'Rörchassi i krommolybdenstål.',
      },
      fourLink: {
        title: 'MB 4-Link',
        body: 'Ställbar bakhjulsupphängning som styr chassivinkel och hur kraften tar i asfalten.',
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
    heroEt: '5,74 s',
    heroSpeed: '415 km/h',
    heroCaption: 'Snabbaste kvarts mile — Santa Pod.',
    heroCta: 'SM-kalendern',
    heroAlt: 'EDH Racing Camaro på banan vid Santa Pod',
    standingsTitle: 'EDRS Top Doorslammer',
    standingsLead: 'Slutplacering i mästerskapet, säsong för säsong.',
    bestTimesTitle: 'Historiska tider (201 m / 660 ft)',
    bestTimesLead:
      'ET är tiden över 201 meter. Sluthastighet mäts i banans slut.',
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
      'Hundradelar avgörs i depån. Crewet sköter bilen. Familj och stöd håller laget rullande genom Europa.',
    crewTitle: 'Nyckelpersoner i depån',
    supportTitle: 'Stöd & familj',
    groupPhotoAlt: 'EDH Racing-teamet samlat i depån',
    members: {
      anders: {
        role: 'Förare & teamägare',
        bio: 'Bygger, finjusterar och kör. Började med en Camaro och ett garage i Hudiksvall. Vill hellre visa resultatet än prata upp sig själv.',
      },
      martin: {
        role: 'Mekaniker',
        bio: 'I garaget sedan 2005 (tävlar sedan 2007). Håller koll på detaljerna så att bilen fungerar på startlinjen.',
      },
      andreas: {
        role: 'Mekaniker',
        bio: 'Kom in inför säsongen 2025. Extra händer och ögon mellan passen.',
      },
      john: {
        role: 'Mekaniker',
        bio: 'Anslöt 2024. Bred kunskap och gott humör i depån.',
      },
      olle: {
        role: 'Teknisk rådgivare',
        bio: 'Anders bror. Motorsportnörd som bidragit med idéer och lösningar genom åren.',
      },
      marie: {
        role: 'Logistik',
        bio: 'Anders sambo. Mat, logistik och att depån fungerar under tävlingshelger.',
      },
      amanda: {
        role: 'Media & webb',
        bio: 'Anders dotter. Sociala medier, webb och synlighet för teamet.',
      },
      siggi: {
        role: 'Dokumentärfilmare',
        bio: 'Följer teamet och filmar resan.',
      },
    },
  },
  media: {
    title: 'Media',
    intro:
      'Bilder och klipp från banan och depån. Santa Pod 5.74s @ 415 km/h, sedan burnout, launch, depå och arkiv.',
    feedTitle: 'Senaste från Facebook',
    feedLead: 'Uppdateringar från banan, depån och teamet — direkt från EDH Racing.',
    feedCta: 'Öppna på Facebook',
    items: {
      miracle: {
        title: 'The Miracle Run',
        caption: 'Santa Pod: 5.74s @ 415 km/h.',
      },
      burnout: {
        title: 'Burnout Santa Pod',
        caption: 'The Beast värmer slicks framför Santa Pod Raceway.',
      },
      launch: {
        title: 'Launch · Tierp',
        caption: 'Launch på Tierp: däckskak när kraften tar i.',
      },
      pits: {
        title: 'Depån',
        caption: 'Crewet justerar fallskärmssystemet innan start.',
      },
      staging: {
        title: 'Staging',
        caption: 'Sista checken vid bilen. Startlinjen väntar.',
      },
      archive: {
        title: 'Helsinge Open 2009',
        caption: 'Anders på startlinjen 2009 med den tidigare plåtbilen.',
      },
      santapodLane: {
        title: 'Santa Pod',
        caption: 'The Beast på banan under rekordsäsongen.',
      },
      stripNight: {
        title: 'Kväll på banan',
        caption: 'Ljus, rök och väntan mellan passen.',
      },
      burnoutClose: {
        title: 'Burnout',
        caption: 'När slicksen tar eld och greppet byggs.',
      },
      crewMoment: {
        title: 'Mellan passen',
        caption: 'Crewet arbetar när klockan tickar.',
      },
      garageEra: {
        title: 'Garageåren',
        caption: 'Tidigare Camaro — byggd i Hudiksvall.',
      },
      earlyCamaro: {
        title: 'Tidig Camaro',
        caption: 'Rötterna innan Top Doorslammer-eran.',
      },
      recordFrame: {
        title: 'Rekordpasset',
        caption: 'Stillbild från Santa Pod-kampanjen.',
      },
    },
  },
  contact: {
    title: 'Sponsorer & kontakt',
    pitchLead: 'Ett litet team. En bil från garaget.',
    pitch:
      'Vi skryter inte. Vi visar tiderna och bilen. Vill ni stå bredvid ett garagebygge från Hudiksvall som kör 5.74s @ 415 km/h: hör av er.',
    proof: '5.74s · 415 km/h · Santa Pod',
    valuesTitle: 'Vad samarbete kan betyda',
    values: {
      exposure: {
        title: 'Synlighet på banan',
        body: 'Publik och sändningar i Top Doorslammer, utan att vi låtsas vara större än vi är.',
      },
      beast: {
        title: 'Bilen i er story',
        body: 'Camaron och teamet kan användas i er egen kommunikation, om det passar.',
      },
      precision: {
        title: 'Ett ärligt partnerskap',
        body: 'Ni får ett team som jobbar i detaljerna, inte en färdig reklamprodukt.',
      },
    },
    formTitle: 'Intresseanmälan',
    formHint: 'Öppnar din e-postapp med ett färdigt meddelande. Inget konto behövs.',
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
    afterSend: 'Om e-postappen inte öppnades, skriv till adressen i kontaktkortet.',
    mailtoSubject: 'Intresseanmälan: EDH Racing partnerskap',
    pitchAlt: 'EDH Racing partnererbjudande — bil och synlighet',
  },
}
