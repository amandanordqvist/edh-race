import { useCallback, useEffect, useState, type RefObject } from 'react'

/**
 * Expand the Pass Arena to cover the viewport.
 * Prefers the Fullscreen API; falls back to a fixed overlay (iOS).
 */
export function usePassExpand(targetRef: RefObject<HTMLElement | null>) {
  const [expanded, setExpanded] = useState(false)

  const collapse = useCallback(async () => {
    setExpanded(false)
    document.body.style.removeProperty('overflow')
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined)
    }
    window.dispatchEvent(new Event('resize'))
  }, [])

  const toggle = useCallback(async () => {
    if (expanded) {
      await collapse()
      return
    }

    setExpanded(true)
    document.body.style.overflow = 'hidden'
    const node = targetRef.current
    if (node?.requestFullscreen) {
      await node.requestFullscreen().catch(() => undefined)
    }
    window.dispatchEvent(new Event('resize'))
  }, [collapse, expanded, targetRef])

  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement) return
      setExpanded(false)
      document.body.style.removeProperty('overflow')
      window.dispatchEvent(new Event('resize'))
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded && !document.fullscreenElement) {
        void collapse()
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      window.removeEventListener('keydown', onKey)
      document.body.style.removeProperty('overflow')
    }
  }, [collapse, expanded])

  return { expanded, toggle }
}
