import type { ReactNode } from 'react'
import './Section.css'

type Props = {
  children: ReactNode
  id?: string
  className?: string
  narrow?: boolean
  wide?: boolean
}

export function Section({ children, id, className = '', narrow, wide }: Props) {
  const widthClass = narrow ? 'section--narrow' : wide ? 'section--wide' : ''

  return (
    <section id={id} className={`section ${widthClass} ${className}`.trim()}>
      <div className="section__inner">{children}</div>
    </section>
  )
}
