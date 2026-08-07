import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './StoryVisuals.css'

const frames = [
  {
    src: '/images/IMG_1778.JPG',
    label: 'Anders',
    credit: 'Fuelled & Framed',
  },
  {
    src: '/images/camaro-2016old.jpg',
    label: '2016',
    credit: undefined,
  },
  {
    src: '/images/IMG_1860.JPG',
    label: 'Santa Pod',
    credit: 'Julian Hunt / eurodragster.com',
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
            <img src={frame.src} alt={frame.label} loading="lazy" />
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
