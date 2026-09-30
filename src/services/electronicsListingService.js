import api from '../api/axios'

/**
 * Service for user electronics listing controller endpoints (/api/user/products/electronics/**)
 */

export const ELECTRONICS_TYPES = [
  { value: 'MOBILE_PHONE', label: 'Mobile Phone' },
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'TELEVISION', label: 'Television / TV' },
  { value: 'CAMERA', label: 'Camera' },
  { value: 'GAMING_CONSOLE', label: 'Gaming Console' },
  { value: 'SMART_WATCH', label: 'Smart Watch' },
  { value: 'HEADPHONES', label: 'Headphones' },
  { value: 'EARPHONES', label: 'Earphones / TWS' },
  { value: 'SPEAKER', label: 'Speaker / Audio' },
  { value: 'COMPUTER_ACCESSORIES', label: 'Computer Accessories' },
  { value: 'OTHER', label: 'Other' },
]

export const ELECTRONICS_CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
]

/**
 * Sanitizes electronics payload matching exact backend Swagger DTO schema.
 * Strips unsupported fields (e.g. city, locality) that trigger 500 INTERNAL_ERROR.
 */
export function prepareElectronicsPayload(form) {
  const mapType = (t) => {
    const valid = [
      'MOBILE_PHONE', 'LAPTOP', 'TABLET', 'TELEVISION', 'CAMERA',
      'GAMING_CONSOLE', 'SMART_WATCH', 'HEADPHONES', 'EARPHONES', 'SPEAKER',
      'COMPUTER_ACCESSORIES', 'OTHER',
    ]
    if (valid.includes(t)) return t
    if (t === 'SMARTWATCH') return 'SMART_WATCH'
    if (t === 'DESKTOP' || t === 'ACCESSORY') return 'COMPUTER_ACCESSORIES'
    return 'MOBILE_PHONE'
  }

  const mapCondition = (c) => {
    const valid = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']
    if (valid.includes(c)) return c
    return 'NEW'
  }

  const rawYear = parseInt(form.purchaseYear, 10)
  const currentYear = new Date().getFullYear()
  const purchaseYear = !isNaN(rawYear) && rawYear >= 1990 && rawYear <= currentYear ? rawYear : currentYear

  const payload = {
    title: (form.title || `${form.brand || ''} ${form.model || ''}`).trim() || 'Electronics Item',
    description: (form.description || '').trim() || 'No description provided.',
    type: mapType(form.type),
    brand: (form.brand || 'Other').trim(),
    model: (form.model || '').trim() || 'N/A',
    price: Number(form.price) > 0 ? Number(form.price) : 0,
    negotiable: Boolean(form.negotiable),
    condition: mapCondition(form.condition),
    purchaseYear,
    warrantyAvailable: Boolean(form.warrantyAvailable),
    billAvailable: Boolean(form.billAvailable),
    boxAvailable: Boolean(form.boxAvailable),
  }

  return payload
}

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
    const cleanPayload = prepareElectronicsPayload(payload)
    const res = await api.post('/api/user/products/electronics', cleanPayload)
    return res.data
  },

  /**
   * PATCH /api/user/products/electronics/{slug}
   * Partial update of an electronics listing by slug.
   */
  patch: async (slug, payload) => {
    const cleanPayload = prepareElectronicsPayload(payload)
    const res = await api.patch(`/api/user/products/electronics/${encodeURIComponent(slug)}`, cleanPayload)
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
   * PATCH /api/user/products/electronics/{slug}/make-available
   * Make an electronics listing available.
   */
  makeAvailable: async (slug) => {
    const res = await api.patch(`/api/user/products/electronics/${encodeURIComponent(slug)}/make-available`)
    return res.data
  },

  /**
   * PATCH /api/user/products/electronics/{slug}/archive
   * Archive an electronics listing.
   */
  archive: async (slug) => {
    const res = await api.patch(`/api/user/products/electronics/${encodeURIComponent(slug)}/archive`)
    return res.data
  },

  /**
   * POST /api/user/products/electronics/{slug}/images
   * Upload multiple images for an electronics listing.
   */
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    try {
      const res = await api.post(`/api/user/products/electronics/${encodeURIComponent(slug)}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      console.warn('Batch image upload failed, falling back to single file uploads:', err)
      const results = []
      for (const file of files) {
        const singleFd = new FormData()
        singleFd.append('file', file)
        const res = await api.post(`/api/user/products/electronics/${encodeURIComponent(slug)}/images`, singleFd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        results.push(res.data)
      }
      return results
    }
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
      params: { displayOrder },
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
