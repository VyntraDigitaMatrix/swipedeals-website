import { useState, useCallback } from 'react'
import { vehicleImageService } from '../services/vehicleListingService'

export function useVehicleImages(slug) {
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
      const data = await vehicleImageService.getImages(slug)
      const sorted = normalizeImages(data)
      setImages(sorted)
      const primary = sorted.find((img) => img.isPrimary) || null
      setPrimaryImageState(primary)
      return sorted
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch vehicle images.'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [slug])

  const fetchPrimaryImage = useCallback(async () => {
    if (!slug) return null
    setPrimaryLoading(true)
    try {
      const data = await vehicleImageService.getPrimaryImage(slug)
      const primary = data?.data ?? data
      if (primary && primary.id) {
        setPrimaryImageState(primary)
        return primary
      }
      return null
    } catch (err) {
      // 404 is normal if no images exist yet
      if (err?.response?.status !== 404) {
        console.warn('Could not fetch primary vehicle image:', err)
      }
      return null
    } finally {
      setPrimaryLoading(false)
    }
  }, [slug])

  const uploadImages = useCallback(
    async (files) => {
      if (!slug) return
      setUploading(true)
      setError(null)
      try {
        const fileList = Array.isArray(files) ? files : [files]
        if (fileList.length > 1) {
          await vehicleImageService.uploadMultiple(slug, fileList)
        } else if (fileList[0]) {
          await vehicleImageService.uploadImage(slug, fileList[0])
        }
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to upload vehicle image.'
        setError(msg)
        throw err
      } finally {
        setUploading(false)
      }
    },
    [slug, fetchImages]
  )

  const updateImage = useCallback(
    async (imageId, file) => {
      if (!slug || !imageId || !file) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await vehicleImageService.updateImage(slug, imageId, file)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to update vehicle image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, fetchImages]
  )

  const deleteImage = useCallback(
    async (imageId) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await vehicleImageService.deleteImage(slug, imageId)
        // Refresh full list to handle auto-promoted primary image
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to delete vehicle image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, fetchImages]
  )

  const setPrimaryImage = useCallback(
    async (imageId) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await vehicleImageService.setPrimaryImage(slug, imageId)
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        )
        const newPrimary = images.find((img) => img.id === imageId)
        if (newPrimary) {
          setPrimaryImageState({ ...newPrimary, isPrimary: true })
        }
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to set primary vehicle image.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, images, fetchImages]
  )

  const updateImageOrder = useCallback(
    async (imageId, displayOrder) => {
      if (!slug || !imageId) return
      setActionLoadingId(imageId)
      setError(null)
      try {
        await vehicleImageService.updateImageOrder(slug, imageId, displayOrder)
        await fetchImages()
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to update vehicle image order.'
        setError(msg)
        throw err
      } finally {
        setActionLoadingId(null)
      }
    },
    [slug, fetchImages]
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

export default useVehicleImages
