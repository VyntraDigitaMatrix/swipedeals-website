import { useState, useCallback } from 'react'
import { electronicsImageService } from '../services/electronicsListingService'

export function useElectronicsImages(slug, { isDealer = false } = {}) {
  const [images, setImages] = useState([])
  const [primaryImage, setPrimaryImageState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [primaryLoading, setPrimaryLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [error, setError] = useState(null)

  const normalizeImages = (data) => {
    const content = data?.data?.content ?? data?.content ?? data?.data ?? []
    const list = Array.isArray(content) ? content : []
    return [...list].sort((a, b) => {
      const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 999
      const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 999
      return orderA - orderB
    })
  }

  const fetchImages = useCallback(async () => {
    if (!slug) return []
    setLoading(true)
    setError(null)
    try {
      const data = await electronicsImageService.getImages(slug, {}, isDealer)
      const sorted = normalizeImages(data)
      setImages(sorted)
      const primary = sorted.find((img) => img.isPrimary) || null
      setPrimaryImageState(primary)
      return sorted
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch electronics images.'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [slug, isDealer])

  const fetchPrimaryImage = useCallback(async () => {
    if (!slug) return null
    setPrimaryLoading(true)
    try {
      const data = await electronicsImageService.getPrimaryImage(slug, isDealer)
      const primary = data?.data ?? data
      if (primary && primary.id) {
        setPrimaryImageState(primary)
        return primary
      }
      return null
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.warn('Could not fetch primary electronics image:', err)
      }
      return null
    } finally {
      setPrimaryLoading(false)
    }
  }, [slug, isDealer])

  const uploadImages = useCallback(
    async (files) => {
      if (!slug) return
      setUploading(true)
      setError(null)
      try {
        const fileList = Array.isArray(files) ? files : [files]
        await electronicsImageService.uploadImages(slug, fileList, isDealer)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to upload electronics images.'
        setError(msg)
        throw err
      } finally {
        setUploading(false)
      }
    },
    [slug, isDealer, fetchImages]
  )

  const updateImage = useCallback(
    async (imageId, file) => {
      if (!slug || !imageId || !file) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await electronicsImageService.updateImage(slug, imageId, file, isDealer)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to update electronics image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, isDealer, fetchImages]
  )

  const deleteImage = useCallback(
    async (imageId) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await electronicsImageService.deleteImage(slug, imageId, isDealer)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to delete electronics image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, isDealer, fetchImages]
  )

  const setPrimaryImage = useCallback(
    async (imageId) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await electronicsImageService.setPrimaryImage(slug, imageId, isDealer)
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        )
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to set primary electronics image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, isDealer, fetchImages]
  )

  const updateImageOrder = useCallback(
    async (imageId, displayOrder) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await electronicsImageService.updateImageOrder(slug, imageId, displayOrder, isDealer)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to update electronics image order.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, isDealer, fetchImages]
  )

  const reorderImage = updateImageOrder

  return {
    images,
    primaryImage,
    loading,
    primaryLoading,
    uploading,
    actionLoadingId,
    error,
    setError,
    fetchImages,
    fetchPrimaryImage,
    uploadImages,
    updateImage,
    deleteImage,
    setPrimaryImage,
    updateImageOrder,
    reorderImage,
  }
}

export default useElectronicsImages
