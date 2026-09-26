import { useState, useCallback } from 'react'
import { vehicleImageService } from '../services/vehicleListingService'

export function useVehicleImages(slug) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchImages = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const data = await vehicleImageService.getImages(slug)
      const content = data?.data?.content ?? data?.content ?? data?.data ?? []
      setImages(Array.isArray(content) ? content : [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicle images.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const uploadImages = useCallback(async (files) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      if (Array.isArray(files) && files.length > 1) {
        await vehicleImageService.uploadMultiple(slug, files)
      } else if (files?.[0] || files instanceof File) {
        const fileToUpload = files instanceof File ? files : files[0]
        await vehicleImageService.uploadImage(slug, fileToUpload)
      }
      await fetchImages()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to upload vehicle image.')
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
      await vehicleImageService.deleteImage(slug, imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete vehicle image.')
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
      await vehicleImageService.setPrimaryImage(slug, imageId)
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      )
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to set primary vehicle image.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug])

  return {
    images,
    loading,
    error,
    fetchImages,
    uploadImages,
    deleteImage,
    setPrimaryImage,
  }
}

export default useVehicleImages
