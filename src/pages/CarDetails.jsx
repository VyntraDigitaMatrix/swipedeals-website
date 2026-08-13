import { useParams } from 'react-router-dom'
import {
  BadgeCheck, Calendar, CheckCircle2, Fuel, Gauge, Palette, Settings2, ShieldCheck, Users,
} from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import Carousel from '../components/common/Carousel'
import VehicleCard from '../components/vehicle/VehicleCard'
import LoanCalculator from '../components/vehicle/LoanCalculator'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import { cars, getCarById } from '../data/cars'
import { formatCurrencyFull } from '../utils/format'
import { deriveCarSpecs } from '../utils/carSpecs'

const INSPECTION_VARIANT = { Excellent: 'success', Good: 'info', Fair: 'warning' }

export default function CarDetails() {
  const { id } = useParams()
  const car = getCarById(id)

  if (!car) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Car not found" description="This listing may have been sold or removed." actionLabel="Browse Cars" actionTo="/cars" />
      </div>
    )
  }

  const specs = deriveCarSpecs(car)
  const similar = cars.filter((c) => c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType)).slice(0, 6)

  return (
    <DetailLayout
      item={car}
      breadcrumbLabel="Cars"
      breadcrumbTo="/cars"
      badges={[
        { label: car.condition === 'new' ? 'New' : 'Used', variant: car.condition === 'new' ? 'success' : 'neutral' },
        ...(car.verified ? [{ label: 'Verified', variant: 'info', icon: BadgeCheck }] : []),
      ]}
      specs={[
        { label: 'Year', value: car.year, icon: Calendar },
        { label: 'Odometer', value: `${car.km.toLocaleString('en-IN')} km`, icon: Gauge },
        { label: 'Fuel Type', value: car.fuel, icon: Fuel },
        { label: 'Transmission', value: car.transmission, icon: Settings2 },
        { label: 'Owners', value: car.owners || 'First Owner', icon: Users },
        { label: 'Body Type', value: car.bodyType },
      ]}
      description={`This ${car.year} ${car.title} is available in excellent condition with ${car.km.toLocaleString('en-IN')} km on the odometer. Every SwipeDeals vehicle listing goes through a rigorous ${specs.inspectionReport.length}-point verification process covering engine health, body condition, interior quality and documentation — so you can buy with complete confidence.`}
      priceBlock={
        <div>
          <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(car.price)}</p>
          <p className="mt-1 text-sm text-text-secondary">EMI starting at {formatCurrencyFull(car.emi)}/month</p>
        </div>
      }
      similar={
        <Carousel>
          {similar.map((c, i) => (
            <VehicleCard key={c.id} car={c} index={i} />
          ))}
        </Carousel>
      }
    >
      {/* Full specifications — grouped, Spinny/Cars24 style */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-text">Full Specifications</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <SpecGroup
            title="Engine & Performance"
            rows={[
              ['Engine Displacement', specs.engineCC],
              ['Power', specs.power],
              [specs.mileageLabel, specs.mileage],
              ...(specs.battery ? [['Battery', specs.battery]] : []),
              ['Transmission', car.transmission],
              ['Fuel Type', car.fuel],
            ]}
          />
          <SpecGroup
            title="Dimensions & Capacity"
            rows={[
              ['Seating Capacity', specs.seating],
              ['Boot Space', specs.bootSpace],
              ['Ground Clearance', specs.groundClearance],
              ['Fuel Tank Capacity', specs.fuelTank],
              ['Body Type', car.bodyType],
              ['Colour', specs.color],
            ]}
          />
          <SpecGroup
            title="Registration & Ownership"
            rows={[
              ['Registration Year', car.year],
              ['RTO', specs.rto],
              ['Ownership', car.owners ? `${car.owners} Owner${car.owners > 1 ? 's' : ''}` : 'First Owner'],
              ['Insurance Valid Till', specs.insuranceValidTill],
              ['Odometer Reading', `${car.km.toLocaleString('en-IN')} km`],
              ['Location', car.location],
            ]}
          />
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary">
              <Palette size={13} aria-hidden="true" /> Exterior Colour
            </p>
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 shrink-0 rounded-full border border-border bg-gradient-hero" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-text">{specs.color}</p>
                <p className="text-xs text-text-secondary">Single owner, factory paint</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-text">Features & Comfort</h2>
        <div className="flex flex-wrap gap-2">
          {specs.features.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface-alt/60 px-3 py-1.5 text-xs font-semibold text-text"
            >
              <CheckCircle2 size={13} className="text-success" aria-hidden="true" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Inspection report */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">{specs.inspectionReport.length}-Point Inspection Report</h2>
          <Badge variant="success" icon={ShieldCheck}>{specs.inspectionScore} Passed</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specs.inspectionReport.map((item) => (
            <div key={item.category} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5">
              <span className="text-sm font-medium text-text">{item.category}</span>
              <Badge variant={INSPECTION_VARIANT[item.status]}>{item.status}</Badge>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Every SwipeDeals car is inspected across {specs.inspectionReport.length} checkpoints by certified evaluators before listing.
        </p>
      </div>

      {/* Loan / EMI calculator */}
      <div className="mt-10">
        <LoanCalculator price={car.price} />
      </div>
    </DetailLayout>
  )
}

function SpecGroup({ title, rows }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">{title}</p>
      <dl className="space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-text-secondary">{label}</dt>
            <dd className="text-right font-semibold text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
