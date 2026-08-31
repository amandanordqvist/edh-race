import { team } from '../../data/team'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeTeam.css'

export function HomeTeam() {
  const t = useT()
  const locale = useLocale()
  const members = team.filter((member) => member.group === 'crew' && member.image)

  return (
    <Section className="home-team" wide>
      <Reveal className="home-team__intro">
        <h2 className="home-team__title">{t.home.teamTitle}</h2>
        <p className="home-team__body">{t.home.teamBody}</p>
        <Button to={localePath(locale, 'team')} icon>
          {t.home.teamCta}
        </Button>
      </Reveal>

      <ul className="home-team__roster">
        {members.map((member, index) => {
          const role = t.team.members[member.id]?.role ?? ''
          return (
            <Reveal
              as="li"
              className="home-team__member"
              delay={0.06 * index}
              y={24}
              key={member.id}
            >
              <figure className="home-team__portrait">
                <img
                  src={member.image}
                  alt={member.name}
                  width={640}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <p className="home-team__name">{member.name}</p>
              {role ? <p className="home-team__role">{role}</p> : null}
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
