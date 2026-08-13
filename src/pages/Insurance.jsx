import { useRef, useState } from 'react'
import { Car, CheckCircle2, MapPin, Phone, ShieldCheck, Sparkles, Umbrella, Wrench } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Badge from '../components/common/Badge'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import { insurancePlans, insurancePartners, estimatePremium, isValidRegNumber, normalizeRegNumber } from '../data/vehicleServices'
import { formatCurrencyFull } from '../utils/format'
import { cn } from '../utils/cn'

const TRUST_POINTS = [
  { icon: Wrench, label: '10,000+ Cashless Garages' },
  { icon: ShieldCheck, label: '98.5% Claim Settlement Ratio' },
  { icon: CheckCircle2, label: 'IRDAI-Registered Partners' },
]

export default function Insurance() {
  const [selectedPlan, setSelectedPlan] = useState('comprehensive')
  const [form, setForm] = useState({ regNumber: '', phone: '', city: '' })
  const [error, setError] = useState('')
  const [quote, setQuote] = useState(null)
  const formRef = useRef(null)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleGetQuote = (planId) => {
    setSelectedPlan(planId)
    setQuote(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValidRegNumber(form.regNumber)) {
      setError('Enter a valid registration number, e.g. MH12AB1234.')
      return
    }
    setError('')
    const plan = insurancePlans.find((p) => p.id === selectedPlan)
    setQuote(estimatePremium(normalizeRegNumber(form.regNumber), plan.priceFrom))
  }

  const plan = insurancePlans.find((p) => p.id === selectedPlan)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'Car Insurance' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-info/10 px-4 py-1.5 text-xs font-bold text-info">
          <Umbrella size={13} aria-hidden="true" /> Insure in Minutes
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Protect your car, the smart way</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Compare plans from India&rsquo;s top insurers, get an instant premium estimate and never miss a renewal
          again.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {TRUST_POINTS.map((point) => (
            <span key={point.label} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary sm:text-sm">
              <point.icon size={15} className="text-success" aria-hidden="true" />
              {point.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
        {insurancePlans.map((p) => (
          <div
            key={p.id}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-surface p-6 shadow-soft',
              p.popular ? 'border-primary shadow-lift' : 'border-border'
            )}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-white">
                Most Popular
              </span>
            )}
            <h2 className="text-lg font-extrabold text-text">{p.name}</h2>
            <p className="mt-1 text-xs text-text-secondary">{p.tagline}</p>
            <p className="mt-4 text-2xl font-extrabold text-text">
              {formatCurrencyFull(p.priceFrom)}<span className="text-sm font-medium text-text-secondary">/year onwards</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.coverage.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <Button
              variant={p.popular ? 'primary' : 'outline'}
              fullWidth
              className="mt-6"
              onClick={() => handleGetQuote(p.id)}
            >
              Get Quote
            </Button>
          </div>
        ))}
      </div>

      <div ref={formRef} className="mx-auto mt-14 max-w-xl scroll-mt-24">
        {!quote ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="mb-1 text-lg font-bold text-text">Get your premium estimate</h2>
            <p className="mb-6 text-sm text-text-secondary">
              Selected plan: <span className="font-semibold text-primary">{plan.name}</span>
            </p>
            <div className="space-y-5">
              <Input
                label="Vehicle Registration Number"
                icon={Car}
                placeholder="e.g. MH12AB1234"
                value={form.regNumber}
                onChange={(e) => update('regNumber', normalizeRegNumber(e.target.value).slice(0, 10))}
                error={error}
                className="uppercase tracking-wider"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone Number" type="tel" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                <Input label="City" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} required />
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth className="mt-7">
              Get Instant Premium
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center shadow-soft sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <ShieldCheck size={30} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-text">Your {plan.name} estimate is ready</h2>
            <p className="mt-1 text-xs text-text-secondary">For {normalizeRegNumber(form.regNumber)}</p>

            <div className="mx-auto mt-5 max-w-xs rounded-xl border border-border bg-surface p-5 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Base Premium</span>
                <span className="font-semibold text-text">{formatCurrencyFull(quote.premium)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-text-secondary">GST (18%)</span>
                <span className="font-semibold text-text">{formatCurrencyFull(quote.gst)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
                <span className="font-bold text-text">Total Premium</span>
                <span className="font-extrabold text-primary">{formatCurrencyFull(quote.total)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="primary" icon={ShieldCheck}>Proceed to Buy</Button>
              <Button variant="outline" onClick={() => setQuote(null)}>
                Get Another Quote
              </Button>
            </div>
            <p className="mt-4 text-[11px] text-text-light">
              This is a demo estimate for illustration — no real policy is issued.
            </p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-14 max-w-3xl text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-text-secondary">Underwritten by leading insurers</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {insurancePartners.map((name) => (
            <Badge key={name} variant="neutral">{name}</Badge>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-info/25 bg-info/5 p-4 text-left text-xs text-text-secondary">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          This is a demo experience — insurer names and premium figures are simulated for illustration and no
          real policy is issued or bound.
        </div>
      </div>
    </div>
  )
}
