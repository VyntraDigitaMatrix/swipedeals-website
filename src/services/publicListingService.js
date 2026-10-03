import api from '../api/axios'
import { titleCaseEnum, PLACEHOLDER_IMAGE } from '../utils/enumFormat'

/**
 * Extracts real photo URLs from listing response, prioritizing primary photo.
 */
export function extractImages(item) {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const list = [...item.images].sort(
      (a, b) => Number(Boolean(b?.isPrimary)) - Number(Boolean(a?.isPrimary)) || (a?.displayOrder || 0) - (b?.displayOrder || 0)
    )
    const urls = list.map((i) => (typeof i === 'string' ? i : i?.imageUrl)).filter(Boolean)
    if (urls.length > 0) return urls
  }
  return [PLACEHOLDER_IMAGE]
}

export const vehicleService = {
  // params: { type: 'CAR'|'BIKE'|'TRUCK'|'OTHER', condition: 'NEW'|'USED', page, size, sort }
  getAll: async (params = {}) => (await api.get('/api/public/vehicles', { params })).data,
  getBySlug: async (slug) => (await api.get(`/api/public/vehicles/${slug}`)).data,
  getImages: async (slug) => (await api.get(`/api/public/vehicles/${slug}/images`)).data,
}

export const electronicsService = {
  // params: { type: ElectronicsType, page, size, sort }
  getAll: async (params = {}) => (await api.get('/api/public/electronics', { params })).data,
  getBySlug: async (slug) => (await api.get(`/api/public/electronics/${slug}`)).data,
  getImages: async (slug) => (await api.get(`/api/public/electronics/${slug}/images`)).data,
}

export const propertyService = {
  // params: { propertyType: PropertyType, page, size, sort }
  getAll: async (params = {}) => (await api.get('/api/public/properties', { params })).data,
  getBySlug: async (slug) => (await api.get(`/api/public/properties/${slug}`)).data,
  getImages: async (slug) => (await api.get(`/api/public/properties/${slug}/images`)).data,
}

export const sparePartsService = {
  // params: { category: string, page, size, sort }
  getAll: async (params = {}) => (await api.get('/api/public/spare-parts', { params })).data,
  getBySlug: async (slug) => (await api.get(`/api/public/spare-parts/${slug}`)).data,
  getImages: async (slug) => (await api.get(`/api/public/spare-parts/${slug}/images`)).data,
}

// ── Mappers: backend response shape -> card & detail props ──────────────────

export function mapVehicleToCarCard(v) {
  if (!v) return null
  const images = extractImages(v)
  const sellerId = v.seller?.sellerId || v.sellerId
  const sellerName = v.seller?.sellerName || v.sellerName
  const sellerType = v.seller?.sellerType || v.sellerType
  const rating = v.seller?.averageRating ?? v.rating
  const reviews = v.seller?.totalReviews ?? v.reviews

  const formattedBrand = titleCaseEnum(v.brand)
  const rawModel = v.model || ''
  const cleanModel = rawModel.toLowerCase().startsWith(formattedBrand.toLowerCase())
    ? rawModel.slice(formattedBrand.length).trim()
    : rawModel
  const variantStr = v.variant ? v.variant.trim() : ''

  const titleParts = [formattedBrand, cleanModel, variantStr].filter(Boolean)
  const title = titleParts.join(' ')

  return {
    id: v.slug,
    slug: v.slug,
    category: 'vehicles',
    wishlistCategory: 'vehicles',
    vehicleId: v.id,
    sellerId,
    sellerName,
    sellerType,
    sellerEmail: v.seller?.email,
    sellerMobile: v.seller?.mobileNumber,
    seller: v.seller,
    rating,
    reviews,
    title,
    brand: formattedBrand,
    rawBrand: v.brand,
    model: v.model,
    variant: variantStr,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    condition: v.condition === 'NEW' ? 'new' : v.condition === 'LIKE_NEW' ? 'like-new' : 'used',
    rawCondition: v.condition,
    fuel: v.fuelType ? titleCaseEnum(v.fuelType) : 'Petrol',
    rawFuel: v.fuelType,
    transmission: v.transmissionType ? titleCaseEnum(v.transmissionType) : 'Manual',
    rawTransmission: v.transmissionType,
    km: v.mileage,
    owners: v.ownersCount || 1,
    vehicleType: v.vehicleType,
    color: v.color,
    registrationNumber: v.registrationNumber,
    chassisNumber: v.chassisNumber,
    vin: v.vin,
    status: v.status,
    description: v.description,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    images,
  }
}

