import { BentoGrid } from '../components/media/BentoGrid'
import { FacebookFeed } from '../components/media/FacebookFeed'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import { useT } from '../i18n'
import './MediaPage.css'

export function MediaPage() {
  const t = useT()

  return (
    <div className="media-page">
      <Section wide className="page-intro media-page__intro">
        <Reveal>
          <h1 className="media-page__title">{t.media.title}</h1>
          <p className="media-page__lead">{t.media.intro}</p>
        </Reveal>
      </Section>
      <BentoGrid />
      <SkewDivider />
      <FacebookFeed />
    </div>
  )
}
