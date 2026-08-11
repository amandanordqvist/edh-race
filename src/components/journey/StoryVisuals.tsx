import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './StoryVisuals.css'

const frames = [
  {
    src: '/images/journey/2009 - camaro.jpeg',
    label: '2009',
    credit: undefined,
  },
  {
    src: '/images/journey/2016-camaro.jpeg',
    label: '2016',
    credit: undefined,
  },
  {
    src: '/images/journey/2024-santapod4.JPG',
    label: 'Santa Pod',
    credit: undefined,
  },
] as const

export function StoryVisuals() {
  return (
    <Section className="story-visuals" wide>
      <ul className="story-visuals__grid">
        {frames.map((frame, i) => (
          <Reveal
            as="li"
            key={frame.src}
            className={`story-visuals__frame ${i === 2 ? 'story-visuals__frame--lead' : ''}`}
            delay={0.05 * i}
            y={28}
          >
            <div className="story-visuals__shell">
              <img src={frame.src} alt={frame.label} loading="lazy" />
            </div>
            <div className="story-visuals__meta">
              <span>{frame.label}</span>
              {frame.credit ? (
                <span className="story-visuals__credit">{frame.credit}</span>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