export function mapVehicleToCommercialCard(v) {
  if (!v) return null
  const images = extractImages(v)
  const sellerId = v.seller?.sellerId || v.sellerId
  const sellerName = v.seller?.sellerName || v.sellerName
  const sellerType = v.seller?.sellerType || v.sellerType
  const rating = v.seller?.averageRating ?? v.rating
  const reviews = v.seller?.totalReviews ?? v.reviews

  const formattedBrand = titleCaseEnum(v.brand)
  const rawModel = v.model || ''
  const cleanModel = rawModel.toLowerCase().startsWith(formattedBrand.toLowerCase())
    ? rawModel.slice(formattedBrand.length).trim()
    : rawModel
  const variantStr = v.variant ? v.variant.trim() : ''

  const titleParts = [v.year, formattedBrand, cleanModel, variantStr].filter(Boolean)
  const title = titleParts.join(' ')

  return {
    id: v.slug,
    slug: v.slug,
    vehicleId: v.id,
    sellerId,
    sellerName,
    sellerType,
    sellerEmail: v.seller?.email,
    sellerMobile: v.seller?.mobileNumber,
    seller: v.seller,
    rating,
    reviews,
    title,
    brand: formattedBrand,
    rawBrand: v.brand,
    model: v.model,
    variant: variantStr,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    condition: v.condition === 'NEW' ? 'new' : v.condition === 'LIKE_NEW' ? 'like-new' : 'used',
    rawCondition: v.condition,
    fuel: v.fuelType ? titleCaseEnum(v.fuelType) : 'Diesel',
    rawFuel: v.fuelType,
    transmission: v.transmissionType ? titleCaseEnum(v.transmissionType) : 'Manual',
    rawTransmission: v.transmissionType,
    km: v.mileage,
    owners: v.ownersCount || 1,
    type: titleCaseEnum(v.vehicleType || 'TRUCK'),
    vehicleType: v.vehicleType,
    color: v.color,
    registrationNumber: v.registrationNumber,
    chassisNumber: v.chassisNumber,
    vin: v.vin,
    status: v.status,
    description: v.description,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    images,
  }
}

export function mapElectronicsToCard(e) {
  if (!e) return null
  const images = extractImages(e)
  const sellerId = e.seller?.sellerId || e.sellerId
  const sellerName = e.seller?.sellerName || e.sellerName
  const sellerType = e.seller?.sellerType || e.sellerType
  const rating = e.seller?.averageRating ?? e.rating
  const reviews = e.seller?.totalReviews ?? e.reviews

  return {
    id: e.slug,
    slug: e.slug,
    category: 'electronics',
    wishlistCategory: 'electronics',
    electronicsId: e.id,
    sellerId,
    sellerName,
    sellerType,
    sellerEmail: e.seller?.email,
    sellerMobile: e.seller?.mobileNumber,
    seller: e.seller,
    rating,
    reviews,
    title: e.title,
    description: e.description,
    category: e.type ? titleCaseEnum(e.type) : e.category ? titleCaseEnum(e.category) : '',
    rawCategory: e.type || e.category,
    brand: e.brand,
    model: e.model,
    price: e.price,
    negotiable: e.negotiable,
    condition: e.condition === 'NEW' ? 'new' : 'used',
    rawCondition: e.condition,
    purchaseYear: e.purchaseYear,
    warrantyAvailable: e.warrantyAvailable,
    boxAvailable: e.boxAvailable,
    listingSource: e.listingSource ? titleCaseEnum(e.listingSource) : null,
    status: e.status ? titleCaseEnum(e.status) : null,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    images,
  }
}

