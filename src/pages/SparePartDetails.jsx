import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Package, Wrench } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import SparePartCard from '../components/cards/SparePartCard'
import EmptyState from '../components/common/EmptyState'
import { sparePartsService, mapSparePartToCard } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { formatCurrencyFull } from '../utils/format'

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

  const images = usePublicImages(sparePartsService.getImages, slug, [PLACEHOLDER_IMAGE])

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

  const part = { ...mapSparePartToCard(raw), images, location: '' }
  const similar = similarRaw.map(mapSparePartToCard)

  const compatibleWith = [raw.compatibleVehicleBrand, raw.compatibleVehicleModel, raw.compatibleVehicleVariant]
    .filter(Boolean)
    .join(' ')

  return (
    <DetailLayout
      item={part}
      breadcrumbLabel="Spare Parts"
      breadcrumbTo="/spare-parts"
      badges={[
        { label: part.category, variant: 'neutral', icon: Wrench },
      ]}
      specs={[
        { label: 'Brand', value: part.brand, icon: Package },
        { label: 'Category', value: part.category, icon: Wrench },
        { label: 'Condition', value: raw.condition === 'NEW' ? 'New' : 'Used' },
        { label: 'Part Number', value: raw.partNumber },
        { label: 'Compatible With', value: compatibleWith || null },
      ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')}
      description={
        raw.description ||
        `${part.brand ? `Genuine ${part.brand} ` : ''}${part.title}, listed on the SwipeDeals marketplace. Contact the seller directly to confirm fitment and availability.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(part.price)}</p>
          {raw.negotiable && <p className="mt-1 text-sm text-text-secondary">Price negotiable</p>}
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
