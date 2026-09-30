import { useState, useCallback } from 'react'
import { electronicsListingService } from '../services/electronicsListingService'

function getValidListingItem(res, fallbackStatus, currentItem) {
  const candidate = res?.data ?? res
  if (candidate && typeof candidate === 'object' && (candidate.title || candidate.slug || candidate.id)) {
    const statusVal = typeof candidate.status === 'string' && candidate.status !== '200' ? candidate.status : fallbackStatus
    return { ...currentItem, ...candidate, status: statusVal }
  }
  return {
    ...currentItem,
    status: fallbackStatus || currentItem?.status || 'APPROVED',
  }
}

export function useElectronicsListings() {
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
      const data = await electronicsListingService.getAll(params)
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
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch electronics listings.'
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
      const res = await electronicsListingService.create(payload)
      const newListing = res?.data ?? res
      setListings((prev) => [newListing, ...prev])
      return newListing
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create electronics listing.'
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
      const res = await electronicsListingService.patch(slug, payload)
      setListings((prev) => prev.map((item) => (item.slug === slug ? getValidListingItem(res, item.status, item) : item)))
      return res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update electronics listing.'
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
      await electronicsListingService.delete(slug)
      setListings((prev) => prev.filter((item) => item.slug !== slug))
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete electronics listing.'
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
      const res = await electronicsListingService.submit(slug)
      setListings((prev) => prev.map((item) => (item.slug === slug ? getValidListingItem(res, 'PENDING_APPROVAL', item) : item)))
      fetchListings().catch(() => {})
      return res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit electronics listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchListings])

  const makeAvailableListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await electronicsListingService.makeAvailable(slug)
      setListings((prev) => prev.map((item) => (item.slug === slug ? getValidListingItem(res, 'AVAILABLE', item) : item)))
      fetchListings().catch(() => {})
      return res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to make electronics listing available.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchListings])

  const archiveListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await electronicsListingService.archive(slug)
      setListings((prev) => prev.map((item) => (item.slug === slug ? getValidListingItem(res, 'ARCHIVED', item) : item)))
      fetchListings().catch(() => {})
      return res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to archive electronics listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchListings])

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
    makeAvailableListing,
    archiveListing,
  }
}

export default useElectronicsListings
