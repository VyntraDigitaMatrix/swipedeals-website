import api from '../api/axios'

/**
 * Enums and Schema Field Definitions for User Vehicle Listings, Images, Documents, Features & Specifications
 */

export const VEHICLE_BRANDS = [
  { value: 'MARUTI_SUZUKI', label: 'Maruti Suzuki' },
  { value: 'HYUNDAI', label: 'Hyundai' },
  { value: 'TATA', label: 'Tata' },
  { value: 'MAHINDRA', label: 'Mahindra' },
  { value: 'HONDA', label: 'Honda' },
  { value: 'TOYOTA', label: 'Toyota' },
  { value: 'KIA', label: 'Kia' },
  { value: 'MG', label: 'MG' },
  { value: 'RENAULT', label: 'Renault' },
  { value: 'NISSAN', label: 'Nissan' },
  { value: 'VOLKSWAGEN', label: 'Volkswagen' },
  { value: 'SKODA', label: 'Skoda' },
  { value: 'FORD', label: 'Ford' },
  { value: 'JEEP', label: 'Jeep' },
  { value: 'CITROEN', label: 'Citroën' },
  { value: 'VOLVO', label: 'Volvo' },
  { value: 'BYD', label: 'BYD' },
  { value: 'BMW', label: 'BMW' },
  { value: 'MERCEDES_BENZ', label: 'Mercedes-Benz' },
  { value: 'AUDI', label: 'Audi' },
  { value: 'JAGUAR', label: 'Jaguar' },
  { value: 'LAND_ROVER', label: 'Land Rover' },
  { value: 'LEXUS', label: 'Lexus' },
  { value: 'PORSCHE', label: 'Porsche' },
  { value: 'MINI', label: 'MINI' },
  { value: 'ISUZU', label: 'Isuzu' },
  { value: 'HERO', label: 'Hero' },
  { value: 'BAJAJ', label: 'Bajaj' },
  { value: 'TVS', label: 'TVS' },
  { value: 'YAMAHA', label: 'Yamaha' },
  { value: 'ROYAL_ENFIELD', label: 'Royal Enfield' },
  { value: 'SUZUKI', label: 'Suzuki' },
  { value: 'KTM', label: 'KTM' },
  { value: 'APRILIA', label: 'Aprilia' },
  { value: 'PIAGGIO', label: 'Piaggio / Vespa' },
  { value: 'OLA', label: 'Ola Electric' },
  { value: 'ATHER', label: 'Ather' },
  { value: 'REVOLT', label: 'Revolt' },
  { value: 'ULTRAVIOLET', label: 'Ultraviolette' },
  { value: 'HUSQVARNA', label: 'Husqvarna' },
  { value: 'ASHOK_LEYLAND', label: 'Ashok Leyland' },
  { value: 'BHARATBENZ', label: 'BharatBenz' },
  { value: 'EICHER', label: 'Eicher' },
  { value: 'FORCE', label: 'Force Motors' },
  { value: 'SML_ISUZU', label: 'SML Isuzu' },
  { value: 'VOLVO_TRUCKS', label: 'Volvo Trucks' },
  { value: 'SCANIA', label: 'Scania' },
  { value: 'MAN', label: 'MAN' },
  { value: 'UD_TRUCKS', label: 'UD Trucks' },
  { value: 'JCB', label: 'JCB' },
  { value: 'CATERPILLAR', label: 'Caterpillar' },
  { value: 'KOMATSU', label: 'Komatsu' },
  { value: 'VOLVO_CONSTRUCTION_EQUIPMENT', label: 'Volvo Construction Equipment' },
  { value: 'HYUNDAI_CONSTRUCTION_EQUIPMENT', label: 'Hyundai Construction Equipment' },
  { value: 'TATA_HITACHI', label: 'Tata Hitachi' },
  { value: 'CASE', label: 'CASE' },
  { value: 'LIUGONG', label: 'LiuGong' },
  { value: 'DOOSAN', label: 'Doosan' },
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
  { value: 'CARS', label: 'Cars' },
  { value: 'TWO_WHEELER', label: 'Two Wheeler / Bike' },
  { value: 'COMMERCIAL_VEHICLES', label: 'Commercial Vehicles' },
  { value: 'CONSTRUCTION_VEHICLES', label: 'Construction Vehicles' },
  { value: 'OTHERS', label: 'Others' },
]

