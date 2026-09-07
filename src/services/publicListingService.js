import api from '../api/axios'
import { titleCaseEnum, PLACEHOLDER_IMAGE } from '../utils/enumFormat'

/**
 * Real, unauthenticated marketplace browsing — talks to the backend's
 * /api/public/** controllers (Vehicles / Electronics / Spare Parts /
 * Properties). Every endpoint here is public: no token is required or sent.
 *
 * Each `getAll` call returns a Spring Page envelope
 * ({ content, totalElements, totalPages, number, size, ... }) inside the
 * standard ApiResponse wrapper, so callers read `response.data.content`.
 *
 * Each service also exposes `getImages(slug)`, hitting the matching
 * `/api/public/.../{slug}/images` endpoint for that listing's real photo
 * gallery. The catalog list/detail endpoints themselves don't embed
 * photos, so cards and detail pages fetch images separately (see the
 * `usePublicImages` hook) and fall back to a neutral placeholder until
 * the real gallery loads or when a listing has no uploaded photos.
 */

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

// ── Mappers: backend response shape -> the props the existing card ──────
// components expect. Fields with no backend equivalent (rating, verified
// badges, dealer info, EMI, body type) are simply omitted rather than
// invented — the card components render those sections only when present.

export function mapVehicleToCarCard(v) {
  return {
    id: v.slug,
    title: `${titleCaseEnum(v.brand)} ${v.model}${v.variant ? ` ${v.variant}` : ''}`,
    brand: titleCaseEnum(v.brand),
    year: v.year,
    price: v.price,
    condition: v.condition === 'NEW' ? 'new' : 'used',
    fuel: titleCaseEnum(v.fuelType),
    transmission: titleCaseEnum(v.transmissionType),
    km: v.mileage,
    owners: v.ownersCount,
    vehicleType: v.vehicleType,
    images: [PLACEHOLDER_IMAGE],
  }
}

export function mapVehicleToCommercialCard(v) {
  return {
    id: v.slug,
    title: `${v.year} ${titleCaseEnum(v.brand)} ${v.model}${v.variant ? ` ${v.variant}` : ''}`,
    condition: v.condition === 'NEW' ? 'new' : 'used',
    km: v.mileage,
    type: titleCaseEnum(v.vehicleType),
    price: v.price,
    images: [PLACEHOLDER_IMAGE],
  }
}

export function mapElectronicsToCard(e) {
  return {
    id: e.slug,
    title: e.title,
    category: titleCaseEnum(e.type),
    brand: e.brand,
    price: e.price,
    images: [PLACEHOLDER_IMAGE],
  }
}

export function mapSparePartToCard(s) {
  return {
    id: s.slug,
    title: s.title,
    category: s.category,
    brand: s.brand,
    price: s.price,
    images: [PLACEHOLDER_IMAGE],
  }
}

export function mapPropertyToCard(p) {
  const purpose = p.listingType === 'FOR_RENT' ? 'Rent' : p.listingType === 'FOR_LEASE' ? 'Lease' : 'Sale'
  return {
    id: p.slug,
    title: p.title,
    type: titleCaseEnum(p.propertyType),
    purpose,
    price: p.price,
    location: [p.locality, p.city].filter(Boolean).join(', '),
    images: [PLACEHOLDER_IMAGE],
  }
}
