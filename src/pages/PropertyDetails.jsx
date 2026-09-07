import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bath, BedDouble, Ruler } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import { propertyService, mapPropertyToCard } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE, titleCaseEnum } from '../utils/enumFormat'
import { formatCurrencyFull } from '../utils/format'

export default function PropertyDetails() {
  const { id: slug } = useParams()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    propertyService
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setRaw(res?.data ?? null)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!raw) return
    let cancelled = false
    propertyService
      .getAll({ propertyType: raw.propertyType, size: 7, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSimilarRaw(Array.isArray(content) ? content.filter((p) => p.slug !== raw.slug).slice(0, 6) : [])
      })
      .catch(() => {
        if (!cancelled) setSimilarRaw([])
      })
    return () => { cancelled = true }
  }, [raw])

  const images = usePublicImages(propertyService.getImages, slug, [PLACEHOLDER_IMAGE])

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-text-secondary">Loading…</div>
  }

  if (notFound || !raw) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Property not found" description="This listing may have been sold or removed." actionLabel="Browse Properties" actionTo="/properties" />
      </div>
    )
  }

  const property = { ...mapPropertyToCard(raw), images }
  const similar = similarRaw.map(mapPropertyToCard)

  const area = raw.builtUpArea || raw.carpetArea || raw.plotArea || null
  const areaLabel = area != null ? `${area.toLocaleString('en-IN')} ${raw.areaUnit ? titleCaseEnum(raw.areaUnit) : 'sqft'}` : null

  return (
    <DetailLayout
      item={property}
      breadcrumbLabel="Properties"
      breadcrumbTo="/properties"
      badges={[
        { label: `For ${property.purpose}`, variant: property.purpose === 'Rent' ? 'warning' : 'success' },
        { label: property.type, variant: 'neutral' },
      ]}
      specs={[
        ...(raw.bedrooms > 0 ? [{ label: 'Bedrooms', value: raw.bedrooms, icon: BedDouble }] : []),
        ...(raw.bathrooms > 0 ? [{ label: 'Bathrooms', value: raw.bathrooms, icon: Bath }] : []),
        { label: 'Area', value: areaLabel, icon: Ruler },
        { label: 'Type', value: property.type },
        { label: 'Furnishing', value: raw.furnishingStatus ? titleCaseEnum(raw.furnishingStatus) : null },
        { label: 'Facing', value: raw.facing ? titleCaseEnum(raw.facing) : null },
      ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')}
      description={
        raw.description ||
        `${property.title} is listed on the SwipeDeals marketplace${
          property.location ? ` in ${property.location}` : ''
        }${areaLabel ? `, offering ${areaLabel} of space` : ''}. Contact the seller directly for ownership documents and viewing details.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">
            {formatCurrencyFull(property.price)}
            {property.purpose === 'Rent' && <span className="text-base font-medium text-text-secondary">/mo</span>}
          </p>
          {area != null && property.price != null && (
            <p className="mt-1 text-sm text-text-secondary">&#8377;{Math.round(property.price / area).toLocaleString('en-IN')}/{raw.areaUnit ? titleCaseEnum(raw.areaUnit) : 'sqft'}</p>
          )}
        </div>
      }
      similar={
        similar.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )
      }
    />
  )
}