export const SELLER_TYPES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DEALER', label: 'Dealer' },
  { value: 'USER', label: 'User' },
]

export const LISTING_STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'UNDER_INSPECTION', label: 'Under Inspection' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'INACTIVE', label: 'Inactive' },
]

export const DOCUMENT_TYPES = [
  { value: 'RC', label: 'Registration Certificate (RC)' },
  { value: 'INSURANCE', label: 'Insurance Policy' },
  { value: 'POLLUTION_CERTIFICATE', label: 'Pollution Under Control (PUC)' },
  { value: 'SERVICE_RECORDS', label: 'Service & Maintenance Records' },
  { value: 'FITNESS_CERTIFICATE', label: 'Fitness Certificate' },
  { value: 'ROAD_TAX', label: 'Road Tax Receipt' },
  { value: 'INVOICE', label: 'Purchase Invoice' },
  { value: 'WARRANTY', label: 'Warranty Card / Document' },
  { value: 'NOC', label: 'No Objection Certificate (NOC)' },
  { value: 'OTHER', label: 'Other Document' },
]

export const FEATURE_CATEGORIES = [
  { value: 'SAFETY', label: 'Safety & Security' },
  { value: 'COMFORT', label: 'Comfort & Convenience' },
  { value: 'PERFORMANCE', label: 'Performance & Drive' },
  { value: 'INTERIOR', label: 'Interior & Infotainment' },
  { value: 'EXTERIOR', label: 'Exterior & Styling' },
  { value: 'OTHER', label: 'Other Features' },
]

export const SPEC_CATEGORIES = [
  { value: 'DIMENSIONS_AND_CAPACITY', label: 'Dimensions & Capacity' },
  { value: 'ENGINE_AND_TRANSMISSION', label: 'Engine & Transmission' },
  { value: 'FUEL_AND_PERFORMANCE', label: 'Fuel & Performance' },
  { value: 'SUSPENSION_STEERING_AND_BRAKES', label: 'Suspension, Steering & Brakes' },
  { value: 'OTHER', label: 'Other Specifications' },
]

export const ERROR_CODES = [
  'INVALID_TOKEN',
  'TOKEN_EXPIRED',
  'OTP_EXPIRED',
  'INVALID_OTP',
  'OTP_NOT_FOUND',
  'ACCOUNT_LOCKED',
  'INVALID_REFRESH_TOKEN',
  'ACCESS_DENIED',
  'BAD_REQUEST',
  'VALIDATION_FAILED',
  'RESOURCE_NOT_FOUND',
  'CONFLICT',
  'INTERNAL_ERROR',
  'INVALID_REQUEST',
]

/**
 * Sanitizes vehicle creation/update payload so backend schema validation passes clean without 500 errors.
 */
export function prepareVehiclePayload(form) {
  const mapVehicleType = (type, category) => {
    if (type === 'CARS' || type === 'TWO_WHEELER' || type === 'COMMERCIAL_VEHICLES' || type === 'CONSTRUCTION_VEHICLES' || type === 'OTHERS') {
      return type
    }
    if (type === 'CAR') return 'CARS'
    if (type === 'BIKE') return 'TWO_WHEELER'
    if (type === 'TRUCK') return 'COMMERCIAL_VEHICLES'
    if (category === 'commercial') return 'COMMERCIAL_VEHICLES'
    return 'CARS'
  }

  const payload = {
    brand: form.brand || 'MARUTI_SUZUKI',
    model: (form.model || form.title || 'Vehicle').trim(),
    year: parseInt(form.year, 10) || new Date().getFullYear(),
    price: parseFloat(form.price) || 0,
    condition: form.condition || 'USED',
    fuelType: form.fuelType || 'PETROL',
    transmissionType: form.transmissionType || 'MANUAL',
    vehicleType: mapVehicleType(form.vehicleType, form.category),
  }

  if (form.variant && form.variant.trim()) {
    payload.variant = form.variant.trim()
  }

  if (form.mileage !== undefined && form.mileage !== null && form.mileage !== '' && !isNaN(Number(form.mileage))) {
    payload.mileage = parseInt(form.mileage, 10)
  }

  if (form.color && form.color.trim()) {
    payload.color = form.color.trim()
  }

  if (form.registrationNumber && form.registrationNumber.trim().length >= 5) {
    payload.registrationNumber = form.registrationNumber.trim()
  }

  if (form.chassisNumber && form.chassisNumber.trim().length >= 10) {
    payload.chassisNumber = form.chassisNumber.trim()
  }

  if (form.vin && form.vin.trim()) {
    payload.vin = form.vin.trim()
  }

  if (form.ownersCount !== undefined && form.ownersCount !== null && form.ownersCount !== '' && !isNaN(Number(form.ownersCount))) {
    payload.ownersCount = Math.min(10, Math.max(1, parseInt(form.ownersCount, 10)))
  }

  if (form.description && form.description.trim()) {
    payload.description = form.description.trim()
  }

  return payload
}

