import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Options = {
  /** Image or video inside the trigger. */
  media?: string
  /** Copy block that rises with the media. */
  copy?: string
  /** When set, each matching child gets its own scrub instead of the root. */
  items?: string
}

/**
 * Scroll-scrubbed scale/fade for Home plates. Enter from 0.92 / 0.55,
 * settle at 1 / 1. Exit recedes slightly. Transform + opacity only.
 */
export function useCinematicMedia(
  root: { readonly current: HTMLElement | null },
  { media = 'img', copy, items }: Options = {},
) {
  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const triggers = items
        ? gsap.utils.toArray<HTMLElement>(items, el)
        : [el]

      triggers.forEach((trigger) => {
        const mediaEl = trigger.querySelector(media)
        const copyEl = copy ? trigger.querySelector(copy) : null
        if (!mediaEl && !copyEl) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 92%',
            end: 'bottom top',
            scrub: 0.7,
          },
        })

        if (mediaEl) {
          tl.fromTo(
            mediaEl,
            { scale: 0.92, opacity: 0.55 },
            { scale: 1, opacity: 1, ease: 'none', duration: 0.42 },
            0,
          ).to(mediaEl, { opacity: 0.45, ease: 'none', duration: 0.28 }, 0.72)
        }

        if (copyEl) {
          tl.fromTo(
            copyEl,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: 'none', duration: 0.38 },
            0.08,
          )
        }
      })
    },
    { scope: root },
  )
}
