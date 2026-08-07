export type Locale = 'sv' | 'en'

export type NavKey =
  | 'home'
  | 'journey'
  | 'machine'
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
    contact: string
    social: string
    rights: string
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
    tagline: string
    cta: string
    statsTitle: string
    statsLead: string
    stats: {
      quarter: { value: string; label: string }
      topSpeed: { value: string; label: string }
      eighth: { value: string; label: string }
      hp: { value: string; label: string }
    }
    sponsorsTitle: string
    sponsorsBody: string
    simulatorTitle: string
    simulatorBody: string
    simulatorStage: string
    simulatorAgain: string
    simulatorStatus: {
      idle: string
      staging: string
      amber: string
      green: string
      racing: string
      finished: string
    }
    simulatorCompare: {
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
    standingsTitle: string
    bestTimesTitle: string
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
    members: Record<string, { role: string; bio: string }>
  }
  media: {
    title: string
    intro: string
    items: Record<string, { title: string; caption: string }>
  }
  contact: {
    title: string
    pitchLead: string
    pitch: string
    valuesTitle: string
    values: {
      exposure: { title: string; body: string }
      beast: { title: string; body: string }
      precision: { title: string; body: string }
    }
    formTitle: string
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
    mailtoSubject: string
  }
}
