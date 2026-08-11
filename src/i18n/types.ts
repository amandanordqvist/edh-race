export type Locale = 'sv' | 'en'

export type NavKey =
  | 'home'
  | 'journey'
  | 'machine'
  | 'pass'
  | 'results'
  | 'team'
  | 'media'
  | 'contact'

export type Dictionary = {
  meta: {
    siteName: string
    tagline: string
  }
  nav: Record<NavKey, string>
  lang: {
    sv: string
    en: string
    switchTo: string
  }
  footer: {
    quickLinks: string
    more: string
    contact: string
    social: string
    rights: string
    ctaTitle: string
    ctaBody: string
  }
  common: {
    comingSoon: string
    readMore: string
    email: string
    phone: string
    location: string
    locationValue: string
  }
  home: {
    brand: string
    headline: string
    heroKicker: string
    heroClass: string
    lead: string
    ctaTeam: string
    ctaMachine: string
    statsTitle: string
    statsLead: string
    stats: {
      quarter: { value: string; label: string }
      topSpeed: { value: string; label: string }
      eighth: { value: string; label: string }
      base: { value: string; label: string }
    }
    driverLabel: string
    driverTitle: string
    driverBody: string
    driverQuote: string
    driverCta: string
    driverAlt: string
    machineLabel: string
    machineTitle: string
    machineBody: string
    machineCta: string
    machineAlt: string
    teamLabel: string
    teamTitle: string
    teamBody: string
    teamQuote: string
    teamCta: string
    teamPhotoAlt: string
    storyLabel: string
    storyTitle: string
    storyBody: string
    storyCta: string
    nextRaceLabel: string
    nextRaceTitle: string
    nextRaceClassLabel: string
    nextRaceClass: string
    nextRaceStatus: string
    nextRaceSeasonDone: string
    nextRaceCta: string
    sponsorsTitle: string
    sponsorsBody: string
    sponsorsBenefits: string[]
    sponsorsCta: string
    passTeaserTitle: string
    passTeaserBody: string
    passTeaserCta: string
    passTeaserAlt: string
    imageFallback: string
  }
  pass: {
    title: string
    lead: string
    stage: string
    again: string
    mute: string
    unmute: string
    webglFallback: string
    continueJourney: string
    status: {
      idle: string
      staging: string
      amber: string
      green: string
      racing: string
      finished: string
    }
    compare: {
      camaro: string
      f1: string
      jet: string
    }
  }
  journey: {
    title: string
    intro: string
    beatChildhood: string
    beatTurning: string
    beatPhilosophy: string
    quote1: string
    quote1Attr: string
    turningPoint: string
    philosophy: string
    quote2: string
    quote2Attr: string
    timelineTitle: string
    chapters: {
      roots: string
      build: string
      elite: string
      record: string
    }
    timeline: Record<string, string>
  }
  machine: {
    title: string
    intro: string
    chassisTitle: string
    chassisBody: string
    chassisHint: string
    turntableHint: string
    turntableLabel: string
    specsTitle: string
    narrativeTitle: string
    extremeForcesTitle: string
    extremeForces: string
    speedCompareTitle: string
    speedCompare: string
    logisticsTitle: string
    logistics: string
    compareCamaro: string
    compareJet: string
    hotspots: {
      engine: { title: string; body: string }
      compressor: { title: string; body: string }
      chassis: { title: string; body: string }
      fourLink: { title: string; body: string }
    }
    specLabels: Record<string, string>
  }
  results: {
    title: string
    heroEt: string
    heroSpeed: string
    heroCaption: string
    heroCta: string
    heroAlt: string
    standingsTitle: string
    standingsLead: string
    bestTimesTitle: string
    bestTimesLead: string
    calendarTitle: string
    nextStart: string
    highlightBest: string
    highlightLatest: string
    colYear: string
    colEvent: string
    colTime: string
    colSpeed: string
    colPlace: string
    round: string
    final: string
  }
  team: {
    title: string
    intro: string
    crewTitle: string
    supportTitle: string
    groupPhotoAlt: string
    members: Record<string, { role: string; bio: string }>
  }
  media: {
    title: string
    intro: string
    feedTitle: string
    feedLead: string
    feedCta: string
    items: Record<string, { title: string; caption: string }>
  }
  contact: {
    title: string
    pitchLead: string
    pitch: string
    proof: string
    valuesTitle: string
    values: {
      exposure: { title: string; body: string }
      beast: { title: string; body: string }
      precision: { title: string; body: string }
    }
    formTitle: string
    formHint: string
    name: string
    company: string
    email: string
    phone: string
    message: string
    interest: string
    interestOptions: {
      main: string
      gold: string
      silver: string
      material: string
    }
    submit: string
    afterSend: string
    mailtoSubject: string
    pitchAlt: string
  }
}
