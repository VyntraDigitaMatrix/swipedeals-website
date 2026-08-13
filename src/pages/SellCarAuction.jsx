import { useState } from 'react'
import { Car, Gavel, ImagePlus, IndianRupee, MapPin, Timer, TrendingUp, Upload, Users, X } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'
import { formatCurrencyFull } from '../utils/format'

const WHY_AUCTION = [
  { icon: Users, title: 'Verified Dealer Bids', description: 'Only background-checked dealers can bid on your car.' },
  { icon: TrendingUp, title: 'Competitive Pricing', description: 'Multiple bidders often push the price above your reserve.' },
  { icon: Timer, title: 'Fast Turnaround', description: 'Auctions close within 24–72 hours — no long waiting.' },
]

const DURATION_OPTIONS = [
  { value: '24', label: '24 Hours — Fastest' },
  { value: '48', label: '48 Hours — Recommended' },
  { value: '72', label: '72 Hours — Maximum Bids' },
]

export default function SellCarAuction() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ brandModel: '', year: '', km: '', city: '', reservePrice: '', duration: '48', images: [] })

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map((f) => URL.createObjectURL(f))
    update('images', [...form.images, ...urls].slice(0, 6))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-page py-8">
        <SuccessScreen
          title="Your car is live in the auction!"
          description={`Verified dealers can now bid on your ${form.brandModel || 'car'}. The auction runs for ${form.duration} hours with a reserve price of ${form.reservePrice ? formatCurrencyFull(Number(form.reservePrice)) : 'your set amount'} — you'll be notified of every bid instantly.`}
          actions={[{ label: 'Back to Home', to: '/' }, { label: 'Explore Other Options', to: '/sell/car', variant: 'outline' }]}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Your Car', to: '/sell/car' }, { label: 'Add to Auction' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-4 py-1.5 text-xs font-bold text-warning">
          <Gavel size={13} aria-hidden="true" /> Live Dealer Auctions
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Add your car to auction</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Set a reserve price and let verified dealers compete for your car — a fast, transparent way to get the
          best possible offer.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {WHY_AUCTION.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon size={20} aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-text">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-text">Car & auction details</h2>
        <div className="space-y-5">
          <Input label="Car Brand & Model" icon={Car} placeholder="e.g. Toyota Fortuner Legender" value={form.brandModel} onChange={(e) => update('brandModel', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Manufacturing Year" placeholder="2022" value={form.year} onChange={(e) => update('year', e.target.value)} required />
            <Input label="KM Driven" placeholder="18000" value={form.km} onChange={(e) => update('km', e.target.value)} required />
          </div>
          <Input label="City" icon={MapPin} placeholder="e.g. Pune" value={form.city} onChange={(e) => update('city', e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Reserve Price (₹)"
              type="number"
              icon={IndianRupee}
              placeholder="e.g. 1500000"
              value={form.reservePrice}
              onChange={(e) => update('reservePrice', e.target.value)}
              hint="Minimum price you're willing to accept."
              required
            />
            <Dropdown label="Auction Duration" value={form.duration} onChange={(v) => update('duration', v)} options={DURATION_OPTIONS} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">Photos</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/40">
              <Upload size={24} className="text-text-light" aria-hidden="true" />
              <span className="text-sm font-semibold text-text">Click to upload photos</span>
              <span className="text-xs text-text-light">Clear photos attract more competitive bids</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>

            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {form.images.map((src, i) => (
                  <div key={src} className="group relative aspect-square overflow-hidden rounded-lg">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update('images', form.images.filter((_, idx) => idx !== i))}
                      aria-label="Remove photo"
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))}
                {form.images.length < 6 && (
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-text-light hover:border-primary/40">
                    <ImagePlus size={18} aria-hidden="true" />
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth icon={Gavel} className="mt-7">
          Add to Auction
        </Button>
      </form>
    </div>
  )
}
