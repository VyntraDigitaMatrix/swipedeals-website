import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, createElement } from 'react'
import { wishlistService, WISHLIST_CATEGORY_MAP } from '../services/wishlistService'

/**
 * WishlistContext — single source of truth for wishlist state.
 *
 * Wrap your app (or <App>) with <WishlistProvider> so all WishlistButton
 * instances and the Wishlist page share the same fetched state.
 */

const WishlistContext = createContext(null)

function getItemSlug(item) {
  const inner = item?.product ?? item
  return String(inner?.slug ?? inner?.id ?? '')
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [slugs, setSlugs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('swipedeals_access_token')
  })
  const hasFetched = useRef(false)

  // Re-check auth on storage changes (login/logout in another tab or same tab)
  useEffect(() => {
    const check = () => setIsAuthenticated(!!localStorage.getItem('swipedeals_access_token'))
    window.addEventListener('storage', check)
    // Also poll briefly so same-tab login updates work
    const interval = setInterval(check, 1000)
    return () => {
      window.removeEventListener('storage', check)
      clearInterval(interval)
    }
  }, [])

  const slugSet = useMemo(() => new Set(slugs), [slugs])

  const applyList = useCallback((list) => {
    setItems(list)
    setSlugs(list.map(getItemSlug))
  }, [])

  // Fetch on auth
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
      setSlugs([])
      hasFetched.current = false
      return
    }
    if (hasFetched.current) return
    hasFetched.current = true
    setLoading(true)
    wishlistService.getMyWishlist()
      .then((res) => {
        const raw = res?.data?.content ?? res?.data ?? res
        applyList(Array.isArray(raw) ? raw : [])
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load wishlist.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, applyList])

  const isWishlisted = useCallback((slug) => slugSet.has(String(slug)), [slugSet])

  const toggleWishlist = useCallback(async (slug, category) => {
    if (!isAuthenticated) return
    const handlers = WISHLIST_CATEGORY_MAP[category]
    if (!handlers) {
      console.warn(`[Wishlist] Unknown category: "${category}"`)
      return
    }
    const key = String(slug)
    const alreadyIn = slugSet.has(key)

    // Optimistic
    if (alreadyIn) {
      setSlugs((p) => p.filter((s) => s !== key))
      setItems((p) => p.filter((i) => getItemSlug(i) !== key))
    } else {
      setSlugs((p) => [...p, key])
      setItems((p) => [...p, { productType: category.toUpperCase(), product: { slug: key }, _optimistic: true }])
    }

    try {
      await (alreadyIn ? handlers.remove(slug) : handlers.add(slug))
    } catch (err) {
      // Rollback
      if (alreadyIn) {
        setSlugs((p) => [...p, key])
        setItems((p) => [...p, { productType: category.toUpperCase(), product: { slug: key }, _optimistic: true }])
      } else {
        setSlugs((p) => p.filter((s) => s !== key))
        setItems((p) => p.filter((i) => getItemSlug(i) !== key))
      }
      console.error('[Wishlist] toggle failed:', err)
    }
  }, [isAuthenticated, slugSet])

  const removeFromWishlist = useCallback(async (slug, category) => {
    if (!isAuthenticated) return
    const handlers = WISHLIST_CATEGORY_MAP[category]
    if (!handlers) return
    const key = String(slug)
    setSlugs((p) => p.filter((s) => s !== key))
    setItems((p) => p.filter((i) => getItemSlug(i) !== key))
    try { await handlers.remove(slug) } catch (err) { console.error('[Wishlist] remove failed:', err) }
  }, [isAuthenticated])

  const refetch = useCallback(() => {
    if (!isAuthenticated) return
    hasFetched.current = false
    setLoading(true)
    setError(null)
    wishlistService.getMyWishlist()
      .then((res) => {
        const raw = res?.data?.content ?? res?.data ?? res
        applyList(Array.isArray(raw) ? raw : [])
        hasFetched.current = true
      })
      .catch((err) => setError(err?.message || 'Failed to refresh wishlist.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, applyList])

  const value = useMemo(() => ({
    items, slugs, loading, error, isAuthenticated,
    isWishlisted, toggleWishlist, removeFromWishlist, refetch,
    count: slugs.length,
    wishlist: slugs,
  }), [items, slugs, loading, error, isAuthenticated, isWishlisted, toggleWishlist, removeFromWishlist, refetch])

  return createElement(WishlistContext.Provider, { value }, children)
}

/** Hook to consume the wishlist context */
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}

export default useWishlist
