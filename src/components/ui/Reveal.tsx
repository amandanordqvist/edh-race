import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type CSSProperties, type ReactNode, useRef } from 'react'
import './Reveal.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Stagger direct children instead of the wrapper */
  stagger?: number
  /** Media reveal: slight scale instead of only rise */
  variant?: 'rise' | 'media'
  as?: 'div' | 'li' | 'article' | 'section' | 'figure' | 'ul'
  style?: CSSProperties
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 48,
  stagger,
  variant = 'rise',
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

      const ctx = gsap.context(() => {
        const targets = stagger != null ? el.children : el
        const fromVars =
          variant === 'media'
            ? { opacity: 0, scale: 1.06, y: y * 0.35 }
            : { opacity: 0, y }

        gsap.from(targets, {
          ...fromVars,
          duration: variant === 'media' ? 1.05 : 0.85,
          delay,
          stagger: stagger ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      }, el)

      ScrollTrigger.refresh()

      return () => ctx.revert()
    },
    { dependencies: [delay, y, stagger, variant] },
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
