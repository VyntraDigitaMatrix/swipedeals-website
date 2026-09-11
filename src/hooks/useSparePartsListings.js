import { useState, useCallback } from 'react'
import { sparePartsListingService } from '../services/sparePartsListingService'

export function useSparePartsListings() {
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
      const data = await sparePartsListingService.getAll(params)
      const pageContent = data?.content ?? data?.data?.content ?? []
      setListings(Array.isArray(pageContent) ? pageContent : [])
      const page = data?.data ?? data
      setPagination({
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
        number: page?.number ?? 0,
        size: page?.size ?? 10,
        first: page?.first ?? true,
        last: page?.last ?? true,
        empty: page?.empty ?? true,
      })
      return data
    } catch (err) {
      if (err?.response?.status !== 401) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch spare parts listings.'
        setError(errMsg)
      }
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createListing = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await sparePartsListingService.create(payload)
      const newListing = res?.data ?? res
      setListings((prev) => [newListing, ...prev])
      return newListing
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create spare part listing.'
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
      const res = await sparePartsListingService.patch(slug, payload)
      const updated = res?.data ?? res
      setListings((prev) => prev.map((item) => (item.slug === slug ? updated : item)))
      return updated
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update spare part listing.'
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
      await sparePartsListingService.delete(slug)
      setListings((prev) => prev.filter((item) => item.slug !== slug))
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete spare part listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await sparePartsListingService.submit(slug)
      const updated = res?.data ?? res
      setListings((prev) => prev.map((item) => (item.slug === slug ? updated : item)))
      return updated
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit spare part listing.'
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
    patchListing,
    deleteListing,
    submitListing,
  }
}

export default useSparePartsListings
