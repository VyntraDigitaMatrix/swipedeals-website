import { useParams } from 'react-router-dom'
import { BadgeCheck, Calendar, Gauge, Package, Truck } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import CommercialVehicleCard from '../components/vehicle/CommercialVehicleCard'
import EmptyState from '../components/common/EmptyState'
import { commercialVehicles, getCommercialVehicleById } from '../data/commercialVehicles'
import { formatCurrencyFull } from '../utils/format'

export default function CommercialVehicleDetails() {
  const { id } = useParams()
  const vehicle = getCommercialVehicleById(id)

  if (!vehicle) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Vehicle not found" description="This listing may have been sold or removed." actionLabel="Browse Commercial Vehicles" actionTo="/commercial-vehicles" />
      </div>
    )
  }

  const similar = commercialVehicles.filter((v) => v.id !== vehicle.id && v.type === vehicle.type).slice(0, 6)

  return (
    <DetailLayout
      item={vehicle}
      breadcrumbLabel="Commercial Vehicles"
      breadcrumbTo="/commercial-vehicles"
      badges={[
        { label: vehicle.condition === 'new' ? 'New' : 'Used', variant: vehicle.condition === 'new' ? 'success' : 'neutral' },
        { label: vehicle.type, variant: 'neutral', icon: Truck },
        ...(vehicle.verified ? [{ label: 'Verified', variant: 'info', icon: BadgeCheck }] : []),
      ]}
      specs={[
        { label: 'Year', value: vehicle.year, icon: Calendar },
        { label: 'Capacity', value: vehicle.capacity, icon: Package },
        { label: 'Odometer', value: `${vehicle.km.toLocaleString('en-IN')} km`, icon: Gauge },
        { label: 'Type', value: vehicle.type, icon: Truck },
      ]}
      description={`This ${vehicle.year} ${vehicle.title} is well-maintained and ready for immediate deployment. All commercial vehicle listings on SwipeDeals include verified registration documents, service history and a comprehensive mechanical inspection report.`}
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(vehicle.price)}</p>
          <p className="mt-1 text-sm text-text-secondary">EMI starting at {formatCurrencyFull(vehicle.emi)}/month</p>
        </div>
      }
      similar={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((v, i) => (
            <CommercialVehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      }
    />
  )
}
