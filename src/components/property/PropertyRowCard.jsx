import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Badge from '../common/Badge'
import { formatCurrency } from '../../utils/format'

/**
 * Compact horizontal property card — used in tight, list-style shelves
 * (e.g. stacked next to a PropertySpotlight) where a full grid card would
 * be too tall.
 */
export default function PropertyRowCard({ property, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-1 items-center gap-4 rounded-2xl border border-border bg-surface p-3 shadow-soft transition-shadow hover:shadow-card sm:p-3.5"
    >
      <Link to={`/properties/${property.id}`} className="relative block h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt sm:h-24 sm:w-28">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">{property.type}</p>
            <Link to={`/properties/${property.id}`} className="line-clamp-1 text-sm font-bold text-text hover:text-primary sm:text-[15px]">
              {property.title}
            </Link>
          </div>
          <Badge variant={property.purpose === 'Rent' ? 'warning' : 'success'} className="shrink-0">
            {property.purpose}
          </Badge>
        </div>

        <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
          <MapPin size={11} className="shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="hidden items-center gap-2.5 text-[11px] text-text-secondary sm:flex">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble size={12} aria-hidden="true" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath size={12} aria-hidden="true" /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler size={12} aria-hidden="true" /> {property.area.toLocaleString('en-IN')} sqft
            </span>
          </div>
          <p className="text-sm font-extrabold text-text sm:text-base">
            {formatCurrency(property.price)}
            {property.purpose === 'Rent' && <span className="text-[11px] font-medium text-text-secondary">/mo</span>}
          </p>
        </div>
      </div>

      <WishlistButton id={property.id} size={15} className="hidden shrink-0 sm:flex" />
    </motion.article>
  )
}
