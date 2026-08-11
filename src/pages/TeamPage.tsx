import { TeamGrid } from '../components/team/TeamGrid'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import { useT } from '../i18n'
import './TeamPage.css'

export function TeamPage() {
  const t = useT()

  return (
    <div className="team-page">
      <Section wide className="page-intro team-page__intro">
        <Reveal className="team-page__copy">
          <h1 className="team-page__title">{t.team.title}</h1>
          <p className="team-page__lead">{t.team.intro}</p>
        </Reveal>
        <Reveal className="team-page__photo" as="figure" delay={0.08} y={28} variant="media">
          <div className="team-page__photo-shell">
            <img
              src="/images/team.JPG"
              alt={t.team.groupPhotoAlt}
              width={1600}
              height={1000}
              loading="eager"
              decoding="async"
            />
          </div>
        </Reveal>
      </Section>
      <SkewDivider />
      <TeamGrid />
    </div>
  )
}
