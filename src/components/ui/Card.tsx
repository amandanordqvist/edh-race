import type { ReactNode } from 'react'
import './Card.css'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}

export function Card({ children, className = '', as: Tag = 'div' }: Props) {
  return (
    <Tag className={`card-shell ${className}`.trim()}>
      <div className="card-shell__core">{children}</div>
    </Tag>
  )
}
