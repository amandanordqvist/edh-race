import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { team } from '../../data/team'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { useCinematicMedia } from './useCinematicMedia'
import './HomeTeam.css'

export function HomeTeam() {
  const t = useT()
  const locale = useLocale()
  const [photoFailed, setPhotoFailed] = useState(false)
  const members = team.filter((member) => member.group === 'crew')
  const stageRef = useRef<HTMLDivElement>(null)
  useCinematicMedia(stageRef, { media: '.home-team__photo img' })

  return (
    <Section className="home-team" wide>
      <Reveal className="home-team__intro">
        <h2 className="home-team__title">{t.home.teamTitle}</h2>
        <p className="home-team__body">{t.home.teamBody}</p>
      </Reveal>

      <div ref={stageRef} className="home-team__stage">
        <Link
          className="home-team__photo-link"
          to={localePath(locale, 'team')}
          aria-label={t.home.teamCta}
        >
          <figure className="home-team__photo">
            {photoFailed ? (
              <div className="home-team__fallback" role="img" aria-label={t.home.imageFallback}>
                <span>{t.home.imageFallback}</span>
              </div>
            ) : (
              <picture>
                <source srcSet="/images/team2.webp" type="image/webp" />
                <img
                  src="/images/team2.JPG"
                  alt={t.home.teamPhotoAlt}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoFailed(true)}
                />
              </picture>
            )}
          </figure>
        </Link>
        <ul className="home-team__roster">
          {members.map((member) => {
            const role = t.team.members[member.id]?.role ?? ''
            return (
              <li key={member.id}>
                <span className="home-team__name">{member.name}</span>
                {role ? <span className="home-team__role">{role}</span> : null}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
