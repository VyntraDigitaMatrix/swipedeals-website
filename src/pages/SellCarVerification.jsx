import { useState } from 'react'
import { Calendar, Car, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'

const HOW_IT_WORKS = [
  { icon: Calendar, title: 'Schedule a Slot', description: 'Pick a date & time that works for you — we come to your doorstep.' },
  { icon: ShieldCheck, title: 'Free Inspection', description: 'Our expert runs a 200-point check on your car, free of cost.' },
  { icon: Zap, title: 'Instant Offer', description: 'Get a fair, no-obligation price offer on the spot.' },
  { icon: CheckCircle2, title: 'Get Paid', description: 'Accept the offer and receive payment within 24 hours.' },
]

export default function SellCarVerification() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ brandModel: '', year: '', km: '', city: '', phone: '', date: '', slot: '' })

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-page py-8">
        <SuccessScreen
          title="Inspection Scheduled!"
          description={`Our expert will visit you on ${form.date || 'your selected date'} to inspect your ${form.brandModel || 'car'}. You'll receive an instant offer right after — no obligation to sell.`}
          actions={[{ label: 'Back to Home', to: '/' }, { label: 'Explore Other Options', to: '/sell/car', variant: 'outline' }]}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Your Car', to: '/sell/car' }, { label: 'Get Verified & Sold' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-4 py-1.5 text-xs font-bold text-success">
          <Sparkles size={13} aria-hidden="true" /> Free Doorstep Inspection
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Get your car verified & sold</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Skip the hassle of negotiating with strangers. Our experts inspect, value and help sell your car for the
          best market price — completely free.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {HOW_IT_WORKS.map((step) => (
          <div key={step.title} className="rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon size={20} aria-hidden="true" />
            </div>
            <h3 className="text-xs font-bold text-text sm:text-sm">{step.title}</h3>
            <p className="mt-1.5 hidden text-xs leading-relaxed text-text-secondary sm:block">{step.description}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-text">Tell us about your car</h2>
        <div className="space-y-5">
          <Input
            label="Car Brand & Model"
            icon={Car}
            placeholder="e.g. Hyundai Creta SX(O)"
            value={form.brandModel}
            onChange={(e) => update('brandModel', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Manufacturing Year" placeholder="2021" value={form.year} onChange={(e) => update('year', e.target.value)} required />
            <Input label="KM Driven" placeholder="25000" value={form.km} onChange={(e) => update('km', e.target.value)} required />
          </div>
          <Input label="City" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} required />
          <Input label="Phone Number" type="tel" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preferred Date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
            <Dropdown
              label="Preferred Time Slot"
              value={form.slot}
              onChange={(v) => update('slot', v)}
              placeholder="Select a slot"
              options={[
                { value: 'morning', label: '9 AM – 12 PM' },
                { value: 'afternoon', label: '12 PM – 4 PM' },
                { value: 'evening', label: '4 PM – 7 PM' },
              ]}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth icon={Clock} className="mt-7">
          Schedule Free Inspection
        </Button>
      </form>
    </div>
  )
}
