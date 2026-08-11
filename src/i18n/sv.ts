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
    statsLead: 'Edh Racings snabbaste repa över en kvarts mile — Santa Pod.',
    stats: {
      quarter: { value: '5.74s', label: 'Kvarts mile (402 m)' },
      topSpeed: { value: '415 km/h', label: 'Toppfart kvarts mile' },
      eighth: { value: '3.80s', label: 'Åttondels mile' },
      base: { value: 'Hudiksvall', label: 'Top Doorslammer' },
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
    simulatorTitle: 'Passet',
    simulatorBody:
      'Stagea bilen. Vänta på grönt. Se 5.74 sekunder mot Formel 1 och ett passagerarflygplan över 402 meter.',
    simulatorExplain:
      'På mindre än sex sekunder accelererar bilen från stillastående till över 400 km/h. Förare, team, motor, växellåda och bana måste fungera tillsammans — det finns inget utrymme för nästan.',
    simulatorStage: 'Stagea bilen',
    simulatorAgain: 'Kör igen',
    simulatorStatus: {
      idle: 'Redo att stagea',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Grönt!',
      racing: 'Lopp pågår',
      finished: 'Mål. The Beast först.',
    },
    simulatorCompare: {
      camaro: 'The Beast · 5.74s',
      f1: 'Formel 1',
      jet: 'Passagerarflygplan',
    },
    passTeaserTitle: 'Passet',
    passTeaserBody:
      'Se den live jämförelsen: 5.74 sekunder över 402 meter mot Formel 1 och ett passagerarflygplan.',
    passTeaserCta: 'Öppna passet',
    imageFallback: 'Bilden kunde inte laddas',
  },
  pass: {
    title: 'Passet',
    lead:
      'Stagea bilen. Vänta på grönt. Se 5.74 sekunder mot Formel 1 och ett passagerarflygplan över 402 meter.',
    stage: 'Stagea bilen',
    again: 'Kör igen',
    mute: 'Stäng av ljud',
    unmute: 'Slå på ljud',
    webglFallback:
      'Din enhet kunde inte visa den interaktiva jämförelsen. Tiderna nedan visar ändå hur snabbt passet är över 402 meter.',
    continueJourney: 'Fortsätt resan',
    status: {
      idle: 'Redo att stagea',
      staging: 'Staging…',
      amber: 'Amber',
      green: 'Grönt!',
      racing: 'Lopp pågår',
      finished: 'Mål. The Beast först.',
    },
    compare: {
      camaro: 'The Beast · 5.74s',
      f1: 'Formel 1',
      jet: 'Passagerarflygplan',
    },
  },
  journey: {
    title: 'Resan från ett spontantköp på Ebay till ett rekord på Santa Pod',
    intro:
      'Från vibrationen i ett mini-mopedstyre i Hudiksvall till startlinjen i Europa. Fortfarande samma garage. Fortfarande samma nyfikenhet.',
    beatChildhood: 'Början',
    beatTurning: 'Vändpunkten',
    beatPhilosophy: 'Filosofin',
    quote1:
      'Jag minns fortfarande känslan när motorn startade och vibrationerna gick genom styret. Den känslan har aldrig lämnat mig.',
    quote1Attr: 'Anders Edh',
    turningPoint:
      'Som 16-åring köpte Anders sin första Chevrolet Camaro (1971) för 14 800 kr. På nyårsafton 2004 blev det ett spontant eBay-köp av en 1970 Camaro från New Jersey. Det ändrade riktningen.',
    philosophy:
      'Anders köper inte färdiga lösningar. Han bygger, utvecklar och tunar i garaget i Hudiksvall, och gräver i detaljer som andra ofta hoppar över.',
    quote2:
      'Vem som helst kan ta reda på informationen. Svårigheten är att veta vad man ska ta reda på.',
    quote2Attr: 'Anders Edh',
    timelineTitle: 'Tidslinjen',
    chapters: {
      roots: 'Rötter',
      build: 'Bygget',
      elite: 'Banorna',
      record: 'Rekord',
    },
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
        'Kör 6,80 sekunder på 402 meter. Står vid ett vägskäl och överväger att sälja allt.',
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
