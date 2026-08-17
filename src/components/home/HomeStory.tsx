import { useState } from 'react'
import { entryById, type JourneyMedia } from '../../data/timeline'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeStory.css'

const STORY_IDS = [
  '2024-santapod',
  '2023-beast',
  '2016-680',
  '2010-nitrous',
  '2021-record',
  '2018-runnerup',
] as const

export function HomeStory() {
  const t = useT()
  const locale = useLocale()
  const beats = STORY_IDS.map((id) => entryById(id))

  return (
    <Section className="home-story" wide>
      <Reveal className="home-story__intro">
        <p className="home-story__label">{t.home.storyLabel}</p>
        <h2 className="home-story__title">{t.home.storyTitle}</h2>
        <p className="home-story__body">{t.home.storyBody}</p>
      </Reveal>

      <div className="home-story__mosaic">
        {beats.map((beat, index) => (
          <StoryPlate
            key={beat.id}
            size={index === 0 ? 'hero' : index < 3 ? 'mid' : 'small'}
            year={beat.year}
            caption={t.home.storyCaptions[beat.id] ?? ''}
            media={beat.media}
            fallback={t.home.imageFallback}
            eager={index === 0}
          />
        ))}
      </div>

      <Reveal className="home-story__cta" delay={0.06} y={20}>
        <Button to={localePath(locale, 'journey')} icon>
          {t.home.storyCta}
        </Button>
      </Reveal>
    </Section>
  )
}

function StoryPlate({
  size,
  year,
  caption,
  media,
  fallback,
  eager,
}: {
  size: 'hero' | 'mid' | 'small'
  year: string
  caption: string
  media?: JourneyMedia
  fallback: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`home-story__plate home-story__plate--${size}`}>
      {media && !failed ? (
        <img
          className="home-story__img"
          src={media.src}
          srcSet={media.srcSet}
          sizes={
            size === 'hero'
              ? '(min-width: 900px) 70vw, 100vw'
              : size === 'mid'
                ? '(min-width: 900px) 34vw, 100vw'
                : '(min-width: 900px) 22vw, 100vw'
          }
          alt=""
          width={media.width}
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="home-story__fallback">{fallback}</div>
      )}
      {caption ? (
        <figcaption>
          <span className="home-story__year">{year}</span>
          <span className="home-story__caption">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}
