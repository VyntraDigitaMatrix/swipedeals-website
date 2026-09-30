import { useState, useCallback } from 'react'
import {
  vehicleListingService,
  vehicleImageService,
  vehicleDocumentService,
  vehicleFeatureService,
  vehicleSpecificationService,
} from '../services/vehicleListingService'

async function enrichListing(item) {
  if (!item?.slug) return item
  try {
    let detail = {}
    try {
      const res = await vehicleListingService.getMyListing(item.slug)
      detail = res?.data ?? res ?? {}
    } catch (e) {}

    let images = detail?.images || item?.images
    if (!Array.isArray(images) || images.length === 0) {
      try {
        const imgRes = await vehicleImageService.getImages(item.slug)
        const imgList = imgRes?.data?.content ?? imgRes?.content ?? imgRes?.data ?? []
        if (Array.isArray(imgList) && imgList.length > 0) images = imgList
      } catch (e) {}
    }

    let documents = detail?.documents || item?.documents
    if (!Array.isArray(documents) || documents.length === 0) {
      try {
        const docRes = await vehicleDocumentService.getDocuments(item.slug)
        const docList = docRes?.data?.content ?? docRes?.content ?? docRes?.data ?? []
        if (Array.isArray(docList) && docList.length > 0) documents = docList
      } catch (e) {}
    }

    let specifications = detail?.specifications || item?.specifications
    if (!Array.isArray(specifications) || specifications.length === 0) {
      try {
        const specRes = await vehicleSpecificationService.getSpecifications(item.slug)
        const specList = specRes?.data?.content ?? specRes?.content ?? specRes?.data ?? []
        if (Array.isArray(specList) && specList.length > 0) specifications = specList
      } catch (e) {}
    }

    let features = detail?.features || item?.features
    if (!Array.isArray(features) || features.length === 0) {
      try {
        const featRes = await vehicleFeatureService.getFeatures(item.slug)
        const featList = featRes?.data?.content ?? featRes?.content ?? featRes?.data ?? []
        if (Array.isArray(featList) && featList.length > 0) features = featList
      } catch (e) {}
    }

    return {
      ...item,
      ...detail,
      images: Array.isArray(images) ? images : [],
      documents: Array.isArray(documents) ? documents : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      features: Array.isArray(features) ? features : [],
    }
  } catch (err) {
    return item
  }
}

export function useVehicleListings() {
  const [listings, setListings] = useState([])
  const [archivedListings, setArchivedListings] = useState([])
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
    empty: true,
  })
  const [archivedPagination, setArchivedPagination] = useState({
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

  /**
   * GET /api/vehicle-listings (getMyListings)
   */
  const fetchListings = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await vehicleListingService.getMyListings(params)
      const pageContent = data?.content ?? data?.data?.content ?? []
      const rawList = Array.isArray(pageContent) ? pageContent : []

      setListings(rawList)

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

      // Asynchronously enrich items with images, docs, specs, features
      if (rawList.length > 0) {
        Promise.all(rawList.map(enrichListing)).then((enriched) => {
          setListings(enriched)
        })
      }

      return data
    } catch (err) {
      if (err?.response?.status !== 401) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch vehicle listings.'
        setError(errMsg)
      }
      setListings([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * GET /api/vehicle-listings/archived (getMyArchivedListings)
   */
  const fetchArchivedListings = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await vehicleListingService.getMyArchivedListings(params)
      const pageContent = data?.content ?? data?.data?.content ?? []
      const rawList = Array.isArray(pageContent) ? pageContent : []

      setArchivedListings(rawList)

      const page = data?.data ?? data
      setArchivedPagination({
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
        number: page?.number ?? 0,
        size: page?.size ?? 10,
        first: page?.first ?? true,
        last: page?.last ?? true,
        empty: page?.empty ?? true,
      })

      if (rawList.length > 0) {
        Promise.all(rawList.map(enrichListing)).then((enriched) => {
          setArchivedListings(enriched)
        })
      }

      return data
    } catch (err) {
      if (err?.response?.status !== 401) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch archived vehicle listings.'
        setError(errMsg)
      }
      setArchivedListings([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * GET /api/vehicle-listings/{slug} (getMyListing)
   */
  const fetchListingBySlug = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.getMyListing(slug)
      return res?.data ?? res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch vehicle listing detail.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * POST /api/vehicle-listings (createListing)
   */
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

  /**
   * PUT /api/vehicle-listings/{slug} (updateMyListing)
   */
  const updateListing = useCallback(async (slug, payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.updateMyListing(slug, payload)
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

  /**
   * PATCH /api/vehicle-listings/{slug} (patchMyListing)
   */
  const patchListing = useCallback(async (slug, payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.patchMyListing(slug, payload)
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

  /**
   * DELETE /api/vehicle-listings/{slug} (deleteMyListing)
   */
  const deleteListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      await vehicleListingService.deleteMyListing(slug)
      setListings((prev) => prev.filter((item) => item.slug !== slug))
      setArchivedListings((prev) => prev.filter((item) => item.slug !== slug))
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

function getValidListingItem(res, fallbackStatus, currentItem) {
  const candidate = res?.data ?? res
  if (candidate && typeof candidate === 'object' && (candidate.title || candidate.slug || candidate.id || candidate.brand)) {
    const statusVal = typeof candidate.status === 'string' && candidate.status !== '200' ? candidate.status : fallbackStatus
    return { ...currentItem, ...candidate, status: statusVal }
  }
  return {
    ...currentItem,
    status: fallbackStatus || currentItem?.status || 'APPROVED',
  }
}

  /**
   * PATCH /api/vehicle-listings/{slug}/submit (submitListing_1)
   */
  const submitListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.submitListing_1(slug)
      setListings((prev) => prev.map((item) => (item.slug === slug ? getValidListingItem(res, 'PENDING_APPROVAL', item) : item)))
      fetchListings().catch(() => {})
      return res
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit vehicle listing for approval.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchListings])

  /**
   * PATCH /api/vehicle-listings/{slug}/archive (archiveMyListing)
   */
  const archiveListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.archiveMyListing(slug)
      let targetItem = listings.find((item) => item.slug === slug)
      const validItem = getValidListingItem(res, 'ARCHIVED', targetItem)
      setListings((prev) => prev.filter((item) => item.slug !== slug))
      setArchivedListings((prev) => [validItem, ...prev.filter((i) => i.slug !== slug)])
      fetchListings().catch(() => {})
      fetchArchivedListings().catch(() => {})
      return validItem
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to archive vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [listings, fetchListings, fetchArchivedListings])

  /**
   * PATCH /api/vehicle-listings/{slug}/restore (restoreMyArchivedListing)
   */
  const restoreListing = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleListingService.restoreMyArchivedListing(slug)
      let targetItem = archivedListings.find((item) => item.slug === slug)
      const validItem = getValidListingItem(res, 'APPROVED', targetItem)
      setArchivedListings((prev) => prev.filter((item) => item.slug !== slug))
      setListings((prev) => [validItem, ...prev.filter((i) => i.slug !== slug)])
      fetchListings().catch(() => {})
      fetchArchivedListings().catch(() => {})
      return validItem
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to restore archived vehicle listing.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [archivedListings, fetchListings, fetchArchivedListings])

  return {
    listings,
    archivedListings,
    pagination,
    archivedPagination,
    loading,
    error,
    fetchListings,
    fetchArchivedListings,
    fetchListingBySlug,
    createListing,
    updateListing,
    patchListing,
    deleteListing,
    submitListing,
    archiveListing,
    restoreListing,
  }
}

export default useVehicleListings
