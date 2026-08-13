import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Reset window scroll on every navigation.
 * Keys off `location.key` (not just pathname) so clicking a footer/nav link
 * to the page you're already on still scrolls back to the top.
 * Uses `behavior: 'instant'` to bypass the global `scroll-behavior: smooth`.
 */
export function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const frame = window.requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView()
          return
        }
        scrollToTop()
      })
      return () => window.cancelAnimationFrame(frame)
    }

    scrollToTop()
  }, [pathname, hash, key])

  return null
}

function scrollToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  } catch {
    window.scrollTo(0, 0)
  }
}
