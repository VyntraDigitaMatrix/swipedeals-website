import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, Camera, Fuel, Gauge, GitCompare, MapPin, Settings2, Share2, TrendingDown, UserCheck } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { useCompare } from '../../hooks/useCompare'
import { getDealerById } from '../../data/dealers'
import { formatCurrency, formatKm } from '../../utils/format'
import { cn } from '../../utils/cn'

const OWNER_LABEL = { 1: '1st Owner', 2: '2nd Owner', 3: '3rd Owner' }

export default function VehicleCard({ car, index = 0 }) {
  const dealer = getDealerById(car.dealerId)
  const { isComparing, toggleCompare } = useCompare()
  const comparing = isComparing(car.id)
  const greatPrice = car.condition === 'used' && car.rating >= 4.8

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift"
    >
      <Link to={`/cars/${car.id}`} className="relative block aspect-[4/3] overflow-hidden bg-surface-alt">
        <img
          src={car.images[0]}
          alt={`${car.year} ${car.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={car.condition === 'new' ? 'success' : 'neutral'} className="bg-white/95">
            {car.condition === 'new' ? 'New' : 'Used'}
          </Badge>
          {car.verified && (
            <Badge variant="info" icon={BadgeCheck} className="bg-white/95">
              Verified
            </Badge>
          )}
          {greatPrice && (
            <Badge variant="success" icon={TrendingDown} className="bg-white/95">
              Great Price
            </Badge>
          )}
        </div>
        <WishlistButton id={car.id} className="absolute right-3 top-3" />

        {car.images.length > 1 && (
          <span className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Camera size={11} aria-hidden="true" />
            {car.images.length}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/cars/${car.id}`} className="line-clamp-1 text-[15px] font-bold text-text hover:text-primary">
          <span className="font-semibold text-text-secondary">{car.year}</span> {car.title}
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin size={12} className="shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{car.location}</span>
        </div>

        <Rating value={car.rating} size={12} className="mt-2" />

        <div className="my-3 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface-alt/60 text-center text-[11px] text-text-secondary">
          <span className="flex flex-col items-center gap-1 px-1 py-2">
            <Gauge size={13} aria-hidden="true" />
            {formatKm(car.km)}
          </span>
          <span className="flex flex-col items-center gap-1 px-1 py-2">
            <Fuel size={13} aria-hidden="true" />
            {car.fuel}
          </span>
          <span className="flex flex-col items-center gap-1 px-1 py-2">
            {car.condition === 'used' ? <UserCheck size={13} aria-hidden="true" /> : <Settings2 size={13} aria-hidden="true" />}
            {car.condition === 'used' ? OWNER_LABEL[car.owners] || `${car.owners}+ Owners` : car.transmission}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-text">{formatCurrency(car.price)}</p>
            <p className="text-[11px] text-text-secondary">EMI from {formatCurrency(car.emi)}/mo</p>
          </div>
          {dealer && (
            <Link
              to={dealer.slug ? `/${dealer.slug}` : '#'}
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-0 items-center gap-1 text-right hover:text-primary"
            >
              <p className="line-clamp-1 max-w-[100px] text-[11px] font-semibold text-text-secondary hover:text-primary">{dealer.name}</p>
              {dealer.verified && <BadgeCheck size={12} className="shrink-0 text-info" aria-hidden="true" />}
            </Link>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(car.id)}
            aria-label="Add to compare"
            aria-pressed={comparing}
            title="Compare"
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
              comparing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary hover:border-primary/40 hover:text-primary'
            )}
          >
            <GitCompare size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Share listing"
            title="Share"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Share2 size={15} aria-hidden="true" />
          </button>
          <Link
            to={`/cars/${car.id}`}
            className="flex-1 rounded-lg bg-gradient-primary px-3 py-2.5 text-center text-xs font-bold text-white shadow-soft transition-transform hover:brightness-110"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
