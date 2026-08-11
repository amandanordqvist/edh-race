import { useEffect, useRef, useState } from 'react'
import { SITE } from '../../data/site'
import { useLocale, useT } from '../../i18n'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './FacebookFeed.css'

const FEED_HEIGHT = 720

export function FacebookFeed() {
  const t = useT()
  const locale = useLocale()
  const shellRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(500)

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
    `&tabs=timeline&width=${width}&height=${FEED_HEIGHT}` +
    `&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false` +
    `&locale=${fbLocale}`

  return (
    <Section wide className="fb-feed">
      <Reveal className="fb-feed__intro">
        <h2 className="fb-feed__title">{t.media.feedTitle}</h2>
        <p className="fb-feed__lead">{t.media.feedLead}</p>
        <Button href={SITE.social.facebook} variant="ghost" icon>
          {t.media.feedCta}
        </Button>
      </Reveal>

      <Reveal className="fb-feed__frame" delay={0.08} y={28}>
        <div ref={shellRef} className="fb-feed__shell">
          <iframe
            key={`${fbLocale}-${width}`}
            title={t.media.feedTitle}
            src={src}
            width={width}
            height={FEED_HEIGHT}
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
