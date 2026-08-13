import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

// Persists wishlisted item ids in localStorage and exposes helpers to toggle/check them.
export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage('swipedeals_wishlist', [])

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [setWishlist])

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((x) => x !== id))
  }, [setWishlist])

  return { wishlist, isWishlisted, toggleWishlist, removeFromWishlist, count: wishlist.length }
}

export default useWishlist
