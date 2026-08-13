import { useState } from 'react'
import {
  BadgeCheck, Banknote, Calendar, FileSearch, IdCard, MapPin, Palette, ShieldCheck, Sparkles, Tag,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Badge from '../components/common/Badge'
import Button from '../components/buttons/Button'
import RegNumberInput from '../components/services/RegNumberInput'
import { deriveVehicleDetails, isValidRegNumber } from '../data/vehicleServices'

export default function VehicleInfo() {
  const [regNumber, setRegNumber] = useState('')
  const [error, setError] = useState('')
  const [details, setDetails] = useState(null)

  const handleLookup = (e) => {
    e.preventDefault()
    if (!isValidRegNumber(regNumber)) {
      setError('Enter a valid registration number, e.g. MH12AB1234.')
      return
    }
    setError('')
    setDetails(deriveVehicleDetails(regNumber))
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'RC / Vehicle Details' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-info/10 px-4 py-1.5 text-xs font-bold text-info">
          <FileSearch size={13} aria-hidden="true" /> Instant RC Lookup
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Get complete vehicle details</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Enter any registration number to instantly view registration, ownership, insurance and compliance
          details — useful before buying a used car or verifying your own vehicle.
        </p>
      </div>

      <form onSubmit={handleLookup} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <RegNumberInput value={regNumber} onChange={setRegNumber} error={error} />
        <Button type="submit" variant="primary" size="lg" fullWidth className="mt-5">
          Get Vehicle Details
        </Button>
      </form>

      {!details && (
        <div className="mx-auto mt-10 flex max-w-xl items-start gap-3 rounded-xl border border-info/25 bg-info/5 p-4 text-xs text-text-secondary">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          This is a demo lookup — results are simulated for illustration and no real government database is
          contacted.
        </div>
      )}

      {details && (
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Registration Number</p>
              <p className="mt-1 text-2xl font-extrabold tracking-wider text-white">{details.regNumber}</p>
              <p className="mt-1 text-sm text-white/75">{details.make} {details.model} &middot; {details.fuelType}</p>
            </div>
            <Badge variant="success" icon={ShieldCheck} className="bg-white/95">
              RC {details.rcStatus}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoGroup
              title="Registration Details"
              icon={IdCard}
              rows={[
                ['Owner Name', details.ownerName],
                ['Registration Date', details.registrationDate],
                ['RTO Office', details.rtoOffice],
                ['RTO Code', details.rtoCode],
                ['State', details.stateName],
              ]}
            />
            <InfoGroup
              title="Vehicle Specifications"
              icon={Tag}
              rows={[
                ['Make & Model', `${details.make} ${details.model}`],
                ['Fuel Type', details.fuelType],
                ['Colour', details.color],
                ['Vehicle Class', details.vehicleClass],
                ['Chassis No.', details.chassisNumber],
                ['Engine No.', details.engineNumber],
              ]}
            />
            <InfoGroup
              title="Compliance & Validity"
              icon={Calendar}
              rows={[
                ['Insurance Valid Till', details.insuranceValidTill, details.insuranceExpired ? 'danger' : 'success'],
                ['PUC Valid Till', details.pucValidTill, details.pucExpired ? 'danger' : 'success'],
                ['Fitness Valid Till', details.fitnessValidTill],
              ]}
            />
            <InfoGroup
              title="Financier"
              icon={Banknote}
              rows={[
                ['Hypothecation', details.financier ? details.financier : 'None'],
                ['Loan Status', details.financier ? 'Active' : 'No Active Loan'],
              ]}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-center shadow-soft sm:p-8">
            <p className="flex items-center justify-center gap-2 text-sm font-bold text-text">
              <Palette size={16} className="text-primary" aria-hidden="true" />
              Own this car and thinking of selling it?
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-xs text-text-secondary">
              Get an instant, no-obligation valuation or list it for sale to thousands of verified buyers.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button to="/sell/car/verify" variant="primary" icon={BadgeCheck}>
                Get Instant Valuation
              </Button>
              <Button to="/sell?category=cars" variant="outline" icon={MapPin}>
                List This Car
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoGroup({ title, icon: Icon, rows }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary">
        <Icon size={14} aria-hidden="true" /> {title}
      </p>
      <dl className="space-y-2.5">
        {rows.map(([label, value, variant]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-text-secondary">{label}</dt>
            <dd className={variant ? undefined : 'text-right font-semibold text-text'}>
              {variant ? <Badge variant={variant}>{value}</Badge> : value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
