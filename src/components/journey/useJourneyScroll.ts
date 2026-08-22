import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * One scroll-linked motion: the timeslip cursor. Each `[data-beat]` owns one
 * index unit via its own scrubbed tween, so a marked hold (2016) keeps the
 * cursor on the row instead of rushing it. Beat reveals share this hook so
 * there is only one ScrollTrigger context on the page.
 */
export function useJourneyScroll(root: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const cursorEl = gsap.utils.toArray<HTMLElement>('[data-journey-cursor]')[0]
      const list = gsap.utils.toArray<HTMLElement>('.journey-timeslip__rows')[0]
      const anchors = gsap.utils.toArray<HTMLElement>('[data-beat]')
      const rows = gsap.utils.toArray<HTMLElement>('[data-row-index]')

      if (!cursorEl || !list || anchors.length === 0 || rows.length === 0) return

      const last = anchors.length - 1
      const cursor = { index: 0 }

      const applyCursor = (index: number) => {
        const row = rows[0]
        if (!row) return

        const horizontal = window.matchMedia('(max-width: 1099px)').matches
        if (horizontal) {
          const x = index * row.offsetWidth
          gsap.set(cursorEl, { x, y: 0 })
          list.scrollLeft = x - list.clientWidth / 2 + row.offsetWidth / 2
          return
        }

        gsap.set(cursorEl, { y: index * row.offsetHeight, x: 0 })
      }

      applyCursor(0)

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        anchors.forEach((anchor, index) => {
          ScrollTrigger.create({
            trigger: anchor,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
              if (self.isActive) applyCursor(index)
            },
          })
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        anchors.forEach((anchor, index) => {
          const hold = anchor.dataset.hold !== undefined

          gsap.fromTo(
            cursor,
            { index },
            {
              index: index === last ? index : index + 1,
              ease: hold ? holdEase : 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: anchor,
                start: 'top center',
                end: 'bottom center',
                scrub: 0.35,
                invalidateOnRefresh: true,
                onUpdate: () => applyCursor(cursor.index),
              },
            },
          )
        })

        gsap.set(anchors, { opacity: 0, y: 8 })
        ScrollTrigger.batch(anchors, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.06,
              overwrite: true,
            })
          },
        })
      })

      ScrollTrigger.refresh()
    },
    { scope: root },
  )
}

/** Stay on the row for most of the section, then ease into the next. */
function holdEase(progress: number): number {
  if (progress < 0.85) return 0
  return (progress - 0.85) / 0.15
}
