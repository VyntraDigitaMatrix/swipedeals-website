import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Bath, BedDouble, BadgeCheck, MapPin, Ruler } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { formatCurrency } from '../../utils/format'

/**
 * Large "hero" property card used to headline the Home page real-estate
 * shelf — full-bleed image, gradient overlay, key stats baked into the
 * visual instead of a plain uniform grid card.
 */
export default function PropertySpotlight({ property }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group relative h-[320px] overflow-hidden rounded-3xl shadow-soft transition-shadow duration-300 hover:shadow-lift sm:h-[420px] lg:h-full"
    >
      <Link to={`/properties/${property.id}`} className="absolute inset-0" aria-label={property.title}>
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />

      <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={property.purpose === 'Rent' ? 'warning' : 'success'} className="bg-white/95">
            For {property.purpose}
          </Badge>
          {property.verified && (
            <Badge variant="info" icon={BadgeCheck} className="bg-white/95">
              RERA Verified
            </Badge>
          )}
        </div>
        <WishlistButton id={property.id} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-accent">{property.type} &middot; Featured</p>
        <Link to={`/properties/${property.id}`}>
          <h3 className="text-xl font-extrabold text-white sm:text-2xl">{property.title}</h3>
        </Link>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
          <MapPin size={14} className="shrink-0" aria-hidden="true" /> {property.location}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/85">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} aria-hidden="true" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={15} aria-hidden="true" /> {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler size={15} aria-hidden="true" /> {property.area.toLocaleString('en-IN')} sqft
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
          <div>
            <p className="text-2xl font-extrabold text-white">
              {formatCurrency(property.price)}
              {property.purpose === 'Rent' && <span className="text-sm font-medium text-white/70">/mo</span>}
            </p>
            <Rating value={property.rating} showValue className="mt-1" />
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-lift transition-transform group-hover:scale-105 sm:text-sm"
          >
            View Details
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
