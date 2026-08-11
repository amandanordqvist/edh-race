import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

type SharedProps = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  icon?: boolean
  className?: string
  to?: string
  href?: string
}

type Props = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'>

function ButtonInner({ children, icon }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <span className="btn__label">{children}</span>
      {icon ? (
        <span className="btn__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M11 3H4.5M11 3V9.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </>
  )
}

export function Button({
  children,
  to,
  href,
  variant = 'primary',
  icon = false,
  className = '',
  ...rest
}: Props) {
  const classes = `btn btn--${variant} ${icon ? 'btn--icon' : ''} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes}>
        <ButtonInner icon={icon}>{children}</ButtonInner>
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <ButtonInner icon={icon}>{children}</ButtonInner>
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </button>
  )
}
