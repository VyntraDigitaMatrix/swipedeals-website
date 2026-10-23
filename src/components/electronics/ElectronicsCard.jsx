import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, GitCompare, MapPin, Share2, Tag as TagIcon } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { useCompare } from '../../hooks/useCompare'
import { usePublicImages } from '../../hooks/usePublicImages'
import { getDealerById } from '../../data/dealers'
import { electronicsService } from '../../services/publicListingService'
import { formatCurrencyFull } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function ElectronicsCard({ item, index = 0 }) {
  const dealer = getDealerById(item.dealerId)
  const images = usePublicImages(electronicsService.getImages, item.id, item.images)
  const { isComparing, toggleCompare } = useCompare()
  const comparing = isComparing(item.id)
  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Link
        to={`/electronics/${item.id}`}
        className="relative block h-64 w-full overflow-hidden bg-surface-alt sm:h-60 lg:h-64"
      >
        <img
          src={images?.[0]}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discount > 0 && (
            <Badge variant="danger" icon={TagIcon} className="bg-white/95">
              {discount}% OFF
            </Badge>
          )}
          {item.verified && (
            <Badge variant="info" icon={BadgeCheck} className="bg-white/95">
              Verified
            </Badge>
          )}
        </div>
        <WishlistButton slug={item.slug ?? item.id} category="electronics" className="absolute right-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">{item.category}</p>
        <Link to={`/electronics/${item.id}`} className="mb-1 line-clamp-1 text-[15px] font-bold text-text hover:text-primary">
          {item.title}
        </Link>
        {item.location && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        )}
        {item.rating != null && <Rating value={item.rating} size={12} />}

        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-extrabold text-text">{formatCurrencyFull(item.price)}</p>
              {item.originalPrice && <p className="text-xs text-text-light line-through">{formatCurrencyFull(item.originalPrice)}</p>}
            </div>
            {dealer && <p className="line-clamp-1 max-w-[140px] text-[11px] font-semibold text-text-secondary">{dealer.name}</p>}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(item.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors',
              comparing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary hover:border-primary/40 hover:text-primary'
            )}
          >
            <GitCompare size={14} aria-hidden="true" />
            Compare
          </button>
          <button
            type="button"
            aria-label="Share listing"
            className="flex items-center justify-center rounded-lg border border-border p-2 text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Share2 size={14} aria-hidden="true" />
          </button>
          <Link
            to={`/electronics/${item.id}`}
            className="flex-1 rounded-lg bg-gradient-primary px-3 py-2 text-center text-xs font-bold text-white shadow-soft transition-transform hover:brightness-110"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
