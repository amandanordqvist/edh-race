import { useEffect, useRef, useState } from 'react'
import { SITE } from '../../data/site'
import { useLocale, useT } from '../../i18n'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './FacebookFeed.css'

const FEED_HEIGHT = 720
const HOME_FEED_HEIGHT = 560

type FacebookFeedProps = {
  variant?: 'media' | 'home'
}

function feedCopy(variant: 'media' | 'home', t: ReturnType<typeof useT>) {
  switch (variant) {
    case 'home':
      return {
        title: t.home.facebookTitle,
        lead: t.home.facebookBody,
        cta: t.home.facebookCta,
        label: t.home.facebookLabel,
        height: HOME_FEED_HEIGHT,
        button: 'primary' as const,
      }
    case 'media':
      return {
        title: t.media.feedTitle,
        lead: t.media.feedLead,
        cta: t.media.feedCta,
        label: null,
        height: FEED_HEIGHT,
        button: 'ghost' as const,
      }
    default: {
      const exhaustive: never = variant
      return exhaustive
    }
  }
}

export function FacebookFeed({ variant = 'media' }: FacebookFeedProps) {
  const t = useT()
  const locale = useLocale()
  const shellRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(500)
  const copy = feedCopy(variant, t)
  const height = copy.height

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const sync = () => {
      const next = Math.min(500, Math.max(280, Math.floor(shell.clientWidth)))
      setWidth(next)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  const fbLocale = locale === 'sv' ? 'sv_SE' : 'en_US'
  const href = encodeURIComponent(SITE.social.facebook)
  const src =
    `https://www.facebook.com/plugins/page.php?href=${href}` +
    `&tabs=timeline&width=${width}&height=${height}` +
    `&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false` +
    `&locale=${fbLocale}`

  return (
    <Section wide className={`fb-feed${variant === 'home' ? ' fb-feed--home' : ''}`}>
      <Reveal className="fb-feed__intro">
        {copy.label ? <p className="fb-feed__label">{copy.label}</p> : null}
        <h2 className="fb-feed__title">{copy.title}</h2>
        <p className="fb-feed__lead">{copy.lead}</p>
        <Button href={SITE.social.facebook} variant={copy.button} icon>
          {copy.cta}
        </Button>
      </Reveal>

      <Reveal className="fb-feed__frame" delay={0.08} y={28}>
        <div ref={shellRef} className="fb-feed__shell">
          <iframe
            key={`${fbLocale}-${width}-${height}`}
            title={copy.title}
            src={src}
            width={width}
            height={height}
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            allow="encrypted-media; clipboard-write; web-share"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </Reveal>
    </Section>
  )
}
