import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Fuel, Gauge, Palette, Settings2, Users } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import Carousel from '../components/common/Carousel'
import VehicleCard from '../components/vehicle/VehicleCard'
import LoanCalculator from '../components/vehicle/LoanCalculator'
import EmptyState from '../components/common/EmptyState'
import { vehicleService, mapVehicleToCarCard } from '../services/publicListingService'
import { usePublicImages } from '../hooks/usePublicImages'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { formatCurrencyFull } from '../utils/format'

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

  const images = usePublicImages(vehicleService.getImages, slug, [PLACEHOLDER_IMAGE])

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

  const car = { ...mapVehicleToCarCard(raw), images, location: '', color: raw.color }
  const similar = similarRaw.map(mapVehicleToCarCard)

  // Every row here comes straight from the backend's VehicleResponse — no
  // fabricated specs, features or inspection data.
  const specItems = [
    { label: 'Year', value: car.year, icon: Calendar },
    { label: 'Odometer', value: car.km != null ? `${car.km.toLocaleString('en-IN')} km` : null, icon: Gauge },
    { label: 'Fuel Type', value: car.fuel, icon: Fuel },
    { label: 'Transmission', value: car.transmission, icon: Settings2 },
    { label: 'Owners', value: car.owners ? `${car.owners} Owner${car.owners > 1 ? 's' : ''}` : 'First Owner', icon: Users },
    { label: 'Colour', value: car.color, icon: Palette },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  return (
    <DetailLayout
      item={car}
      breadcrumbLabel="Cars"
      breadcrumbTo="/cars"
      badges={[
        { label: car.condition === 'new' ? 'New' : 'Used', variant: car.condition === 'new' ? 'success' : 'neutral' },
      ]}
      specs={specItems}
      description={
        raw.description ||
        `This ${car.year} ${car.title} is listed on the SwipeDeals marketplace${
          car.km != null ? ` with ${car.km.toLocaleString('en-IN')} km on the odometer` : ''
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
