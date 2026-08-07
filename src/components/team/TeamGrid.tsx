import { team, type TeamMember } from '../../data/team'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SkewDivider } from '../ui/SkewDivider'
import './TeamGrid.css'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

function Portrait({ member }: { member: TeamMember }) {
  if (member.image) {
    return <img src={member.image} alt={member.name} loading="lazy" />
  }

  return (
    <div className="team-portrait__fallback" aria-hidden="true">
      <span>{initials(member.name)}</span>
    </div>
  )
}

function FeaturedCrew({ member }: { member: TeamMember }) {
  const t = useT()
  const copy = t.team.members[member.id]

  return (
    <Reveal as="article" className="team-featured" y={36}>
      <div className="team-featured__shell">
        <div className="team-featured__media">
          <Portrait member={member} />
          <div className="team-featured__wash" aria-hidden="true" />
        </div>
        <div className="team-featured__copy">
          <p className="team-featured__role">{copy?.role}</p>
          <h3 className="team-featured__name">{member.name}</h3>
          <p className="team-featured__bio">{copy?.bio}</p>
        </div>
      </div>
    </Reveal>
  )
}

function CrewCard({ member, index }: { member: TeamMember; index: number }) {
  const t = useT()
  const copy = t.team.members[member.id]

  return (
    <Reveal
      as="li"
      className="team-crew__item"
      delay={0.06 * index}
      y={28}
    >
      <article className="team-crew__card">
        <div className="team-crew__media">
          <Portrait member={member} />
        </div>
        <div className="team-crew__body">
          <h3>{member.name}</h3>
          <p className="team-crew__role">{copy?.role}</p>
          <p className="team-crew__bio">{copy?.bio}</p>
        </div>
      </article>
    </Reveal>
  )
}

function SupportRow({ member, index }: { member: TeamMember; index: number }) {
  const t = useT()
  const copy = t.team.members[member.id]

  return (
    <Reveal
      as="li"
      className="team-support__row"
      delay={0.05 * index}
      y={24}
    >
      <div className="team-support__mark" aria-hidden="true">
        <Portrait member={member} />
      </div>
      <div className="team-support__text">
        <div className="team-support__head">
          <h3>{member.name}</h3>
          <p className="team-support__role">{copy?.role}</p>
        </div>
        <p className="team-support__bio">{copy?.bio}</p>
      </div>
    </Reveal>
  )
}

export function TeamGrid() {
  const t = useT()
  const crew = team.filter((m) => m.group === 'crew')
  const featured = crew.find((m) => m.featured) ?? crew[0]
  const rest = crew.filter((m) => m.id !== featured.id)
  const support = team.filter((m) => m.group === 'support')

  return (
    <div className="team-grid">
      <Section wide className="team-crew">
        <Reveal>
          <h2 className="team-grid__heading">{t.team.crewTitle}</h2>
        </Reveal>

        <FeaturedCrew member={featured} />

        <ul className="team-crew__grid">
          {rest.map((member, i) => (
            <CrewCard key={member.id} member={member} index={i} />
          ))}
        </ul>
      </Section>

      <SkewDivider />

      <Section wide className="team-support">
        <Reveal>
          <h2 className="team-grid__heading">{t.team.supportTitle}</h2>
        </Reveal>
        <ul className="team-support__list">
          {support.map((member, i) => (
            <SupportRow key={member.id} member={member} index={i} />
          ))}
        </ul>
      </Section>
    </div>
  )
}
