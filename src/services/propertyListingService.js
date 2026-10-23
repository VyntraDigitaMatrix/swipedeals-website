import api from '../api/axios'

/**
 * Enums as defined in user-property-controller Swagger API schema
 */

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'BUILDER_FLOOR', label: 'Builder Floor' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'SHOP', label: 'Shop' },
  { value: 'SHOWROOM', label: 'Showroom' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'FACTORY', label: 'Factory' },
  { value: 'RESIDENTIAL_PLOT', label: 'Residential Plot' },
  { value: 'COMMERCIAL_PLOT', label: 'Commercial Plot' },
  { value: 'AGRICULTURAL_LAND', label: 'Agricultural Land' },
  { value: 'OTHER', label: 'Other' },
]

export const LISTING_TYPES = [
  { value: 'FOR_SALE', label: 'For Sale' },
  { value: 'FOR_RENT', label: 'For Rent' },
  { value: 'FOR_LEASE', label: 'For Lease' },
]

export const FURNISHING_STATUSES = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
]

export const CONSTRUCTION_STATUSES = [
  { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
  { value: 'READY_TO_MOVE', label: 'Ready to Move' },
  { value: 'NEW_LAUNCH', label: 'New Launch' },
]

export const FACING_OPTIONS = [
  { value: 'NORTH', label: 'North' },
  { value: 'SOUTH', label: 'South' },
  { value: 'EAST', label: 'East' },
  { value: 'WEST', label: 'West' },
  { value: 'NORTH_EAST', label: 'North-East' },
  { value: 'NORTH_WEST', label: 'North-West' },
  { value: 'SOUTH_EAST', label: 'South-East' },
  { value: 'SOUTH_WEST', label: 'South-West' },
]

export const AREA_UNITS = [
  { value: 'SQ_FT', label: 'Sq. Ft.' },
  { value: 'SQ_M', label: 'Sq. M.' },
  { value: 'SQ_YD', label: 'Sq. Yd.' },
  { value: 'ACRE', label: 'Acre' },
  { value: 'HECTARE', label: 'Hectare' },
  { value: 'CENT', label: 'Cent' },
  { value: 'GROUND', label: 'Ground' },
  { value: 'KANAL', label: 'Kanal' },
  { value: 'MARLA', label: 'Marla' },
  { value: 'BIGHA', label: 'Bigha' },
]

/**
 * Service for user property listing controller endpoints (/api/user/products/properties/**)
 */
export const propertyListingService = {
  /**
   * GET /api/user/products/properties
   * Retrieves paginated user property listings.
   */
  getAll: async (params = {}) => {
    const res = await api.get('/api/user/products/properties', { params })
    return res.data
  },

  /**
   * GET /api/user/products/properties/{slug}
   * Retrieves single property listing by slug.
   */
  getBySlug: async (slug) => {
    const res = await api.get(`/api/user/products/properties/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/properties
   * Creates a new property listing (saved as DRAFT).
   */
  create: async (payload) => {
    const res = await api.post('/api/user/products/properties', payload)
    return res.data
  },

  /**
   * PATCH /api/user/products/properties/{slug}
   * Partial update of a property listing by slug.
   */
  patch: async (slug, payload) => {
    const res = await api.patch(`/api/user/products/properties/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  /**
   * DELETE /api/user/products/properties/{slug}
   * Deletes a property listing by slug.
   */
  delete: async (slug) => {
    const res = await api.delete(`/api/user/products/properties/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/user/products/properties/{slug}/submit
   * Submit a DRAFT property listing for approval.
   */
  submit: async (slug) => {
    const res = await api.post(`/api/user/products/properties/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  /**
   * PATCH /api/user/products/properties/{slug}/make-available
   * Make a property listing available.
   */
  makeAvailable: async (slug) => {
    const res = await api.patch(`/api/user/products/properties/${encodeURIComponent(slug)}/make-available`)
    return res.data
  },

  /**
   * PATCH /api/user/products/properties/{slug}/archive
   * Archive a property listing.
   */
  archive: async (slug) => {
    const res = await api.patch(`/api/user/products/properties/${encodeURIComponent(slug)}/archive`)
    return res.data
  },

  /**
   * POST /api/user/products/properties/{slug}
   * Upload multiple images for a property listing.
   */
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    const fileList = Array.isArray(files) ? files : [files]
    fileList.forEach((file) => formData.append('files', file))
    const res = await api.post(`/api/user/products/properties/${encodeURIComponent(slug)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * PUT /api/user/products/properties/{slug}/images/{imageId}
   * Update a specific property image.
   */
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },

  /**
   * DELETE /api/user/products/properties/{slug}/images/{imageId}
   * Delete a specific property image.
   */
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`
    )
    return res.data
  },

  /**
   * PATCH /api/user/products/properties/{slug}/images/{imageId}/primary
   * Set an image as primary.
   */
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.patch(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/primary`
    )
    return res.data
  },

  /**
   * PATCH /api/user/products/properties/{slug}/images/{imageId}/order
   * Update the display order of an image.
   */
  updateImageOrder: async (slug, imageId, displayOrder) => {
    const res = await api.patch(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/order`,
      { displayOrder: parseInt(displayOrder, 10) }
    )
    return res.data
  },

  /**
   * Alias for updateImageOrder.
   */
  reorderImage: async (slug, imageId, displayOrder) => {
    return propertyListingService.updateImageOrder(slug, imageId, displayOrder)
  },

  /**
   * GET /api/user/products/properties/{slug}/images
   * Retrieve all images for a property listing.
   */
  getImages: async (slug, params = {}) => {
    const res = await api.get(`/api/user/products/properties/${encodeURIComponent(slug)}/images`, { params })
    return res.data
  },

  /**
   * GET /api/user/products/properties/{slug}/images/primary
   * Retrieve the primary image for a property listing.
   */
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/user/products/properties/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
}

/**
 * Service specifically for User Property Images controller endpoints:
 * (/api/user/products/properties/{slug}/**)
 */
export const userPropertyImageService = {
  getImages: async (slug, params = {}) => {
    const res = await api.get(`/api/user/products/properties/${encodeURIComponent(slug)}/images`, { params })
    return res.data
  },
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/user/products/properties/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    const fileList = Array.isArray(files) ? files : [files]
    fileList.forEach((file) => formData.append('files', file))
    const res = await api.post(`/api/user/products/properties/${encodeURIComponent(slug)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`
    )
    return res.data
  },
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.patch(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/primary`
    )
    return res.data
  },
  updateImageOrder: async (slug, imageId, displayOrder) => {
    const res = await api.patch(
      `/api/user/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/order`,
      { displayOrder: parseInt(displayOrder, 10) }
    )
    return res.data
  },
  reorderImage: async (slug, imageId, displayOrder) => {
    return userPropertyImageService.updateImageOrder(slug, imageId, displayOrder)
  },
}

/**
 * Service specifically for Dealer Property Images controller endpoints:
 * (/api/dealer/products/properties/{slug}/**)
 */
export const dealerPropertyImageService = {
  getImages: async (slug, params = {}) => {
    const res = await api.get(`/api/dealer/products/properties/${encodeURIComponent(slug)}/images`, { params })
    return res.data
  },
  getPrimaryImage: async (slug) => {
    const res = await api.get(`/api/dealer/products/properties/${encodeURIComponent(slug)}/images/primary`)
    return res.data
  },
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    const fileList = Array.isArray(files) ? files : [files]
    fileList.forEach((file) => formData.append('files', file))
    const res = await api.post(`/api/dealer/products/properties/${encodeURIComponent(slug)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  updateImage: async (slug, imageId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(
      `/api/dealer/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },
  deleteImage: async (slug, imageId) => {
    const res = await api.delete(
      `/api/dealer/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}`
    )
    return res.data
  },
  setPrimaryImage: async (slug, imageId) => {
    const res = await api.patch(
      `/api/dealer/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/primary`
    )
    return res.data
  },
  updateImageOrder: async (slug, imageId, displayOrder) => {
    const res = await api.patch(
      `/api/dealer/products/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(imageId)}/order`,
      { displayOrder: parseInt(displayOrder, 10) }
    )
    return res.data
  },
  reorderImage: async (slug, imageId, displayOrder) => {
    return dealerPropertyImageService.updateImageOrder(slug, imageId, displayOrder)
  },
}

/**
 * Unified Property Image Service that dispatches to either User or Dealer endpoints.
 */
export const propertyImageService = {
  getService: (isDealer = false) => (isDealer ? dealerPropertyImageService : userPropertyImageService),
  getImages: (slug, params = {}, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).getImages(slug, params),
  getPrimaryImage: (slug, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).getPrimaryImage(slug),
  uploadImages: (slug, files, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).uploadImages(slug, files),
  updateImage: (slug, imageId, file, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).updateImage(slug, imageId, file),
  deleteImage: (slug, imageId, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).deleteImage(slug, imageId),
  setPrimaryImage: (slug, imageId, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).setPrimaryImage(slug, imageId),
  updateImageOrder: (slug, imageId, displayOrder, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).updateImageOrder(slug, imageId, displayOrder),
  reorderImage: (slug, imageId, displayOrder, isDealer = false) =>
    (isDealer ? dealerPropertyImageService : userPropertyImageService).updateImageOrder(slug, imageId, displayOrder),
}

export default propertyListingService


