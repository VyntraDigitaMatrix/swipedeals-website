import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, FileText, Fuel, Gauge, Hash, Palette, Settings2, Shield, Users } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import Carousel from '../components/common/Carousel'
import VehicleCard from '../components/vehicle/VehicleCard'
import LoanCalculator from '../components/vehicle/LoanCalculator'
import EmptyState from '../components/common/EmptyState'
import { vehicleService, mapVehicleToCarCard, extractImages } from '../services/publicListingService'
import { vehicleListingService } from '../services/vehicleListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { formatCurrencyFull, formatDate } from '../utils/format'

export default function CarDetails() {
  const { id: slug } = useParams()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    const fetchVehicle = async () => {
      let data = null
      // 1. Try public endpoint first
      try {
        const res = await vehicleService.getBySlug(slug)
        const candidate = (res?.data && typeof res.data === 'object' && (res.data.slug || res.data.id || res.data.brand)) ? res.data : res
        if (candidate && (candidate.slug || candidate.id || candidate.brand)) {
          data = candidate
        }
      } catch (e) {
        // Public API failed (e.g. listing is UNDER_REVIEW, DRAFT, etc.)
      }

      // 2. If public fetch failed, try authenticated seller listing endpoint
      if (!data) {
        try {
          const sellerRes = await vehicleListingService.getBySlug(slug)
          const candidate = (sellerRes?.data && typeof sellerRes.data === 'object' && (sellerRes.data.slug || sellerRes.data.id || sellerRes.data.brand)) ? sellerRes.data : sellerRes
          if (candidate && (candidate.slug || candidate.id || candidate.brand)) {
            data = candidate
          }
        } catch (e) {
          // Seller service failed as well
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

    fetchVehicle().finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!raw) return
    let cancelled = false
    vehicleService
      .getAll({ type: raw.vehicleType, size: 7, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSimilarRaw(Array.isArray(content) ? content.filter((v) => v.slug !== raw.slug).slice(0, 6) : [])
      })
      .catch(() => {
        if (!cancelled) setSimilarRaw([])
      })
    return () => { cancelled = true }
  }, [raw])

  const carImages = extractImages(raw)
  const images = usePublicImages(vehicleService.getImages, slug, carImages)

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-text-secondary">Loading…</div>
  }

  if (notFound || !raw) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Car not found" description="This listing may have been sold or removed." actionLabel="Browse Cars" actionTo="/cars" />
      </div>
    )
  }

  const mapped = mapVehicleToCarCard(raw)
  const car = {
    ...mapped,
    slug: mapped?.slug || raw?.slug || slug,
    id: mapped?.id || raw?.id || slug,
    images: images.length > 0 && images[0] !== PLACEHOLDER_IMAGE ? images : carImages,
    location: '',
    color: raw.color || mapped.color,
    sellerId: raw.seller?.sellerId || raw.sellerId || mapped.sellerId,
    sellerName: raw.seller?.sellerName || raw.sellerName || mapped.sellerName,
    sellerType: raw.seller?.sellerType || raw.sellerType || mapped.sellerType,
    sellerEmail: raw.seller?.email,
    sellerMobile: raw.seller?.mobileNumber,
    seller: raw.seller,
    rating: raw.seller?.averageRating ?? mapped.rating,
    reviews: raw.seller?.totalReviews ?? mapped.reviews,
  }
  const similar = similarRaw.map(mapVehicleToCarCard)

  // Specs strictly mapped from public-vehicle-controller API fields
  const specItems = [
    { label: 'Brand', value: car.brand, icon: Calendar },
    { label: 'Model', value: raw.model, icon: FileText },
    { label: 'Variant', value: raw.variant ? raw.variant.trim() : null, icon: Settings2 },
    { label: 'Year', value: car.year, icon: Calendar },
    { label: 'Odometer', value: car.km != null ? `${car.km.toLocaleString('en-IN')} km` : null, icon: Gauge },
    { label: 'Fuel Type', value: car.fuel, icon: Fuel },
    { label: 'Transmission', value: car.transmission, icon: Settings2 },
    { label: 'Owners', value: raw.ownersCount ? `${raw.ownersCount} Owner${raw.ownersCount > 1 ? 's' : ''}` : '1st Owner', icon: Users },
    { label: 'Colour', value: car.color, icon: Palette },
    { label: 'Reg. Number', value: raw.registrationNumber, icon: FileText },
    { label: 'Chassis No.', value: raw.chassisNumber, icon: Shield },
    { label: 'VIN', value: raw.vin, icon: Hash },
    { label: 'Created At', value: formatDate(raw.createdAt), icon: Clock },
    { label: 'Updated At', value: formatDate(raw.updatedAt), icon: Clock },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  return (
    <DetailLayout
      item={car}
      breadcrumbLabel="Cars"
      breadcrumbTo="/cars"
      badges={[
        {
          label: car.condition === 'new' ? 'New' : car.condition === 'like-new' ? 'Like New' : 'Used',
          variant: car.condition === 'new' ? 'success' : car.condition === 'like-new' ? 'info' : 'neutral',
        },
        ...(raw.status ? [{ label: raw.status, variant: 'neutral' }] : []),
      ]}
      specs={specItems}
      description={
        raw.description ||
        `This ${car.year} ${car.title} is listed on the SwipeDeals marketplace${car.km != null ? ` with ${car.km.toLocaleString('en-IN')} km on the odometer` : ''
        }. Contact the seller directly for a closer look, full documentation and a test drive.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(car.price)}</p>
        </div>
      }
      similar={
        similar.length > 0 && (
          <Carousel>
            {similar.map((c, i) => (
              <VehicleCard key={c.id} car={c} index={i} />
            ))}
          </Carousel>
        )
      }
      belowContact={<LoanCalculator price={car.price} />}
    />
  )
}
