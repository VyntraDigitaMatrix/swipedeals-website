import { useParams } from 'react-router-dom'
import { BadgeCheck, Bath, BedDouble, Ruler } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import { properties, getPropertyById } from '../data/properties'
import { formatCurrencyFull } from '../utils/format'

export default function PropertyDetails() {
  const { id } = useParams()
  const property = getPropertyById(id)

  if (!property) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Property not found" description="This listing may have been sold or removed." actionLabel="Browse Properties" actionTo="/properties" />
      </div>
    )
  }

  const similar = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 6)

  return (
    <DetailLayout
      item={property}
      breadcrumbLabel="Properties"
      breadcrumbTo="/properties"
      badges={[
        { label: `For ${property.purpose}`, variant: property.purpose === 'Rent' ? 'warning' : 'success' },
        { label: property.type, variant: 'neutral' },
        ...(property.verified ? [{ label: 'RERA Verified', variant: 'info', icon: BadgeCheck }] : []),
      ]}
      specs={[
        ...(property.bedrooms > 0 ? [{ label: 'Bedrooms', value: property.bedrooms, icon: BedDouble }] : []),
        ...(property.bathrooms > 0 ? [{ label: 'Bathrooms', value: property.bathrooms, icon: Bath }] : []),
        { label: 'Area', value: `${property.area.toLocaleString('en-IN')} sqft`, icon: Ruler },
        { label: 'Type', value: property.type },
      ]}
      description={`${property.title} is a premium ${property.type.toLowerCase()} located in ${property.location}, offering ${property.area.toLocaleString('en-IN')} sqft of thoughtfully designed living space. Verified ownership documents and RERA registration details are available on request.`}
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">
            {formatCurrencyFull(property.price)}
            {property.purpose === 'Rent' && <span className="text-base font-medium text-text-secondary">/mo</span>}
          </p>
          <p className="mt-1 text-sm text-text-secondary">&#8377;{Math.round(property.price / property.area).toLocaleString('en-IN')}/sqft</p>
        </div>
      }
      similar={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      }
    />
  )
}