/**
 * Service for authenticated User Vehicle Listings controller (/api/vehicle-listings/**)
 */
export const vehicleListingService = {
  getMyListings: async (params = {}) => {
    const res = await api.get('/api/vehicle-listings', { params })
    return res.data
  },

  getAll: async (params = {}) => {
    const res = await api.get('/api/vehicle-listings', { params })
    return res.data
  },

  getMyListing: async (slug) => {
    const res = await api.get(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },

  getBySlug: async (slug) => {
    const res = await api.get(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },

  createListing: async (payload) => {
    const cleanPayload = prepareVehiclePayload(payload)
    const res = await api.post('/api/vehicle-listings', cleanPayload)
    return res.data
  },

  create: async (payload) => {
    const cleanPayload = prepareVehiclePayload(payload)
    const res = await api.post('/api/vehicle-listings', cleanPayload)
    return res.data
  },

  updateMyListing: async (slug, payload) => {
    const cleanPayload = prepareVehiclePayload(payload)
    const res = await api.put(`/api/vehicle-listings/${encodeURIComponent(slug)}`, cleanPayload)
    return res.data
  },

  updateListing: async (slug, payload) => {
    const cleanPayload = prepareVehiclePayload(payload)
    const res = await api.put(`/api/vehicle-listings/${encodeURIComponent(slug)}`, cleanPayload)
    return res.data
  },

  patchMyListing: async (slug, payload) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  patchListing: async (slug, payload) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}`, payload)
    return res.data
  },

  deleteMyListing: async (slug) => {
    const res = await api.delete(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },

  deleteListing: async (slug) => {
    const res = await api.delete(`/api/vehicle-listings/${encodeURIComponent(slug)}`)
    return res.data
  },

  submitListing_1: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  submitListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  submitMyListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/submit`)
    return res.data
  },

  archiveMyListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/archive`)
    return res.data
  },

  archiveListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/archive`)
    return res.data
  },

  restoreMyArchivedListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/restore`)
    return res.data
  },

  restoreListing: async (slug) => {
    const res = await api.patch(`/api/vehicle-listings/${encodeURIComponent(slug)}/restore`)
    return res.data
  },

  getMyArchivedListings: async (params = {}) => {
    const res = await api.get('/api/vehicle-listings/archived', { params })
    return res.data
  },

  getArchivedListings: async (params = {}) => {
    const res = await api.get('/api/vehicle-listings/archived', { params })
    return res.data
  },

  // Legacy / convenience image helpers
  uploadImages: async (slug, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('file', file))
    const res = await api.post(`/api/user/vehicles/${encodeURIComponent(slug)}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

/**
 * Service for User Vehicle Images (/api/user/vehicles/{vehicleSlug}/images/**)
 */