export function mapSparePartToCard(s) {
  if (!s) return null
  const images = extractImages(s)
  const sellerId = s.seller?.sellerId || s.sellerId
  const sellerName = s.seller?.sellerName || s.sellerName
  const sellerType = s.seller?.sellerType || s.sellerType
  const rating = s.seller?.averageRating ?? s.rating
  const reviews = s.seller?.totalReviews ?? s.reviews

  return {
    id: s.slug,
    slug: s.slug,
    wishlistCategory: 'spare-parts',
    partId: s.id,
    sellerId,
    sellerName,
    sellerType,
    sellerEmail: s.seller?.email,
    sellerMobile: s.seller?.mobileNumber,
    seller: s.seller,
    rating,
    reviews,
    title: s.title,
    description: s.description,
    category: s.category ? titleCaseEnum(s.category) : '',
    rawCategory: s.category,
    subCategory: s.subCategory,
    brand: s.brand,
    partNumber: s.partNumber,
    price: s.price,
    negotiable: s.negotiable,
    condition: s.condition === 'NEW' ? 'new' : 'used',
    rawCondition: s.condition,
    compatibleVehicleBrand: s.compatibleVehicleBrand,
    compatibleVehicleModel: s.compatibleVehicleModel,
    compatibleVehicleVariant: s.compatibleVehicleVariant,
    listingSource: s.listingSource ? titleCaseEnum(s.listingSource) : null,
    rawListingSource: s.listingSource,
    status: s.status ? titleCaseEnum(s.status) : null,
    rawStatus: s.status,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    images,
  }
}

export function mapPropertyToCard(p) {
  if (!p) return null
  const images = extractImages(p)
  const sellerId = p.seller?.sellerId || p.sellerId
  const sellerName = p.seller?.sellerName || p.sellerName
  const sellerType = p.seller?.sellerType || p.sellerType
  const rating = p.seller?.averageRating ?? p.rating
  const reviews = p.seller?.totalReviews ?? p.reviews
  const purpose = p.listingType === 'FOR_RENT' ? 'Rent' : p.listingType === 'FOR_LEASE' ? 'Lease' : 'Sale'

  const area = p.builtUpArea || p.carpetArea || p.plotArea || null

  return {
    id: p.slug,
    slug: p.slug,
    category: 'property',
    wishlistCategory: 'property',
    propertyId: p.id,
    sellerId,
    sellerName,
    sellerType,
    sellerEmail: p.seller?.email,
    sellerMobile: p.seller?.mobileNumber,
    seller: p.seller,
    rating,
    reviews,
    title: p.title,
    description: p.description,
    type: titleCaseEnum(p.propertyType),
    rawPropertyType: p.propertyType,
    listingType: p.listingType,
    purpose,
    price: p.price,
    negotiable: p.negotiable,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    balconies: p.balconies,
    builtUpArea: p.builtUpArea,
    carpetArea: p.carpetArea,
    plotArea: p.plotArea,
    areaUnit: p.areaUnit ? titleCaseEnum(p.areaUnit) : 'SQ_FT',
    area,
    furnishingStatus: p.furnishingStatus ? titleCaseEnum(p.furnishingStatus) : null,
    constructionStatus: p.constructionStatus ? titleCaseEnum(p.constructionStatus) : null,
    facing: p.facing ? titleCaseEnum(p.facing) : null,
    floor: p.floor,
    totalFloors: p.totalFloors,
    ageOfProperty: p.ageOfProperty,
    city: p.city,
    locality: p.locality,
    address: p.address,
    pincode: p.pincode,
    location: [p.locality, p.city].filter(Boolean).join(', '),
    listingSource: p.listingSource ? titleCaseEnum(p.listingSource) : null,
    status: p.status ? titleCaseEnum(p.status) : null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    images,
  }
}
