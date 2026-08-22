import { team, type TeamMember } from '../../data/team'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SkewDivider } from '../ui/SkewDivider'
import './TeamGrid.css'

function CrewMember({ member, index }: { member: TeamMember; index: number }) {
  const t = useT()
  const copy = t.team.members[member.id]

  return (
    <Reveal as="li" className="team-mechanic" delay={0.06 * index} y={24}>
      {member.image ? (
        <figure className="team-mechanic__media">
          <img
            src={member.image}
            alt={member.name}
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
      <div className="team-mechanic__copy">
        <h3>{member.name}</h3>
        {copy?.role ? <p className="team-mechanic__role">{copy.role}</p> : null}
        {copy?.bio ? <p className="team-mechanic__bio">{copy.bio}</p> : null}
      </div>
    </Reveal>
  )
}

function SupportRow({ member, index }: { member: TeamMember; index: number }) {
  const t = useT()
  const copy = t.team.members[member.id]

  return (
    <Reveal as="li" className="team-support__row" delay={0.05 * index} y={20}>
      <div className="team-support__head">
        <h3>{member.name}</h3>
        {copy?.role ? <p className="team-support__role">{copy.role}</p> : null}
      </div>
      {copy?.bio ? <p className="team-support__bio">{copy.bio}</p> : null}
    </Reveal>
  )
}

export function TeamGrid() {
  const t = useT()
  const crew = team.filter((member) => member.group === 'crew')
  const support = team.filter((member) => member.group === 'support')

  return (
    <div className="team-grid">
      <Section wide className="team-crew">
        <Reveal>
          <h2 className="team-grid__heading">{t.team.crewTitle}</h2>
        </Reveal>
        <ul className="team-crew__layout">
          {crew.map((member, index) => (
            <CrewMember key={member.id} member={member} index={index} />
          ))}
        </ul>
      </Section>

      <SkewDivider />

      <Section wide className="team-support">
        <Reveal>
          <h2 className="team-grid__heading">{t.team.supportTitle}</h2>
        </Reveal>
        <ul className="team-support__list">
          {support.map((member, index) => (
            <SupportRow key={member.id} member={member} index={index} />
          ))}
        </ul>
        <p className="team-grid__memorial">{t.team.memorial}</p>
      </Section>
    </div>
  )
}