export const vehicleImageService = {
  getImages: async (vehicleSlug) => {
    const res = await api.get(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/images`)
    return res.data
  },

  uploadImage: async (vehicleSlug, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  uploadMultiple: async (vehicleSlug, files) => {
    const results = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      results.push(res.data)
    }
    return results
  },

  setPrimaryImage: async (vehicleSlug, imageId) => {
    const res = await api.patch(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/images/${imageId}/primary`)
    return res.data
  },

  deleteImage: async (vehicleSlug, imageId) => {
    const res = await api.delete(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/images/${imageId}`)
    return res.data
  },
}

/**
 * Service for User Vehicle Documents (/api/user/vehicles/{vehicleSlug}/documents/**)
 */
export const vehicleDocumentService = {
  getDocuments: async (vehicleSlug) => {
    const res = await api.get(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/documents`)
    return res.data
  },

  uploadDocument: async (vehicleSlug, documentType, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post(
      `/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/documents`,
      formData,
      {
        params: { documentType },
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },

  replaceDocument: async (vehicleSlug, documentType, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.put(
      `/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/documents/${encodeURIComponent(documentType)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data
  },

  deleteDocument: async (vehicleSlug, documentId) => {
    const res = await api.delete(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/documents/${documentId}`)
    return res.data
  },
}

/**
 * Service for User Vehicle Features (/api/user/vehicles/{slug}/features/**)
 */
export const vehicleFeatureService = {
  getFeatures: async (slug) => {
    const res = await api.get(`/api/user/vehicles/${encodeURIComponent(slug)}/features`)
    return res.data
  },

  updateFeatures: async (slug, featuresPayload) => {
    const res = await api.put(`/api/user/vehicles/${encodeURIComponent(slug)}/features`, featuresPayload)
    return res.data
  },
}

/**
 * Service for the admin vehicle feature master catalog.
 * GET /api/admin/vehicle-feature-masters
 * Returns the full list of all features available to be assigned to any vehicle.
 */
export const featureMasterService = {
  /**
   * GET /api/admin/vehicle-feature-masters/vehicle-type/{vehicleType}
   * Returns only features that belong to the given vehicle type.
   * @param {string} vehicleType - e.g. 'CARS', 'TWO_WHEELER', 'COMMERCIAL_VEHICLES'
   */
  getFeaturesByVehicleType: async (vehicleType) => {
    let mappedType = 'CAR' // Default fallback
    if (vehicleType) {
      const vType = vehicleType.toUpperCase()
      if (vType === 'CARS' || vType === 'CAR') mappedType = 'CAR'
      else if (vType === 'TWO_WHEELER' || vType === 'BIKE') mappedType = 'TWO_WHEELER'
      else if (vType === 'COMMERCIAL_VEHICLES' || vType === 'COMMERCIAL_VEHICLE' || vType === 'TRUCK') mappedType = 'COMMERCIAL'
      else if (vType === 'CONSTRUCTION_VEHICLES' || vType === 'CONSTRUCTION_VEHICLE' || vType === 'CONSTRUCTION') mappedType = 'CONSTRUCTION'
      else if (vType === 'OTHERS' || vType === 'OTHER') mappedType = 'OTHER'
      else mappedType = vType // Trust the passed value if not in the map
    }
    
    const res = await api.get(`/api/admin/vehicle-feature-masters/vehicle-type/${encodeURIComponent(mappedType)}`)
    return res.data
  },
}

/**
 * Service for User Vehicle Specifications (/api/user/vehicles/{vehicleSlug}/specifications/**)
 */
export const vehicleSpecificationService = {
  getSpecifications: async (vehicleSlug) => {
    const res = await api.get(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/specifications`)
    return res.data
  },

  getSpecificationById: async (vehicleSlug, specificationId) => {
    const res = await api.get(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/specifications/${specificationId}`)
    return res.data
  },

  addSpecification: async (vehicleSlug, payload) => {
    const res = await api.post(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/specifications`, payload)
    return res.data
  },

  updateSpecification: async (vehicleSlug, specificationId, payload) => {
    const res = await api.put(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/specifications/${specificationId}`, payload)
    return res.data
  },

  deleteSpecification: async (vehicleSlug, specificationId) => {
    const res = await api.delete(`/api/user/vehicles/${encodeURIComponent(vehicleSlug)}/specifications/${specificationId}`)
    return res.data
  },
}

export default vehicleListingService
