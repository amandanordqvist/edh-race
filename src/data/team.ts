export type TeamMember = {
  id: string
  name: string
  group: 'crew' | 'support'
  image?: string
  featured?: boolean
}

export const team: TeamMember[] = [
  {
    id: 'anders',
    name: 'Anders Edh',
    group: 'crew',
    image: '/images/team/anders.png',
    featured: true,
  },
  {
    id: 'martin',
    name: 'Martin Ekstedt',
    group: 'crew',
    image: '/images/team/martin.png',
  },
  {
    id: 'andreas',
    name: 'Andreas Gröning',
    group: 'crew',
    image: '/images/team/andreas.png',
  },
  {
    id: 'john',
    name: 'John Claussen',
    group: 'crew',
    image: '/images/team/john.png',
  },
  { id: 'olle', name: 'Olle Edh', group: 'support' },
  { id: 'marie', name: 'Marie Andersson Hållen', group: 'support' },
  { id: 'amanda', name: 'Amanda Nordqvist Ed', group: 'support' },

]
