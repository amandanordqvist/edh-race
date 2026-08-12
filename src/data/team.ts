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
]
