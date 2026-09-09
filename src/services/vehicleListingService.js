import api from '../api/axios'

/**
 * Enums as defined in user-vehicle-listing-controller Swagger API schema
 */

export const VEHICLE_BRANDS = [
  { value: 'MARUTI_SUZUKI', label: 'Maruti Suzuki' },
  { value: 'HYUNDAI', label: 'Hyundai' },
  { value: 'TATA', label: 'Tata' },
  { value: 'MAHINDRA', label: 'Mahindra' },
  { value: 'HONDA', label: 'Honda' },
  { value: 'TOYOTA', label: 'Toyota' },
  { value: 'FORD', label: 'Ford' },
  { value: 'VOLKSWAGEN', label: 'Volkswagen' },
  { value: 'SKODA', label: 'Skoda' },
  { value: 'RENAULT', label: 'Renault' },
  { value: 'NISSAN', label: 'Nissan' },
  { value: 'MG', label: 'MG' },
  { value: 'KIA', label: 'Kia' },
  { value: 'BMW', label: 'BMW' },
  { value: 'MERCEDES_BENZ', label: 'Mercedes-Benz' },
  { value: 'AUDI', label: 'Audi' },
  { value: 'OTHER', label: 'Other' },
]

export const VEHICLE_CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'USED', label: 'Used' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
]

export const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'CNG', label: 'CNG' },
  { value: 'LPG', label: 'LPG' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
]

export const TRANSMISSION_TYPES = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'AMT', label: 'AMT' },
  { value: 'CVT', label: 'CVT' },
  { value: 'DCT', label: 'DCT' },
  { value: 'IMT', label: 'iMT' },
]

export const VEHICLE_TYPES = [
  { value: 'CAR', label: 'Car' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'TRUCK', label: 'Commercial / Truck' },
  { value: 'OTHER', label: 'Other' },
]

/**
 * Service for user vehicle listing controller endpoints (/api/vehicle-listings/**)
 */
export const vehicleListingService = {
  /**
   * GET /api/vehicle-listings
   * Retrieves paginated vehicle listings.
   */
  getAll: async (params = {}) => {
    const res = await api.get('/api/vehicle-listings', { params })
    return res.data
  },

  /**
   * GET /api/vehicle-listings/{slug}
   * Retrieves single vehicle listing by slug.
   */
  getBySlug: async (slug) => {
    const res = await api.get(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },

  /**
   * POST /api/vehicle-listings
   * Creates a new vehicle listing.
   */
  createListing: async (payload) => {
    const res = await api.post('/api/vehicle-listings', payload)
    return res.data
  },

  /**
   * PUT /api/vehicle-listings/{slug}
   * Full update of vehicle listing by slug.
   */
  updateListing: async (slug, payload) => {
    const res = await api.put(`/api/vehicle-listings/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  /**
   * PATCH /api/vehicle-listings/{slug}
   * Partial update of vehicle listing by slug.
   */
  patchListing: async (slug, payload) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  /**
   * DELETE /api/vehicle-listings/{slug}
   * Deletes a vehicle listing by slug.
   */
  deleteListing: async (slug) => {
    const res = await api.delete(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },
}

export default vehicleListingService
