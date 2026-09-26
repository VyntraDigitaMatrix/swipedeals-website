import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlist } from '../../hooks/useWishlist'
import { cn } from '../../utils/cn'

/**
 * Heart toggle button for wishlisting a listing.
 *
 * @prop {string} slug      - The listing's unique slug (used by the backend API)
 * @prop {string} category  - Category key: 'vehicles' | 'property' | 'electronics' | 'spare-parts'
 * @prop {string} className - Extra classes for positioning
 * @prop {number} size      - Icon size (default 18)
 *
 * Legacy: if only `id` is passed (old callsites not yet updated), it falls
 * back to using `id` as slug with no category, so existing cards don't break.
 */
export default function WishlistButton({ slug, id, category, className, size = 18 }) {
  const effectiveSlug = slug ?? id
  const { isWishlisted, toggleWishlist, isAuthenticated } = useWishlist()
  const active = isWishlisted(effectiveSlug)

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isAuthenticated) return
        toggleWishlist(effectiveSlug, category)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      title={!isAuthenticated ? 'Log in to save to wishlist' : undefined}
      className={cn(
        'flex items-center justify-center rounded-full p-2 shadow-soft transition-colors',
        active ? 'bg-primary text-white' : 'bg-white/90 text-text-secondary hover:text-primary',
        !isAuthenticated && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <Heart size={size} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </motion.button>
  )
}
