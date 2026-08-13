import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlist } from '../../hooks/useWishlist'
import { cn } from '../../utils/cn'

export default function WishlistButton({ id, className, size = 18 }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const active = isWishlisted(id)

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(id)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex items-center justify-center rounded-full p-2 shadow-soft transition-colors',
        active ? 'bg-primary text-white' : 'bg-white/90 text-text-secondary hover:text-primary',
        className
      )}
    >
      <Heart size={size} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </motion.button>
  )
}
