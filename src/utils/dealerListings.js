import { cars } from '../data/cars'
import { commercialVehicles } from '../data/commercialVehicles'
import { electronics } from '../data/electronics'
import { properties } from '../data/properties'
import { spareParts } from '../data/spareParts'
import { dealers, getDealerBySlug as getSeedDealerBySlug } from '../data/dealers'

// Same category sources as utils/findItem.js — reused here to build a
// dealer's full cross-category catalog for their public storefront page.
const SOURCES = [
  { list: cars, category: 'cars', categoryLabel: 'Car', detailPath: (item) => `/cars/${item.id}` },
  { list: commercialVehicles, category: 'commercial', categoryLabel: 'Commercial', detailPath: (item) => `/commercial-vehicles/${item.id}` },
  { list: electronics, category: 'electronics', categoryLabel: 'Electronics', detailPath: (item) => `/electronics/${item.id}` },
  { list: properties, category: 'properties', categoryLabel: 'Property', detailPath: (item) => `/properties/${item.id}` },
  { list: spareParts, category: 'spare-parts', categoryLabel: 'Spare Part', detailPath: (item) => `/spare-parts/${item.id}` },
]

/** All catalog listings (across every category) belonging to a given dealer id. */
export function getListingsByDealerId(dealerId) {
  return SOURCES.flatMap((source) =>
    source.list
      .filter((item) => item.dealerId === dealerId)
      .map((item) => ({ ...item, category: source.category, categoryLabel: source.categoryLabel, detailPath: source.detailPath(item) }))
  )
}

/** Converts a newly admin-approved dealer application into a dealer-shaped object for the storefront page. */
export function applicationToDealer(application) {
  const slug = application.slug
  return {
    id: application.id,
    slug,
    name: application.businessName,
    category: 'Cars',
    verified: true,
    rating: 0,
    reviews: 0,
    location: application.city || 'India',
    phone: application.phone,
    listings: 0,
    since: new Date(application.createdAt).getFullYear(),
    logo: null,
    banner: null,
    description: `${application.businessName} is a verified SwipeDeals dealer partner.`,
    isNewDealer: true,
  }
}

/** Resolves a dealer by slug across both the seeded dealer roster and approved dealer applications. */
export function resolveDealerBySlug(slug, approvedApplications = []) {
  const seeded = getSeedDealerBySlug(slug)
  if (seeded) return seeded
  const application = approvedApplications.find((a) => a.slug === slug)
  return application ? applicationToDealer(application) : null
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** True if a slug is already taken by a seeded dealer or another application. */
export function isSlugTaken(slug, applications = []) {
  return dealers.some((d) => d.slug === slug) || applications.some((a) => a.slug === slug)
}

export default getListingsByDealerId
