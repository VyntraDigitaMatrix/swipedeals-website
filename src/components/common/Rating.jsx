import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Rating({ value = 0, reviews, size = 14, showValue = true, className }) {
  const stars = [0, 1, 2, 3, 4]

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars.map((i) => {
          const filled = value >= i + 1
          const half = !filled && value > i && value < i + 1
          return (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-border" fill="currentColor" aria-hidden="true" />
              {(filled || half) && (
                <Star
                  size={size}
                  className="absolute inset-0 text-warning"
                  fill="currentColor"
                  style={half ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                  aria-hidden="true"
                />
              )}
            </span>
          )
        })}
      </div>
      {showValue && <span className="text-xs font-semibold text-text">{value.toFixed(1)}</span>}
      {reviews !== undefined && <span className="text-xs text-text-light">({formatReviews(reviews)})</span>}
    </div>
  )
}

function formatReviews(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return n
}
