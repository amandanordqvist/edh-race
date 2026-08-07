import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Story.css'

export function Story() {
  const t = useT()

  return (
    <Section wide className="story page-intro">
      <Reveal>
        <h1 className="story__title">{t.journey.title}</h1>
        <p className="story__lead">{t.journey.intro}</p>
      </Reveal>

      <div className="story__beats">
        <Reveal as="article" className="story__beat story__beat--quote" delay={0.06}>
          <p className="story__beat-label">{t.journey.beatChildhood}</p>
          <blockquote className="story__quote">
            <p>“{t.journey.quote1}”</p>
            <cite>— {t.journey.quote1Attr}</cite>
          </blockquote>
        </Reveal>

        <Reveal as="article" className="story__beat" delay={0.1}>
          <p className="story__beat-label">{t.journey.beatTurning}</p>
          <p className="story__body">{t.journey.turningPoint}</p>
        </Reveal>

        <Reveal as="article" className="story__beat story__beat--philosophy" delay={0.14}>
          <p className="story__beat-label">{t.journey.beatPhilosophy}</p>
          <p className="story__body">{t.journey.philosophy}</p>
          <blockquote className="story__quote story__quote--philosophy">
            <p>“{t.journey.quote2}”</p>
            <cite>— {t.journey.quote2Attr}</cite>
          </blockquote>
        </Reveal>
      </div>
    </Section>
  )
}
