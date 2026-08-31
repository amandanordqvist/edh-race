import type { MachinePhotoId } from '../data/machine'
import type { TimesSourceId } from '../data/results'
import type { TimelineBookendId, TimelineId } from '../data/timeline'

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
    homeTitle: string
    homeDescription: string
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
    madeBy: string
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
    skipToContent: string
    openMenu: string
    closeMenu: string
  }
  home: {
    brand: string
    headline: string
    heroKicker: string
    lead: string
    ctaPass: string
    ctaJourney: string
    ctaTeam: string
    ctaMachine: string
    statsTitle: string
    statsBestEt: string
    statsBestSpeed: string
    driverLabel: string
    driverTitle: string
    driverBody: string
    driverAlt: string
    machineLabel: string
    machineTitle: string
    machineBody: string
    machineCta: string
    machineAlt: string
    machineSpecs: [string, string, string, string]
    teamLabel: string
    teamTitle: string
    teamBody: string
    teamCta: string
    teamPhotoAlt: string
    storyLabel: string
    storyTitle: string
    storyBody: string
    storyCta: string
    storyCaptions: Record<string, string>
    nextRaceLabel: string
    nextRaceTitle: string
    nextRaceClassLabel: string
    nextRaceClass: string
    nextRaceStatus: string
    nextRaceStatusLabel: string
    nextRaceEmpty: string
    nextRaceCta: string
    nextRaceEventLabel: string
    nextRaceDateLabel: string
    nextRaceTrackLabel: string
    nextRacePlaceLabel: string
    countries: {
      sweden: string
      england: string
    }
    sponsorsLabel: string
    sponsorsTitle: string
    sponsorsBody: string
    sponsorsCta: string
    sponsorsCtaSecondary: string
    facebookLabel: string
    facebookTitle: string
    facebookBody: string
    facebookCta: string
    facebookAlt: string
    passTeaserLabel: string
    passTeaserTitle: string
    passTeaserBody: string
    passTeaserCta: string
    passTeaserAlt: string
    passTeaserFacts: string
    imageFallback: string
  }
  pass: {
    title: string
    lead: string
    viewDriver: string
    viewTrack: string
    startPass: string
    treeCue: {
      preStage: string
      stage: string
      amber: string
      green: string
    }
    compareWith: string
    thatWasThePass: string
    finishVenue: string
    stage: string
    again: string
    mute: string
    unmute: string
    followCar: string
    zoomOut: string
    heroEyebrow: string
    loading: string
    modelCredit: string
    modelCreditHref: string
    webglFallback: string
    continueJourney: string
    openTimeslip: string
    seeTimeslip: string
    closeTimeslip: string
    readTimeslip: string
    gapAhead: string
    gapBehind: string
    reactionHint: string
    launchWait: string
    launchNow: string
    launchKeyHint: string
    yourReaction: string
    reactionFaster: string
    cockpitView: string
    cameraViews: string
    laneBoard: string
    expandTrack: string
    collapseTrack: string
    scrubLabel: string
    explorePass: string
    heroWins: string
    metersLeft: string
    reactionLate: string
    chuteStatus: string
    scrubChute: string
    flyby: {
      highway: string
      autobahn: string
      tgv: string
      hypercar: string
    }
    status: {
      idle: string
      staging: string
      amber: string
      green: string
      racing: string
      finished: string
    }
    compare: {
      none: string
      camaro: string
      f1: string
      jet: string
    }
    compareMeaning: {
      camaro: string
      f1: string
      jet: string
    }
    timeslipTitle: string
    timeslipDistance: string
    timeslipPlace: string
    timeslipEvent: string
    timeslipGuide: string
    timeslipVenue: string
    timeslipDate: string
    timeslipClass: string
    timeslipTeam: string
    timeslipMeters: string
    timeslipCloser: string
    timeslipTrackStart: string
    timeslipTrackFinish: string
    timeslipColTime: string
    timeslipColSpeed: string
    timeslipCompareTitle: string
    timeslipCompareLead: string
    pickOpponent: string
    primerLead: string
    inspectHint: string
    context201: {
      title: string
      body: string
      edrsStat: string
      quarterStat: string
    }
    sportWhy: {
      title: string
      body: string
      bodySecondary?: string
    }
    anchorsTitle: string
    progressMarks: {
      sixty: string
      eighth: string
      quarter: string
      trap: string
    }
    anchors: {
      distance: string
      time: string
      speed: string
      trap: string
    }
    closing: {
      title: string
      body: string
      cta: string
    }
    splitCallouts: {
      sixty: string
      threeThirty: string
      eighth: string
      thousand: string
      quarter: string
      chutes: string
    }
    racingHud: {
      reaction: string
      elapsed: string
      speedUnit: string
      rpmUnit: string
      tireLabel: string
      chutes: string
      trap: string
      win: string
    }
    timeslipSplits: {
      reaction: { label: string; meaning: string; meters: string; note: string }
      sixty: { label: string; meaning: string; meters: string; note: string }
      threeThirty: { label: string; meaning: string; meters: string; note: string }
      eighth: { label: string; meaning: string; meters: string; note: string }
      thousand: { label: string; meaning: string; meters: string; note: string }
      quarter: { label: string; meaning: string; meters: string; note: string }
    }
  }
  journey: {
    title: string
    intro: string
    heroAlt: string
    beatChildhood: string
    beatPhilosophy: string
    quote1: string
    quote1Attr: string
    philosophy: string
    quote2: string
    quote2Attr: string
    /** aria-label for the running timeslip spine. */
    spineLabel: string
    finalRowCaption: string
    /** Keyed by timeline id, so a missing translation is a compile error. */
    timeline: Record<TimelineId, string>
    /** Anders in his own words; only set on the beats that need his voice. */
    quotes: Partial<Record<TimelineId, string>>
    /** Pulled-out headline figure; localised because decimal separators differ. */
    marks: Partial<Record<TimelineId, string>>
    timeslip: {
      /** Eyebrow at the top of the sticky spine. */
      eyebrow: string
      event: string
      distance: string
      /** Column names for the running rows. */
      colYear: string
      colDistance: string
      colEt: string
      colOutcome: string
      /** Screen-reader only labels for outcome badges. */
      outcomeLabels: {
        quiet: string
        race: string
        record: string
        championship: string
        setback: string
        rebuild: string
      }
    }
    bookends: Record<
      TimelineBookendId,
      { label: string; caption: string }
    >
  }
  machine: {
    title: string
    intro: string
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
    photoAlts: Record<MachinePhotoId, string>
    specLabels: Record<string, string>
  }
  results: {
    title: string
    lead: string
    calendarTitle: string
    nextStart: string
    seasonDone: string
    bestTimesTitle: string
    bestTimesLead: string
    highlightBest: string
    highlightLatest: string
    landmarkTitle: string
    landmarkBody: string
    standingsTitle: string
    standingsLead: string
    final: string
    sourcesTitle: string
    sourcesLead: string
    sourceLabels: Record<TimesSourceId, string>
  }
  team: {
    title: string
    intro: string
    crewTitle: string
    supportTitle: string
    memorial: string
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
    headline: string
    headlineBefore: string
    headlineAfter: string
    pitchLead: string
    pitch: string
    proof: string
    ctaPrimary: string
    ctaSecondary: string
    rosterTitle: string
    valuesScrub: string
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
