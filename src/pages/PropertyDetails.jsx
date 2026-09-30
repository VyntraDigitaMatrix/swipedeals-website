import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bath, BedDouble, Building2, Clock, Compass, Home, Layers, MapPin, Ruler } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import { propertyService, mapPropertyToCard, extractImages } from '../services/publicListingService'
import { propertyListingService } from '../services/propertyListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE, titleCaseEnum } from '../utils/enumFormat'
import { formatCurrencyFull, formatDate } from '../utils/format'

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

    const fetchProperty = async () => {
      let data = null
      try {
        const res = await propertyService.getBySlug(slug)
        const candidate = (res?.data && typeof res.data === 'object' && (res.data.slug || res.data.id || res.data.title)) ? res.data : res
        if (candidate && (candidate.slug || candidate.id || candidate.title)) {
          data = candidate
        }
      } catch (e) {
        // Public endpoint failed
      }

      if (!data) {
        try {
          const sellerRes = await propertyListingService.getBySlug(slug)
          const candidate = (sellerRes?.data && typeof sellerRes.data === 'object' && (sellerRes.data.slug || sellerRes.data.id || sellerRes.data.title)) ? sellerRes.data : sellerRes
          if (candidate && (candidate.slug || candidate.id || candidate.title)) {
            data = candidate
          }
        } catch (e) {
          // Seller service failed
        }
      }

      if (!cancelled) {
        if (data) {
          setRaw(data)
        } else {
          setNotFound(true)
        }
      }
    }

    fetchProperty().finally(() => {
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

  const propImages = extractImages(raw)
  const images = usePublicImages(propertyService.getImages, slug, propImages)

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

  const mapped = mapPropertyToCard(raw)
  const property = {
    ...mapped,
    images: images.length > 0 && images[0] !== PLACEHOLDER_IMAGE ? images : propImages,
    location: [raw.locality, raw.city, raw.pincode].filter(Boolean).join(', ') || mapped.location,
    sellerId: raw.seller?.sellerId || raw.sellerId || mapped.sellerId,
    sellerName: raw.seller?.sellerName || raw.sellerName || mapped.sellerName,
    sellerType: raw.seller?.sellerType || raw.sellerType || mapped.sellerType,
    sellerEmail: raw.seller?.email,
    sellerMobile: raw.seller?.mobileNumber,
    seller: raw.seller,
    rating: raw.seller?.averageRating ?? mapped.rating,
    reviews: raw.seller?.totalReviews ?? mapped.reviews,
  }
  const similar = similarRaw.map(mapPropertyToCard)

  const areaUnitStr = raw.areaUnit ? titleCaseEnum(raw.areaUnit) : 'SQ_FT'
  const builtUp = raw.builtUpArea ? `${raw.builtUpArea.toLocaleString('en-IN')} ${areaUnitStr}` : null
  const carpet = raw.carpetArea ? `${raw.carpetArea.toLocaleString('en-IN')} ${areaUnitStr}` : null
  const plot = raw.plotArea ? `${raw.plotArea.toLocaleString('en-IN')} ${areaUnitStr}` : null

  const specItems = [
    { label: 'Property Type', value: raw.propertyType ? titleCaseEnum(raw.propertyType) : null, icon: Home },
    { label: 'Listing Type', value: raw.listingType === 'FOR_RENT' ? 'For Rent' : raw.listingType === 'FOR_LEASE' ? 'For Lease' : 'For Sale' },
    ...(raw.bedrooms > 0 ? [{ label: 'Bedrooms', value: raw.bedrooms, icon: BedDouble }] : []),
    ...(raw.bathrooms > 0 ? [{ label: 'Bathrooms', value: raw.bathrooms, icon: Bath }] : []),
    ...(raw.balconies > 0 ? [{ label: 'Balconies', value: raw.balconies }] : []),
    { label: 'Built-Up Area', value: builtUp, icon: Ruler },
    { label: 'Carpet Area', value: carpet, icon: Ruler },
    { label: 'Plot Area', value: plot, icon: Ruler },
    { label: 'Furnishing', value: raw.furnishingStatus ? titleCaseEnum(raw.furnishingStatus) : null, icon: Home },
    { label: 'Construction', value: raw.constructionStatus ? titleCaseEnum(raw.constructionStatus) : null, icon: Building2 },
    { label: 'Facing', value: raw.facing ? titleCaseEnum(raw.facing) : null, icon: Compass },
    { label: 'Floor', value: raw.floor != null ? (raw.totalFloors ? `Floor ${raw.floor} of ${raw.totalFloors}` : `Floor ${raw.floor}`) : null, icon: Layers },
    { label: 'Age of Property', value: raw.ageOfProperty != null ? `${raw.ageOfProperty} Year${raw.ageOfProperty > 1 ? 's' : ''}` : null },
    { label: 'City', value: raw.city, icon: MapPin },
    { label: 'Locality', value: raw.locality, icon: MapPin },
    { label: 'Pincode', value: raw.pincode },
    { label: 'Source', value: raw.listingSource ? titleCaseEnum(raw.listingSource) : null },
    { label: 'Status', value: raw.status ? titleCaseEnum(raw.status) : null },
    { label: 'Created At', value: formatDate(raw.createdAt), icon: Clock },
    { label: 'Updated At', value: formatDate(raw.updatedAt), icon: Clock },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  return (
    <DetailLayout
      item={property}
      breadcrumbLabel="Properties"
      breadcrumbTo="/properties"
      badges={[
        { label: `For ${property.purpose}`, variant: property.purpose === 'Rent' ? 'warning' : 'success' },
        { label: property.type, variant: 'neutral' },
        ...(raw.constructionStatus ? [{ label: titleCaseEnum(raw.constructionStatus), variant: 'neutral' }] : []),
      ]}
      specs={specItems}
      description={
        raw.description ||
        `${property.title} is listed on the SwipeDeals marketplace${
          property.location ? ` in ${property.location}` : ''
        }${builtUp ? `, offering ${builtUp} of space` : ''}. Contact the seller directly for ownership documents and viewing details.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">
            {formatCurrencyFull(property.price)}
            {property.purpose === 'Rent' && <span className="text-base font-medium text-text-secondary">/mo</span>}
          </p>
          {raw.negotiable && <p className="mt-1 text-sm font-medium text-success">Price negotiable</p>}
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
