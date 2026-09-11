import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, Gauge, GitCompare, MapPin, Package, Share2 } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { useCompare } from '../../hooks/useCompare'
import { usePublicImages } from '../../hooks/usePublicImages'
import { getDealerById } from '../../data/dealers'
import { vehicleService } from '../../services/publicListingService'
import { formatCurrency, formatKm } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function CommercialVehicleCard({ vehicle, index = 0 }) {
  const dealer = getDealerById(vehicle.dealerId)
  const images = usePublicImages(vehicleService.getImages, vehicle.id, vehicle.images)
  const { isComparing, toggleCompare } = useCompare()
  const comparing = isComparing(vehicle.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Link to={`/commercial-vehicles/${vehicle.id}`} className="relative block aspect-[4/3] overflow-hidden bg-surface-alt">
        <img src={images[0]} alt={vehicle.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge
            variant={vehicle.condition === 'new' ? 'success' : vehicle.condition === 'like-new' ? 'info' : 'neutral'}
            className="bg-white/95"
          >
            {vehicle.condition === 'new' ? 'New' : vehicle.condition === 'like-new' ? 'Like New' : 'Used'}
          </Badge>
          {vehicle.verified && (
            <Badge variant="info" icon={BadgeCheck} className="bg-white/95">
              Verified
            </Badge>
          )}
        </div>
        <WishlistButton id={vehicle.id} className="absolute right-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/commercial-vehicles/${vehicle.id}`} className="mb-1 line-clamp-1 text-[15px] font-bold text-text hover:text-primary">
          {vehicle.title}
        </Link>
        {vehicle.location && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{vehicle.location}</span>
          </div>
        )}
        {vehicle.rating != null && vehicle.rating > 0 && <Rating value={vehicle.rating} size={12} />}

        <div className="my-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary">
          {vehicle.capacity && (
            <span className="flex items-center gap-1">
              <Package size={13} aria-hidden="true" /> {vehicle.capacity}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Gauge size={13} aria-hidden="true" /> {formatKm(vehicle.km ?? vehicle.mileage)}
          </span>
          <Badge variant="neutral">{vehicle.type}</Badge>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-lg font-extrabold text-text">{formatCurrency(vehicle.price)}</p>
            {vehicle.emi != null && <p className="text-[11px] text-text-secondary">EMI from {formatCurrency(vehicle.emi)}/mo</p>}
          </div>
          {(vehicle.sellerName || dealer) && (
            <div className="flex min-w-0 flex-col items-end text-right">
              <div className="flex items-center gap-1">
                <p className="line-clamp-1 max-w-[110px] text-[11px] font-semibold text-text-secondary">
                  {vehicle.sellerName || dealer?.name}
                </p>
                {(vehicle.sellerType === 'ADMIN' || vehicle.sellerType === 'DEALER' || dealer?.verified) && (
                  <BadgeCheck size={12} className="shrink-0 text-info" aria-hidden="true" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(vehicle.id)}
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
            to={`/commercial-vehicles/${vehicle.id}`}
            className="flex-1 rounded-lg bg-gradient-primary px-3 py-2 text-center text-xs font-bold text-white shadow-soft transition-transform hover:brightness-110"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
