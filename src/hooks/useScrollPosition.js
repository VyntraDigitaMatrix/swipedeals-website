import { useEffect, useState } from 'react'

// Returns true once the page has scrolled past `threshold` px — used for
// sticky navbar transparent-on-hero -> solid-on-scroll transitions.
export function useScrollPosition(threshold = 40) {
  const [scrolled, setScrolled] = useState(window.scrollY > threshold)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

export default useScrollPosition
