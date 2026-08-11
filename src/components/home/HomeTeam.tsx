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
  const crew = team.filter((member) => member.group === 'crew' && member.image).slice(0, 3)
  const marie = team.find((member) => member.id === 'marie')
  const members = marie ? [...crew, marie] : crew

  return (
    <Section className="home-team" wide>
      <Reveal className="home-team__intro">
        <p className="home-team__label">{t.home.teamLabel}</p>
        <h2 className="home-team__title">{t.home.teamTitle}</h2>
        <p className="home-team__body">{t.home.teamBody}</p>
        <blockquote className="home-team__quote">
          <p>{t.home.teamQuote}</p>
        </blockquote>
      </Reveal>

      <Reveal className="home-team__photo" as="figure" delay={0.06} variant="media" y={28}>
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

      <Reveal className="home-team__grid" delay={0.12} stagger={0.08} y={32}>
        {members.map((member) => {
          const copy = t.team.members[member.id]
          return (
            <article className="home-team__card" key={member.id}>
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
              ) : (
                <div className="home-team__avatar home-team__avatar--initials" aria-hidden="true">
                  {member.name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')}
                </div>
              )}
              <div>
                <h3 className="home-team__name">{member.name}</h3>
                <p className="home-team__role">{copy?.role ?? ''}</p>
              </div>
            </article>
          )
        })}
      </Reveal>

      <Reveal className="home-team__cta" delay={0.18}>
        <Button to={localePath(locale, 'team')} icon>
          {t.home.teamCta}
        </Button>
      </Reveal>
    </Section>
  )
}
