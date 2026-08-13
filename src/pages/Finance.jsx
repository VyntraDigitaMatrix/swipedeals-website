import { useRef, useState } from 'react'
import {
  Banknote, Briefcase, CheckCircle2, Clock, IndianRupee, Landmark, MapPin, Percent, Phone, User, Wallet,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'
import LoanCalculator from '../components/vehicle/LoanCalculator'
import { financePartners, financeEligibility } from '../data/vehicleServices'
import { formatCurrencyFull } from '../utils/format'

const HIGHLIGHTS = [
  { icon: Percent, label: 'Rates from 8.5% p.a.' },
  { icon: Wallet, label: 'Funding up to 90%' },
  { icon: Clock, label: 'Approval in 30 minutes' },
]

const EMPLOYMENT_OPTIONS = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'business', label: 'Business Owner' },
]

export default function Finance() {
  const [price, setPrice] = useState(1000000)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '', employment: '', income: '', loanAmount: '', bank: '' })
  const applyRef = useRef(null)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleCheckEligibility = (bankId) => {
    update('bank', bankId)
    applyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-page py-8">
        <SuccessScreen
          title="Application Received!"
          description={`Thanks, ${form.name || 'there'}! Our finance partner will review your application and contact you at ${form.phone || 'your registered number'} within 24 hours.`}
          actions={[{ label: 'Back to Home', to: '/' }, { label: 'Browse Cars', to: '/cars', variant: 'outline' }]}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'Car Finance' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Landmark size={13} aria-hidden="true" /> Car Finance Made Easy
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Drive home today, pay later</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Get instant loan offers from India&rsquo;s leading banks and NBFCs — compare rates, calculate your EMI
          and apply online in minutes.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {HIGHLIGHTS.map((h) => (
            <span key={h.label} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary sm:text-sm">
              <h.icon size={15} className="text-success" aria-hidden="true" />
              {h.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="mb-5 rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <Input
            label="On-Road Car Price"
            icon={IndianRupee}
            type="number"
            value={price}
            onChange={(e) => setPrice(Math.max(Number(e.target.value) || 0, 100000))}
            hint="Adjust this to match the car you're financing."
          />
        </div>
        <LoanCalculator key={price} price={price} />
      </div>

      <div className="mx-auto mt-14 max-w-5xl">
        <h2 className="mb-5 text-center text-lg font-bold text-text sm:text-xl">Compare our finance partners</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {financePartners.map((bank) => (
            <div key={bank.id} className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                  {bank.name.charAt(0)}
                </span>
                <p className="font-bold text-text">{bank.name}</p>
              </div>
              <dl className="flex-1 space-y-2 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <dt>Interest Rate</dt>
                  <dd className="font-semibold text-text">from {bank.rateFrom}% p.a.</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Max Tenure</dt>
                  <dd className="font-semibold text-text">{bank.maxTenure} months</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Processing Fee</dt>
                  <dd className="font-semibold text-text">{bank.processingFee}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Max Funding</dt>
                  <dd className="font-semibold text-text">{bank.maxFunding}</dd>
                </div>
              </dl>
              <Button variant="outline" size="sm" fullWidth className="mt-4" onClick={() => handleCheckEligibility(bank.id)}>
                Check Eligibility
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border bg-surface-alt/60 p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-text">Eligibility criteria</h2>
        <ul className="space-y-3">
          {financeEligibility.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <form
        ref={applyRef}
        onSubmit={handleSubmit}
        className="mx-auto mt-14 max-w-xl scroll-mt-24 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
      >
        <h2 className="mb-1 text-lg font-bold text-text">Apply for a car loan</h2>
        <p className="mb-6 text-sm text-text-secondary">Takes less than 2 minutes — no impact on your credit score.</p>
        <div className="space-y-5">
          <Input label="Full Name" icon={User} placeholder="e.g. Aditya Kapoor" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number" type="tel" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
            <Input label="City" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Dropdown label="Employment Type" value={form.employment} onChange={(v) => update('employment', v)} placeholder="Select type" options={EMPLOYMENT_OPTIONS} />
            <Input label="Monthly Income" icon={Wallet} type="number" placeholder="50000" value={form.income} onChange={(e) => update('income', e.target.value)} required />
          </div>
          <Input label="Desired Loan Amount" icon={Banknote} type="number" placeholder={String(Math.round(price * 0.8))} value={form.loanAmount} onChange={(e) => update('loanAmount', e.target.value)} required />
          <Dropdown
            label="Preferred Bank / NBFC"
            value={form.bank}
            onChange={(v) => update('bank', v)}
            placeholder="Select a partner"
            options={financePartners.map((b) => ({ value: b.id, label: `${b.name} — from ${b.rateFrom}% p.a.` }))}
          />
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth icon={Briefcase} className="mt-7">
          Submit Application
        </Button>
        <p className="mt-3 text-center text-[11px] text-text-light">{formatCurrencyFull(price)} on-road price used for reference.</p>
      </form>
    </div>
  )
}
