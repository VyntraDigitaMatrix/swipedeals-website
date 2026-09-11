import api from '../api/axios'

/**
 * Service for user electronics listing controller endpoints (/api/user/products/electronics/**)
 */

export const ELECTRONICS_TYPES = [
  { value: 'MOBILE_PHONE', label: 'Mobile Phone' },
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'SMARTWATCH', label: 'Smartwatch' },
  { value: 'ACCESSORY', label: 'Accessory' },
  { value: 'OTHER', label: 'Other' }
]

export const ELECTRONICS_CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' }
]

export const electronicsListingService = {
  /**
   * GET /api/user/products/electronics
   * Retrieves paginated user electronics listings.
   */
  getAll: async (params = {}) => {
    const res = await api.get('/api/user/products/electronics', { params })
    return res.data
  },

  /**
   * GET /api/user/products/electronics/{slug}
   * Retrieves single electronics listing by slug.
   */
  getBySlug: async (slug) => {
    const res = await api.get(`/api/user/products/electronics/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/electronics
   * Creates a new electronics listing (saved as DRAFT).
   */
  create: async (payload) => {
    const res = await api.post('/api/user/products/electronics', payload)
    return res.data
  },

  /**
   * PATCH /api/user/products/electronics/{slug}
   * Partial update of an electronics listing by slug.
   */
  patch: async (slug, payload) => {
    const res = await api.patch(`/api/user/products/electronics/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  /**
   * DELETE /api/user/products/electronics/{slug}
   * Deletes an electronics listing by slug.
   */
  delete: async (slug) => {
    const res = await api.delete(`/api/user/products/electronics/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/electronics/{slug}/submit
   * Submit a DRAFT electronics listing for approval.
   */
  submit: async (slug) => {
    const res = await api.post(`/api/user/products/electronics/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  /**
   * POST /api/user/products/electronics/{slug}/images
   * Upload multiple images for an electronics listing.
   */
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await api.post(`/api/user/products/electronics/${encodeURIComponent(slug)}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * PUT /api/user/products/electronics/{slug}/images/{imageId}
   * Update a specific electronics image.
   */
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(`/api/user/products/electronics/${encodeURIComponent(slug)}/images/${imageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * DELETE /api/user/products/electronics/{slug}/images/{imageId}
   * Delete a specific electronics image.
   */
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(`/api/user/products/electronics/${encodeURIComponent(slug)}/images/${imageId}`)
    return res.data
  },

  /**
   * PUT /api/user/products/electronics/{slug}/images/{imageId}/primary
   * Set an image as primary.
   */
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.put(`/api/user/products/electronics/${encodeURIComponent(slug)}/images/${imageId}/primary`)
    return res.data
  },

  /**
   * PUT /api/user/products/electronics/{slug}/images/{imageId}/order
   * Update the display order of an image.
   */
  reorderImage: async (slug, imageId, displayOrder) => {
    const res = await api.put(`/api/user/products/electronics/${encodeURIComponent(slug)}/images/${imageId}/order`, null, {
      params: { displayOrder }
    })
    return res.data
  },

  /**
   * GET /api/user/products/electronics/{slug}/images
   * Retrieve all images for an electronics listing.
   */
  getImages: async (slug) => {
    const res = await api.get(`/api/user/products/electronics/${encodeURIComponent(slug)}/images`)
    return res.data
  },

  /**
   * GET /api/user/products/electronics/{slug}/images/primary
   * Retrieve the primary image for an electronics listing.
   */
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/user/products/electronics/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
}

export default electronicsListingService
