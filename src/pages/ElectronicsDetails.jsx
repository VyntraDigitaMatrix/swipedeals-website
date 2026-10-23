import { useEffect, useState } from 'react'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import { Clock, Laptop, Package, ShieldCheck, Tag } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import ElectronicsCard from '../components/electronics/ElectronicsCard'
import EmptyState from '../components/common/EmptyState'
import { electronicsService, mapElectronicsToCard, extractImages } from '../services/publicListingService'
import { electronicsListingService } from '../services/electronicsListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { useAuth } from '../hooks/useAuth'
import { PLACEHOLDER_IMAGE, titleCaseEnum } from '../utils/enumFormat'
import { formatCurrencyFull, formatDate } from '../utils/format'

export default function ElectronicsDetails() {
  const { id: slug } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    const fetchElectronics = async () => {
      let data = null
      try {
        const res = await electronicsService.getBySlug(slug)
        const candidate = (res?.data && typeof res.data === 'object' && (res.data.slug || res.data.id || res.data.title)) ? res.data : res
        if (candidate && (candidate.slug || candidate.id || candidate.title)) {
          data = candidate
        }
      } catch (e) {
        // Public endpoint failed
      }

      if (!data) {
        try {
          const sellerRes = await electronicsListingService.getBySlug(slug)
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

    fetchElectronics().finally(() => {
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

  const elecImages = extractImages(raw)
  const images = usePublicImages(electronicsService.getImages, slug, elecImages)

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

  const mapped = mapElectronicsToCard(raw)
  const item = {
    ...mapped,
    productType: 'ELECTRONICS',
    images: images.length > 0 && images[0] !== PLACEHOLDER_IMAGE ? images : elecImages,
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
  const similar = similarRaw.map(mapElectronicsToCard)

  const specItems = [
    { label: 'Brand', value: raw.brand, icon: Package },
    { label: 'Model', value: raw.model, icon: Tag },
    { label: 'Category', value: raw.type ? titleCaseEnum(raw.type) : raw.category ? titleCaseEnum(raw.category) : null, icon: Laptop },
    { label: 'Condition', value: raw.condition === 'NEW' ? 'New (Sealed)' : 'Used', icon: ShieldCheck },
    { label: 'Purchase Year', value: raw.purchaseYear },
    { label: 'Warranty', value: raw.warrantyAvailable != null ? (raw.warrantyAvailable ? 'Available' : 'No') : null },
    { label: 'Original Bill', value: raw.billAvailable != null ? (raw.billAvailable ? 'Included' : 'Not Included') : null },
    { label: 'Original Box', value: raw.boxAvailable != null ? (raw.boxAvailable ? 'Included' : 'Not Included') : null },
    { label: 'Negotiable', value: raw.negotiable != null ? (raw.negotiable ? 'Yes' : 'No') : null },
    { label: 'Source', value: raw.listingSource ? titleCaseEnum(raw.listingSource) : null },
    { label: 'Status', value: raw.status ? titleCaseEnum(raw.status) : null },
    { label: 'Rejection Reason', value: raw.rejectionReason },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  const isFromSell =
    location.state?.from === '/sell/electronics' ||
    location.state?.from?.startsWith('/sell') ||
    searchParams.get('from') === 'sell' ||
    searchParams.get('source') === 'sell' ||
    raw?.status === 'DRAFT' ||
    raw?.status === 'PENDING_APPROVAL' ||
    raw?.status === 'UNDER_REVIEW' ||
    Boolean(user?.id && raw?.seller?.sellerId && String(raw?.seller?.sellerId) === String(user?.id))

  const breadcrumbTo = isFromSell ? '/sell/electronics' : '/electronics'

  return (
    <DetailLayout
      item={item}
      breadcrumbLabel="Electronics"
      breadcrumbTo={breadcrumbTo}
      badges={[
        { label: raw.condition === 'NEW' ? 'New' : 'Used', variant: raw.condition === 'NEW' ? 'success' : 'neutral' },
        ...(raw.type ? [{ label: titleCaseEnum(raw.type), variant: 'neutral' }] : []),
      ]}
      specs={specItems}
      description={
        raw.description ||
        `${item.title}, listed on the SwipeDeals marketplace. Contact the seller directly to confirm condition, warranty status and delivery options.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(item.price)}</p>
          {raw.negotiable && <p className="mt-1 text-sm font-medium text-success">Price negotiable</p>}
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
