import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE } from '../../data/site'
import { useLocale, useT } from '../../i18n'
import type { Dictionary } from '../../i18n/types'
import { localePath, pageFromSlug, type PageId } from '../../lib/paths'

const PAGE_DESCRIPTION: Record<PageId, (t: ReturnType<typeof useT>) => string> = {
  home: (t) => t.meta.homeDescription,
  journey: (t) => t.journey.intro,
  machine: (t) => t.machine.intro,
  pass: (t) => t.pass.lead,
  results: (t) => t.results.heroCaption,
  team: (t) => t.team.intro,
  media: (t) => t.media.intro,
  contact: (t) => t.contact.pitch,
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  const tag = selector.startsWith('link') ? 'link' : 'meta'
  if (!el) {
    el = document.createElement(tag) as HTMLMetaElement | HTMLLinkElement
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    el?.setAttribute(key, value)
  })
}

function pageTitle(page: PageId, t: Dictionary): string {
  switch (page) {
    case 'home':
      return t.meta.homeTitle
    case 'journey':
      return `${t.journey.title} | ${t.meta.siteName}`
    case 'machine':
      return `${t.machine.title} | ${t.meta.siteName}`
    case 'pass':
      return `${t.pass.title} | ${t.meta.siteName}`
    case 'results':
      return `${t.results.title} | ${t.meta.siteName}`
    case 'team':
      return `${t.team.title} | ${t.meta.siteName}`
    case 'media':
      return `${t.media.title} | ${t.meta.siteName}`
    case 'contact':
      return `${t.contact.title} | ${t.meta.siteName}`
    default: {
      const exhaustive: never = page
      return exhaustive
    }
  }
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id)
  if (!data) {
    existing?.remove()
    return
  }
  const script =
    existing instanceof HTMLScriptElement
      ? existing
      : document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  if (!existing) document.head.appendChild(script)
}

export function Seo() {
  const t = useT()
  const locale = useLocale()
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean)[1]
  const page = pageFromSlug(slug)
  const origin = SITE.origin.replace(/\/$/, '')
  const canonical = `${origin}${localePath(locale, page)}`
  const title = pageTitle(page, t)
  const description = PAGE_DESCRIPTION[page](t)
  const ogImage = `${origin}${SITE.ogImagePath}`
  const svUrl = `${origin}${localePath('sv', page)}`
  const enUrl = `${origin}${localePath('en', page)}`

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    upsertMeta('link[rel="alternate"][hreflang="sv"]', {
      rel: 'alternate',
      hreflang: 'sv',
      href: svUrl,
    })
    upsertMeta('link[rel="alternate"][hreflang="en"]', {
      rel: 'alternate',
      hreflang: 'en',
      href: enUrl,
    })
    upsertMeta('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: svUrl,
    })

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: t.meta.siteName,
    })
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: locale === 'sv' ? 'sv_SE' : 'en_GB',
    })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:image:width"]', {
      property: 'og:image:width',
      content: '1200',
    })
    upsertMeta('meta[property="og:image:height"]', {
      property: 'og:image:height',
      content: '630',
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })

    upsertJsonLd(
      'edh-jsonld-org',
      page === 'home'
        ? {
            '@context': 'https://schema.org',
            '@type': 'SportsOrganization',
            name: t.meta.siteName,
            url: `${origin}/sv`,
            logo: `${origin}${SITE.logoPath}`,
            email: SITE.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: SITE.location.locality,
              addressCountry: SITE.location.country,
            },
            sameAs: [SITE.social.facebook],
          }
        : null,
    )
  }, [canonical, description, enUrl, locale, ogImage, page, svUrl, t, title, origin])

  return null
}
