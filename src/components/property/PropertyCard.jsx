import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, BedDouble, Bath, GitCompare, MapPin, Ruler, Share2 } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { useCompare } from '../../hooks/useCompare'
import { usePublicImages } from '../../hooks/usePublicImages'
import { getDealerById } from '../../data/dealers'
import { propertyService } from '../../services/publicListingService'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function PropertyCard({ property, index = 0 }) {
  const dealer = getDealerById(property.dealerId)
  const images = usePublicImages(propertyService.getImages, property.id, property.images)
  const { isComparing, toggleCompare } = useCompare()
  const comparing = isComparing(property.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Link to={`/properties/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-surface-alt">
        <img
          src={images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={property.purpose === 'Rent' ? 'warning' : 'success'} className="bg-white/95">
            For {property.purpose}
          </Badge>
          {property.verified && (
            <Badge variant="info" icon={BadgeCheck} className="bg-white/95">
              Verified
            </Badge>
          )}
        </div>
        <WishlistButton id={property.id} className="absolute right-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">{property.type}</p>
        <Link to={`/properties/${property.id}`} className="mb-1 line-clamp-1 text-[15px] font-bold text-text hover:text-primary">
          {property.title}
        </Link>
        {property.location && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        )}
        {property.rating != null && property.rating > 0 && <Rating value={property.rating} size={12} className="mb-2" />}

        <div className="my-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} aria-hidden="true" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={13} aria-hidden="true" /> {property.bathrooms} Baths
            </span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1">
              <Ruler size={13} aria-hidden="true" /> {property.area.toLocaleString('en-IN')} {property.areaUnit || 'sqft'}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-lg font-extrabold text-text">
              {formatCurrency(property.price)}
              {property.purpose === 'Rent' && <span className="text-xs font-medium text-text-secondary">/mo</span>}
            </p>
            {(property.sellerName || dealer) && (
              <div className="flex items-center gap-1">
                <p className="line-clamp-1 max-w-[160px] text-[11px] font-semibold text-text-secondary">
                  {property.sellerName || dealer?.name}
                </p>
                {(property.sellerType === 'ADMIN' || property.sellerType === 'DEALER' || dealer?.verified) && (
                  <BadgeCheck size={12} className="shrink-0 text-info" aria-hidden="true" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(property.id)}
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
            to={`/properties/${property.id}`}
            className="flex-1 rounded-lg bg-gradient-primary px-3 py-2 text-center text-xs font-bold text-white shadow-soft transition-transform hover:brightness-110"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
