import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Badge from '../common/Badge'
import Rating from '../common/Rating'
import WishlistButton from '../common/WishlistButton'
import { formatCurrency } from '../../utils/format'

/**
 * Lightweight card for mixed-category shelves (Latest Listings, Premium Listings)
 * where items come from different data sources (cars, properties, electronics...).
 */
export default function MixedListingCard({ item, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Link to={item.detailPath} className="relative block aspect-[4/3] overflow-hidden bg-surface-alt">
        <img src={item.images[0]} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <Badge variant="dark" className="absolute left-3 top-3 bg-black/60 backdrop-blur-sm">
          {item.categoryLabel}
        </Badge>
        <WishlistButton id={item.id} className="absolute right-3 top-3" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={item.detailPath} className="mb-1 line-clamp-1 text-[15px] font-bold text-text hover:text-primary">
          {item.title}
        </Link>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin size={12} className="shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <Rating value={item.rating} size={12} />
        <p className="mt-auto pt-3 text-lg font-extrabold text-text">{formatCurrency(item.price)}</p>
      </div>
    </motion.article>
  )
}
