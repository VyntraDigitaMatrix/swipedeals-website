import api from '../api/axios'

/**
 * Service for user spare parts listing controller endpoints (/api/user/products/spare-parts/**)
 */

export const SPARE_PARTS_CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
]

export const sparePartsListingService = {
  /**
   * GET /api/user/products/spare-parts
   * Retrieves paginated user spare parts listings.
   */
  getAll: async (params = {}) => {
    const res = await api.get('/api/user/products/spare-parts', { params })
    return res.data
  },

  /**
   * GET /api/user/products/spare-parts/{slug}
   * Retrieves single spare part listing by slug.
   */
  getBySlug: async (slug) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/spare-parts
   * Creates a new spare part listing (saved as DRAFT).
   */
  create: async (payload) => {
    const res = await api.post('/api/user/products/spare-parts', payload)
    return res.data
  },

  /**
   * PATCH /api/user/products/spare-parts/{slug}
   * Partial update of a spare part listing by slug.
   */
  patch: async (slug, payload) => {
    const res = await api.patch(`/api/user/products/spare-parts/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  /**
   * DELETE /api/user/products/spare-parts/{slug}
   * Deletes a spare part listing by slug.
   */
  delete: async (slug) => {
    const res = await api.delete(`/api/user/products/spare-parts/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/spare-parts/{slug}/submit
   * Submit a DRAFT spare part listing for approval.
   */
  submit: async (slug) => {
    const res = await api.post(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  /**
   * PATCH /api/user/products/spare-parts/{slug}/make-available
   * Make a spare part listing available.
   */
  makeAvailable: async (slug) => {
    const res = await api.patch(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/make-available`)
    return res.data
  },

  /**
   * PATCH /api/user/products/spare-parts/{slug}/archive
   * Archive a spare part listing.
   */
  archive: async (slug) => {
    const res = await api.patch(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/archive`)
    return res.data
  },

  /**
   * POST /api/user/products/spare-parts/{slug}/images
   * Upload multiple images for a spare part listing.
   */
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    const fileList = Array.isArray(files) ? files : [files]
    fileList.forEach((file) => formData.append('files', file))
    try {
      const res = await api.post(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      console.warn('Batch spare part upload failed, trying single file fallback:', err)
      const results = []
      for (const file of fileList) {
        const singleFd = new FormData()
        singleFd.append('file', file)
        const res = await api.post(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`, singleFd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        results.push(res.data)
      }
      return results
    }
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}
   * Update a specific spare part image.
   */
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(
      `/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },

  /**
   * DELETE /api/user/products/spare-parts/{slug}/images/{imageId}
   * Delete a specific spare part image.
   */
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(
      `/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`
    )
    return res.data
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}/primary
   * Set an image as primary.
   */
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.put(
      `/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/primary`
    )
    return res.data
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}/order
   * Update the display order of an image.
   */
  updateImageOrder: async (slug, imageId, displayOrder) => {
    const res = await api.put(
      `/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/order`,
      null,
      {
        params: { displayOrder: parseInt(displayOrder, 10) },
      }
    )
    return res.data
  },

  /**
   * Alias for updateImageOrder.
   */
  reorderImage: async (slug, imageId, displayOrder) => {
    return sparePartsListingService.updateImageOrder(slug, imageId, displayOrder)
  },

  /**
   * GET /api/user/products/spare-parts/{slug}/images
   * Retrieve all images for a spare part listing.
   */
  getImages: async (slug, params = {}) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`, { params })
    return res.data
  },

  /**
   * GET /api/user/products/spare-parts/{slug}/images/primary
   * Retrieve the primary image for a spare part listing.
   */
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
}

/**
 * Service specifically for User Spare Part Images controller endpoints:
 * (/api/user/products/spare-parts/{slug}/images/**)
 */
export const userSparePartImageService = {
  getImages: async (slug, params = {}) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`, { params })
    return res.data
  },
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
  uploadImages: async (slug, files) => {
    return sparePartsListingService.uploadImages(slug, files)
  },
  updateImage: async (slug, imageId, file) => {
    return sparePartsListingService.updateImage(slug, imageId, file)
  },
  deleteImage: async (slug, imageId) => {
    return sparePartsListingService.deleteImage(slug, imageId)
  },
  setPrimaryImage: async (slug, imageId) => {
    return sparePartsListingService.setPrimaryImage(slug, imageId)
  },
  updateImageOrder: async (slug, imageId, displayOrder) => {
    return sparePartsListingService.updateImageOrder(slug, imageId, displayOrder)
  },
  reorderImage: async (slug, imageId, displayOrder) => {
    return sparePartsListingService.updateImageOrder(slug, imageId, displayOrder)
  },
}

/**
 * Unified Spare Part Image Service wrapper.
 */
export const sparePartImageService = userSparePartImageService

export default sparePartsListingService
