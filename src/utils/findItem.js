import { cars } from '../data/cars'
import { commercialVehicles } from '../data/commercialVehicles'
import { electronics } from '../data/electronics'
import { properties } from '../data/properties'
import { spareParts } from '../data/spareParts'

// Every listing id is prefixed uniquely (car-, cv-, el-, pr-, sp-) so we can
// resolve any id from the compare tray / wishlist back to its source record
// and category without needing a global normalized store.
const SOURCES = [
  { prefix: 'car-', list: cars, category: 'cars', detailPath: (item) => `/cars/${item.id}` },
  { prefix: 'cv-', list: commercialVehicles, category: 'commercial', detailPath: (item) => `/commercial-vehicles/${item.id}` },
  { prefix: 'el-', list: electronics, category: 'electronics', detailPath: (item) => `/electronics/${item.id}` },
  { prefix: 'pr-', list: properties, category: 'properties', detailPath: (item) => `/properties/${item.id}` },
  { prefix: 'sp-', list: spareParts, category: 'spare-parts', detailPath: (item) => `/spare-parts/${item.id}` },
]

function findUserListing(id) {
  if (!id?.startsWith('ul-')) return null
  try {
    const stored = JSON.parse(window.localStorage.getItem('swipedeals_user_listings') || '[]')
    const listing = stored.find((l) => l.id === id && l.status === 'approved')
    if (!listing) return null
    return { ...listing, category: listing.category, detailPath: `/listing/${listing.id}` }
  } catch {
    return null
  }
}

export function findItemById(id) {
  const userListing = findUserListing(id)
  if (userListing) return userListing

  const source = SOURCES.find((s) => id?.startsWith(s.prefix))
  if (!source) return null
  const item = source.list.find((x) => x.id === id)
  if (!item) return null
  return { ...item, category: source.category, detailPath: source.detailPath(item) }
}

export function findItemsByIds(ids = []) {
  return ids.map(findItemById).filter(Boolean)
}

export default findItemById
