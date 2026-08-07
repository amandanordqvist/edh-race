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
  as?: 'div' | 'li' | 'article' | 'section' | 'figure'
  style?: CSSProperties
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 40,
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
        gsap.set(el, { clearProps: 'opacity,transform', opacity: 1, y: 0 })
        return
      }

      const ctx = gsap.context(() => {
        gsap.from(el, {
          opacity: 0,
          y,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        })
      }, el)

      ScrollTrigger.refresh()

      return () => ctx.revert()
    },
    { dependencies: [delay, y] },
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
