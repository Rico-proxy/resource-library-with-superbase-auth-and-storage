import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash, search } = useLocation()

  useEffect(() => {
    if (hash === '#') {
      window.history.replaceState({}, '', `${pathname}${search}`)
    }

    if (hash && hash.length > 1) {
      try {
        const target = document.querySelector(hash)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      } catch {
        // Ignore invalid hash selectors and fallback to top scroll.
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, hash, search])

  return null
}
