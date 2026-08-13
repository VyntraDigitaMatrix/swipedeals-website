import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Mock "backend" for user-submitted listings — there is no real server here,
 * so submissions are persisted to localStorage and move through a
 * pending -> approved / rejected lifecycle. Approved listings are what
 * buyers get shown across the site.
 */
export function useListingsStore() {
  const [listings, setListings] = useLocalStorage('swipedeals_user_listings', [])

  const addListing = useCallback(
    (data) => {
      const listing = {
        id: `ul-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        rejectionReason: null,
        ...data,
      }
      setListings((prev) => [listing, ...prev])
      return listing
    },
    [setListings]
  )

  const getListingById = useCallback((id) => listings.find((l) => l.id === id), [listings])
  const getApprovedByCategory = useCallback((category) => listings.filter((l) => l.status === 'approved' && l.category === category), [listings])
  const getByPhone = useCallback((phone) => listings.filter((l) => l.sellerPhone === phone), [listings])

  return {
    listings,
    pending: listings.filter((l) => l.status === 'pending'),
    approved: listings.filter((l) => l.status === 'approved'),
    rejected: listings.filter((l) => l.status === 'rejected'),
    addListing,
    getListingById,
    getApprovedByCategory,
    getByPhone,
  }
}

export default useListingsStore
