import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, Layers, Package, Shield, Tag, Wrench } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import SparePartCard from '../components/cards/SparePartCard'
import EmptyState from '../components/common/EmptyState'
import { sparePartsService, mapSparePartToCard, extractImages } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE, titleCaseEnum } from '../utils/enumFormat'
import { formatCurrencyFull, formatDate } from '../utils/format'

export default function SparePartDetails() {
  const { id: slug } = useParams()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    sparePartsService
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
    sparePartsService
      .getAll({ category: raw.category, size: 7, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSimilarRaw(Array.isArray(content) ? content.filter((s) => s.slug !== raw.slug).slice(0, 6) : [])
      })
      .catch(() => {
        if (!cancelled) setSimilarRaw([])
      })
    return () => { cancelled = true }
  }, [raw])

  const partImages = extractImages(raw)
  const images = usePublicImages(sparePartsService.getImages, slug, partImages)

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-text-secondary">Loading…</div>
  }

  if (notFound || !raw) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Part not found" description="This listing may have been sold or removed." actionLabel="Browse Spare Parts" actionTo="/spare-parts" />
      </div>
    )
  }

  const mapped = mapSparePartToCard(raw)
  const part = {
    ...mapped,
    images: images.length > 0 && images[0] !== PLACEHOLDER_IMAGE ? images : partImages,
    location: '',
    sellerId: raw.seller?.sellerId || raw.sellerId || mapped.sellerId,
    sellerName: raw.seller?.sellerName || raw.sellerName || mapped.sellerName,
    sellerType: raw.seller?.sellerType || raw.sellerType || mapped.sellerType,
    sellerEmail: raw.seller?.email,
    sellerMobile: raw.seller?.mobileNumber,
    seller: raw.seller,
    rating: raw.seller?.averageRating ?? mapped.rating,
    reviews: raw.seller?.totalReviews ?? mapped.reviews,
  }
  const similar = similarRaw.map(mapSparePartToCard)

  const specItems = [
    { label: 'Brand', value: raw.brand, icon: Package },
    { label: 'Part Number', value: raw.partNumber, icon: Tag },
    { label: 'Category', value: raw.category ? titleCaseEnum(raw.category) : null, icon: Wrench },
    { label: 'Sub Category', value: raw.subCategory, icon: Layers },
    { label: 'Condition', value: raw.condition === 'NEW' ? 'New' : 'Used', icon: Shield },
    { label: 'Negotiable', value: raw.negotiable != null ? (raw.negotiable ? 'Yes' : 'No') : null },
    { label: 'Compatible Brand', value: raw.compatibleVehicleBrand },
    { label: 'Compatible Model', value: raw.compatibleVehicleModel },
    { label: 'Compatible Variant', value: raw.compatibleVehicleVariant },
    { label: 'Source', value: raw.listingSource ? titleCaseEnum(raw.listingSource) : null },
    { label: 'Status', value: raw.status ? titleCaseEnum(raw.status) : null },
    { label: 'Created At', value: formatDate(raw.createdAt), icon: Clock },
    { label: 'Updated At', value: formatDate(raw.updatedAt), icon: Clock },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  return (
    <DetailLayout
      item={part}
      breadcrumbLabel="Spare Parts"
      breadcrumbTo="/spare-parts"
      badges={[
        { label: raw.condition === 'NEW' ? 'New' : 'Used', variant: raw.condition === 'NEW' ? 'success' : 'neutral' },
        ...(raw.category ? [{ label: titleCaseEnum(raw.category), variant: 'neutral', icon: Wrench }] : []),
        ...(raw.listingSource ? [{ label: titleCaseEnum(raw.listingSource), variant: 'neutral' }] : []),
      ]}
      specs={specItems}
      description={
        raw.description ||
        `${part.brand ? `Genuine ${part.brand} ` : ''}${part.title}, listed on the SwipeDeals marketplace. Contact the seller directly to confirm fitment and availability.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(part.price)}</p>
          {raw.negotiable && <p className="mt-1 text-sm font-medium text-success">Price negotiable</p>}
        </div>
      }
      similar={
        similar.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s, i) => (
              <SparePartCard key={s.id} part={s} index={i} />
            ))}
          </div>
        )
      }
    />
  )
}
