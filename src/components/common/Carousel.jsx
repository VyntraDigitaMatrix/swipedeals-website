import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Horizontal snap-scroll carousel. Wraps arbitrary children (cards) in a
 * scroll container with prev/next controls — no external carousel library needed.
 */
export default function Carousel({ children, className, itemClassName = 'w-[280px] sm:w-[320px]' }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {Array.isArray(children) &&
            children.map((child, i) => (
              <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
                {child}
              </div>
            ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface p-2.5 shadow-card transition-transform hover:scale-105 sm:flex"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface p-2.5 shadow-card transition-transform hover:scale-105 sm:flex"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
