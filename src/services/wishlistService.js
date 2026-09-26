import api from '../api/axios'

/**
 * Service for wishlist-controller endpoints (/api/user/wishlist/**)
 * Categories: vehicles, property, electronics, spare-parts
 */
export const wishlistService = {
  /**
   * GET /api/user/wishlist/mywishlist
   * Fetches the authenticated user's full wishlist.
   */
  getMyWishlist: async () => {
    const res = await api.get('/api/user/wishlist/mywishlist')
    return res.data
  },

  // ─── Add to wishlist ───────────────────────────────────────────────

  addVehicle: async (slug) => {
    const res = await api.post(`/api/user/wishlist/add/vehicles/${encodeURIComponent(slug)}`)
    return res.data
  },

  addProperty: async (slug) => {
    const res = await api.post(`/api/user/wishlist/add/property/${encodeURIComponent(slug)}`)
    return res.data
  },

  addElectronics: async (slug) => {
    const res = await api.post(`/api/user/wishlist/add/electronics/${encodeURIComponent(slug)}`)
    return res.data
  },

  addSparePart: async (slug) => {
    // The backend registered the spare-parts ADD endpoint under /remove/ (backend naming bug).
    // Swagger shows: POST /api/user/wishlist/remove/spare-parts/{slug} → addSparePartToWishlist
    const res = await api.post(`/api/user/wishlist/remove/spare-parts/${encodeURIComponent(slug)}`)
    return res.data
  },

  // ─── Remove from wishlist ──────────────────────────────────────────

  removeVehicle: async (slug) => {
    const res = await api.delete(`/api/user/wishlist/remove/vehicles/${encodeURIComponent(slug)}`)
    return res.data
  },

  removeProperty: async (slug) => {
    const res = await api.delete(`/api/user/wishlist/remove/property/${encodeURIComponent(slug)}`)
    return res.data
  },

  removeElectronics: async (slug) => {
    const res = await api.delete(`/api/user/wishlist/remove/electronics/${encodeURIComponent(slug)}`)
    return res.data
  },

  removeSparePart: async (slug) => {
    const res = await api.delete(`/api/user/wishlist/remove/spare-parts/${encodeURIComponent(slug)}`)
    return res.data
  },
}

// ─── Category dispatch helpers ─────────────────────────────────────────────

/**
 * Map of category key → { add, remove } service methods.
 * Category keys match the ones used in the backend and listing cards.
 */
export const WISHLIST_CATEGORY_MAP = {
  vehicles:     { add: wishlistService.addVehicle,     remove: wishlistService.removeVehicle },
  vehicle:      { add: wishlistService.addVehicle,     remove: wishlistService.removeVehicle },
  property:     { add: wishlistService.addProperty,    remove: wishlistService.removeProperty },
  properties:   { add: wishlistService.addProperty,    remove: wishlistService.removeProperty },
  electronics:  { add: wishlistService.addElectronics, remove: wishlistService.removeElectronics },
  'spare-parts':{ add: wishlistService.addSparePart,   remove: wishlistService.removeSparePart },
  spareParts:   { add: wishlistService.addSparePart,   remove: wishlistService.removeSparePart },
}

export default wishlistService
