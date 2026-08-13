import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bath, Bed, BadgeCheck, Boxes, Calendar, Car, FileText, Landmark, Laptop, MapPin,
  Maximize, Package, Phone, ShieldCheck, Sofa, Tag, User, Wrench,
} from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/buttons/Button'
import { useListingsStore } from '../hooks/useListingsStore'
import { formatCurrencyFull, timeAgo } from '../utils/format'

const CATEGORY_LABELS = { cars: 'Car', commercial: 'Commercial Vehicle', electronics: 'Electronics', properties: 'Property', 'spare-parts': 'Spare Part' }
const CATEGORY_BREADCRUMB = { cars: '/cars', commercial: '/commercial-vehicles', electronics: '/electronics', properties: '/properties', 'spare-parts': '/spare-parts' }
const FURNISHING_LABELS = { unfurnished: 'Unfurnished', semi: 'Semi-Furnished', full: 'Fully Furnished' }
const WARRANTY_LABELS = { none: 'No warranty', manufacturer: 'Manufacturer warranty', extended: 'Extended warranty' }

// Fields captured on the dedicated sell forms (SellSparePart, SellElectronics,
// SellProperty) that are specific to that category — shown as extra spec
// tiles alongside the generic ones below.
function categorySpecs(listing) {
  if (listing.category === 'spare-parts') {
    return [
      { label: 'Part Type', value: listing.partCategory, icon: Wrench },
      { label: 'Brand', value: listing.brand, icon: Tag },
      { label: 'Fits Vehicle', value: listing.compatibleVehicle, icon: Car },
      { label: 'In Stock', value: listing.quantity ? `${listing.quantity} unit${listing.quantity > 1 ? 's' : ''}` : undefined, icon: Boxes },
    ]
  }
  if (listing.category === 'electronics') {
    return [
      { label: 'Type', value: listing.electronicsCategory, icon: Laptop },
      { label: 'Brand', value: listing.brand, icon: Tag },
      { label: 'Specifications', value: listing.specifications, icon: FileText },
      { label: 'Warranty', value: WARRANTY_LABELS[listing.warranty], icon: ShieldCheck },
      { label: 'Bill & Box', value: listing.billBoxAvailable ? 'Available' : undefined, icon: Package },
    ]
  }
  if (listing.category === 'properties') {
    return [
      { label: 'Type', value: listing.propertyType, icon: Landmark },
      { label: 'Purpose', value: listing.purpose ? `For ${listing.purpose}` : undefined },
      { label: 'Bedrooms', value: listing.bedrooms ? `${listing.bedrooms} BHK` : undefined, icon: Bed },
      { label: 'Bathrooms', value: listing.bathrooms || undefined, icon: Bath },
      { label: 'Area', value: listing.area ? `${listing.area} sq.ft.` : undefined, icon: Maximize },
      { label: 'Furnishing', value: FURNISHING_LABELS[listing.furnishing], icon: Sofa },
    ]
  }
  return []
}

export default function ListingDetails() {
  const { id } = useParams()
  const { getListingById } = useListingsStore()
  const listing = getListingById(id)
  // Captured once on mount (lazy initializer) rather than read live during
  // render, so the "listed X days ago" display stays stable across re-renders.
  const [now] = useState(() => Date.now())

  if (!listing || listing.status !== 'approved') {
    return (
      <div className="container-page py-16">
        <EmptyState title="Listing not found" description="This listing may still be under review, or has been removed." actionLabel="Browse Listings" actionTo="/" />
      </div>
    )
  }

  const daysAgo = Math.max(0, Math.floor((now - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <DetailLayout
      item={{ ...listing, rating: undefined }}
      breadcrumbLabel={CATEGORY_LABELS[listing.category] || 'Listing'}
      breadcrumbTo={CATEGORY_BREADCRUMB[listing.category] || '/'}
      badges={[
        { label: listing.condition === 'new' ? 'New' : 'Used', variant: listing.condition === 'new' ? 'success' : 'neutral' },
        { label: 'Seller Listing', variant: 'info', icon: ShieldCheck },
      ]}
      specs={[
        { label: 'Category', value: CATEGORY_LABELS[listing.category] || listing.category },
        { label: 'Condition', value: listing.condition === 'new' ? 'New' : 'Used' },
        ...categorySpecs(listing),
        { label: 'Listed', value: timeAgo(daysAgo), icon: Calendar },
        { label: 'City', value: listing.city, icon: MapPin },
      ].filter((spec) => spec.value !== undefined && spec.value !== '')}
      description={listing.description}
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(listing.price)}</p>
          <p className="mt-1 text-sm text-text-secondary">Listed directly by seller &mdash; price negotiable</p>
        </div>
      }
      sellerCard={
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">Seller Details</p>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-text">{listing.sellerName}</p>
                <BadgeCheck size={14} className="shrink-0 text-info" aria-hidden="true" />
              </div>
              <p className="text-xs text-text-secondary">Individual Seller</p>
            </div>
          </div>
          <Button href={`tel:+91${listing.sellerPhone}`} variant="primary" fullWidth icon={Phone} className="mt-4">
            Call +91 {listing.sellerPhone}
          </Button>
        </div>
      }
    />
  )
}
