import { useState, useCallback } from 'react'
import { vehicleListingService } from '../services/vehicleListingService'

export function useVehicleListings() {
  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
    empty: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchListings = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await vehicleListingService.getAll(params)
      // Standard Spring Page response or ApiResponse wrap
      const pageContent = data?.content ?? data?.data?.content ?? []
      setListings(Array.isArray(pageContent) ? pageContent : [])
      setPagination({
        totalElements: data?.totalElements ?? data?.data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? data?.data?.totalPages ?? 0,
        number: data?.number ?? data?.data?.number ?? 0,
        size: data?.size ?? data?.data?.size ?? 10,
        first: data?.first ?? data?.data?.first ?? true,
        last: data?.last ?? data?.data?.last ?? true,
        empty: data?.empty ?? data?.data?.empty ?? true,
      })
      return data
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch vehicle listings.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createListing = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.createListing(payload)
      const newListing = res?.data ?? res
      setListings((prev) => [newListing, ...prev])
      return newListing
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateListing = useCallback(async (slug, payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.updateListing(slug, payload)
      const updated = res?.data ?? res
      setListings((prev) => prev.map((item) => (item.slug === slug ? updated : item)))
      return updated
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const patchListing = useCallback(async (slug, payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.patchListing(slug, payload)
      const updated = res?.data ?? res
      setListings((prev) => prev.map((item) => (item.slug === slug ? updated : item)))
      return updated
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to patch vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      await vehicleListingService.deleteListing(slug)
      setListings((prev) => prev.filter((item) => item.slug !== slug))
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    listings,
    pagination,
    loading,
    error,
    fetchListings,
    createListing,
    updateListing,
    patchListing,
    deleteListing,
  }
}

export default useVehicleListings
