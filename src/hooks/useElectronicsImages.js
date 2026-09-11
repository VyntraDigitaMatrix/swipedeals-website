import { useState, useCallback } from 'react'
import { electronicsListingService } from '../services/electronicsListingService'

export function useElectronicsImages(slug) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchImages = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const data = await electronicsListingService.getImages(slug)
      const content = data?.data?.content ?? data?.content ?? data?.data ?? []
      setImages(Array.isArray(content) ? content : [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch images.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const uploadImages = useCallback(async (files) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await electronicsListingService.uploadImages(slug, files)
      await fetchImages()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to upload images.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchImages])

  const deleteImage = useCallback(async (imageId) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await electronicsListingService.deleteImage(slug, imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete image.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug])

  const setPrimaryImage = useCallback(async (imageId) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await electronicsListingService.setPrimaryImage(slug, imageId)
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      )
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to set primary image.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug])

  const reorderImage = useCallback(async (imageId, displayOrder) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await electronicsListingService.reorderImage(slug, imageId, displayOrder)
      await fetchImages()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reorder image.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchImages])

  return {
    images,
    loading,
    error,
    fetchImages,
    uploadImages,
    deleteImage,
    setPrimaryImage,
    reorderImage,
  }
}

export default useElectronicsImages
