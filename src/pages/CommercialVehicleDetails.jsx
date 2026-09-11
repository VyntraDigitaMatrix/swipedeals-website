import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, Fuel, Gauge, Truck } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import CommercialVehicleCard from '../components/vehicle/CommercialVehicleCard'
import EmptyState from '../components/common/EmptyState'
import { vehicleService, mapVehicleToCommercialCard, extractImages } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { formatCurrencyFull, formatDate } from '../utils/format'

export default function CommercialVehicleDetails() {
  const { id: slug } = useParams()

  const [raw, setRaw] = useState(null)
  const [similarRaw, setSimilarRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    vehicleService
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
    vehicleService
      .getAll({ type: 'TRUCK', size: 7, sort: 'createdAt,desc' })
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
        <EmptyState title="Vehicle not found" description="This listing may have been sold or removed." actionLabel="Browse Commercial Vehicles" actionTo="/commercial-vehicles" />
      </div>
    )
  }

  const mapped = mapVehicleToCommercialCard(raw)
  const vehicle = {
    ...mapped,
    images: images.length > 0 && images[0] !== PLACEHOLDER_IMAGE ? images : carImages,
    location: '',
  }
  const similar = similarRaw.map(mapVehicleToCommercialCard)

  const specItems = [
    { label: 'Brand', value: vehicle.brand, icon: Truck },
    { label: 'Model', value: raw.model, icon: Truck },
    { label: 'Variant', value: raw.variant ? raw.variant.trim() : null, icon: Truck },
    { label: 'Year', value: vehicle.year, icon: Calendar },
    { label: 'Odometer', value: vehicle.km != null ? `${vehicle.km.toLocaleString('en-IN')} km` : null, icon: Gauge },
    { label: 'Fuel Type', value: vehicle.fuel, icon: Fuel },
    { label: 'Transmission', value: vehicle.transmission, icon: Truck },
    { label: 'Owners', value: raw.ownersCount ? `${raw.ownersCount} Owner${raw.ownersCount > 1 ? 's' : ''}` : '1st Owner', icon: Truck },
    { label: 'Colour', value: raw.color, icon: Truck },
    { label: 'Reg. Number', value: raw.registrationNumber, icon: Truck },
    { label: 'Chassis No.', value: raw.chassisNumber, icon: Truck },
    { label: 'VIN', value: raw.vin, icon: Truck },
    { label: 'Created At', value: formatDate(raw.createdAt), icon: Clock },
    { label: 'Updated At', value: formatDate(raw.updatedAt), icon: Clock },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  return (
    <DetailLayout
      item={vehicle}
      breadcrumbLabel="Commercial Vehicles"
      breadcrumbTo="/commercial-vehicles"
      badges={[
        {
          label: vehicle.condition === 'new' ? 'New' : vehicle.condition === 'like-new' ? 'Like New' : 'Used',
          variant: vehicle.condition === 'new' ? 'success' : vehicle.condition === 'like-new' ? 'info' : 'neutral',
        },
        { label: vehicle.type, variant: 'neutral', icon: Truck },
      ]}
      specs={specItems}
      description={
        raw.description ||
        `This ${vehicle.year} ${vehicle.title} is listed on the SwipeDeals marketplace and ready for immediate deployment. Contact the seller directly for registration documents, service history and inspection details.`
      }
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(vehicle.price)}</p>
        </div>
      }
      similar={
        similar.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v, i) => (
              <CommercialVehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        )
      }
    />
  )
}
