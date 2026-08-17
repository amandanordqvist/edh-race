import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type CSSProperties, type ReactNode, useRef } from 'react'
import './Reveal.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type RevealPace = 'launch' | 'rise' | 'settle'

const PACE = {
  launch: { y: 24, duration: 0.6, ease: 'power3.out', start: 'top 86%' },
  rise: { y: 40, duration: 0.85, ease: 'power3.out', start: 'top 88%' },
  settle: { y: 20, duration: 0.7, ease: 'power2.out', start: 'top 90%' },
} as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Stagger direct children instead of the wrapper */
  stagger?: number
  /** Media reveal: slight scale instead of only rise */
  variant?: 'rise' | 'media'
  /** Entrance pacing — launch (snappy), rise (default), settle (quiet) */
  pace?: RevealPace
  as?: 'div' | 'li' | 'article' | 'section' | 'figure' | 'ul'
  style?: CSSProperties
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y,
  stagger,
  variant = 'rise',
  pace = 'rise',
  as: Tag = 'div',
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(el, { clearProps: 'opacity,transform', opacity: 1, y: 0, scale: 1 })
        if (stagger) gsap.set(el.children, { clearProps: 'opacity,transform', opacity: 1, y: 0 })
        return
      }

      const preset = PACE[pace]
      const resolvedY = y ?? preset.y
      const duration =
        variant === 'media' ? (pace === 'launch' ? 0.75 : 1.05) : preset.duration

      const ctx = gsap.context(() => {
        const targets = stagger != null ? el.children : el
        const fromVars =
          variant === 'media'
            ? { opacity: 0, scale: 1.06, y: resolvedY * 0.35 }
            : { opacity: 0, y: resolvedY }

        gsap.from(targets, {
          ...fromVars,
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: preset.ease,
          scrollTrigger: {
            trigger: el,
            start: preset.start,
            once: true,
          },
        })
      }, el)

      return () => ctx.revert()
    },
    { dependencies: [delay, y, stagger, variant, pace] },
  )

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  )
}
