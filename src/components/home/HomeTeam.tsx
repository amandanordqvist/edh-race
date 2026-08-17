import { useState } from 'react'
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
  const [photoFailed, setPhotoFailed] = useState(false)
  const members = team.filter((member) => member.group === 'crew')

  return (
    <Section className="home-team" wide>
      <Reveal className="home-team__intro">
        <p className="home-team__label">{t.home.teamLabel}</p>
        <h2 className="home-team__title">{t.home.teamTitle}</h2>
        <p className="home-team__body">{t.home.teamBody}</p>
      </Reveal>

      <Reveal className="home-team__photo" as="figure" delay={0.06} variant="media" y={24}>
        {photoFailed ? (
          <div className="home-team__fallback" role="img" aria-label={t.home.imageFallback}>
            <span>{t.home.imageFallback}</span>
          </div>
        ) : (
          <img
            src="/images/team2.JPG"
            alt={t.home.teamPhotoAlt}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            onError={() => setPhotoFailed(true)}
          />
        )}
      </Reveal>

      <Reveal delay={0.1} y={24}>
        <ul className="home-team__grid">
          {members.map((member) => {
            const copy = t.team.members[member.id]
            const role = copy?.role ?? ''
            return (
              <li className="home-team__card" key={member.id}>
                {member.image ? (
                  <img
                    className="home-team__avatar"
                    src={member.image}
                    alt=""
                    width={120}
                    height={120}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div>
                  <h3 className="home-team__name">{member.name}</h3>
                  {role ? <p className="home-team__role">{role}</p> : null}
                </div>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal className="home-team__cta" delay={0.14}>
        <Button to={localePath(locale, 'team')} icon>
          {t.home.teamCta}
        </Button>
      </Reveal>
    </Section>
  )
}
