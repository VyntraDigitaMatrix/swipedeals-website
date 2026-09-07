import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Package, ShieldCheck } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import ElectronicsCard from '../components/electronics/ElectronicsCard'
import EmptyState from '../components/common/EmptyState'
import { electronicsService, mapElectronicsToCard } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { formatCurrencyFull } from '../utils/format'

export default function ElectronicsDetails() {
  const { id: slug } = useParams()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    electronicsService
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
    electronicsService
      .getAll({ type: raw.type, size: 7, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSimilarRaw(Array.isArray(content) ? content.filter((e) => e.slug !== raw.slug).slice(0, 6) : [])
      })
      .catch(() => {
        if (!cancelled) setSimilarRaw([])
      })
    return () => { cancelled = true }
  }, [raw])

  const images = usePublicImages(electronicsService.getImages, slug, [PLACEHOLDER_IMAGE])

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-text-secondary">Loading…</div>
  }

  if (notFound || !raw) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Product not found" description="This listing may have been sold or removed." actionLabel="Browse Electronics" actionTo="/electronics" />
      </div>
    )
  }

  const item = { ...mapElectronicsToCard(raw), images, location: '' }
  const similar = similarRaw.map(mapElectronicsToCard)

  return (
    <DetailLayout
      item={item}
      breadcrumbLabel="Electronics"
      breadcrumbTo="/electronics"
      badges={[
        { label: item.category, variant: 'neutral' },
      ]}
      specs={[
        { label: 'Brand', value: item.brand, icon: Package },
        { label: 'Category', value: item.category },
        { label: 'Condition', value: raw.condition === 'NEW' ? 'New (Sealed)' : 'Used', icon: ShieldCheck },
        { label: 'Purchase Year', value: raw.purchaseYear },
        { label: 'Warranty', value: raw.warrantyAvailable ? 'Available' : null },
        { label: 'Original Box', value: raw.boxAvailable ? 'Included' : null },
      ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')}
      description={
        raw.description ||
        `${item.title}, listed on the SwipeDeals marketplace. Contact the seller directly to confirm condition, warranty status and delivery options.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(item.price)}</p>
          {raw.negotiable && <p className="mt-1 text-sm text-text-secondary">Price negotiable</p>}
        </div>
      }
      similar={
        similar.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((e, i) => (
              <ElectronicsCard key={e.id} item={e} index={i} />
            ))}
          </div>
        )
      }
    />
  )
}
