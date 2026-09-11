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
   * POST /api/user/products/spare-parts/{slug}/images
   * Upload multiple images for a spare part listing.
   */
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await api.post(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}
   * Update a specific spare part image.
   */
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${imageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * DELETE /api/user/products/spare-parts/{slug}/images/{imageId}
   * Delete a specific spare part image.
   */
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${imageId}`)
    return res.data
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}/primary
   * Set an image as primary.
   */
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.put(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${imageId}/primary`)
    return res.data
  },

  /**
   * PUT /api/user/products/spare-parts/{slug}/images/{imageId}/order
   * Update the display order of an image.
   */
  reorderImage: async (slug, imageId, displayOrder) => {
    const res = await api.put(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images/${imageId}/order`, null, {
      params: { displayOrder }
    })
    return res.data
  },

  /**
   * GET /api/user/products/spare-parts/{slug}/images
   * Retrieve all images for a spare part listing.
   */
  getImages: async (slug) => {
    const res = await api.get(`/api/user/products/spare-parts/${encodeURIComponent(slug)}/images`)
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

export default sparePartsListingService
