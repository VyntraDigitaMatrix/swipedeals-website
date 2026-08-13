import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, CarFront, Check, Clock, Home as HomeIcon,
  ImagePlus, Laptop, MapPin, Phone, Rocket, Settings, ShieldCheck, Truck, Upload, User, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Dropdown from '../components/forms/Dropdown'
import SellAccessGate from '../components/common/SellAccessGate'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'
import { useListingsStore } from '../hooks/useListingsStore'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

// Electronics, Spare Parts & Properties each have their own dedicated
// tabbed forms (with category-specific fields) — picking one of these here
// routes straight there instead of continuing this generic form.
const DEDICATED_ROUTES = {
  electronics: '/sell/electronics',
  'spare-parts': '/sell/spare-parts',
  properties: '/sell/properties',
}

const CATEGORIES = [
  { id: 'cars', label: 'Cars', icon: CarFront },
  { id: 'commercial', label: 'Commercial Vehicles', icon: Truck },
  { id: 'electronics', label: 'Electronics', icon: Laptop, to: DEDICATED_ROUTES.electronics },
  { id: 'spare-parts', label: 'Spare Parts', icon: Settings, to: DEDICATED_ROUTES['spare-parts'] },
  { id: 'properties', label: 'Properties', icon: HomeIcon, to: DEDICATED_ROUTES.properties },
]

const TITLES = { cars: 'Sell Your Car', commercial: 'Sell Your Commercial Vehicle' }

const initialForm = (category, user) => ({
  category,
  images: [],
  title: '',
  description: '',
  condition: 'used',
  location: '',
  city: '',
  price: '',
  sellerName: user?.name || '',
  sellerPhone: user?.phone || '',
})

export default function SellProduct() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedCategory = CATEGORIES.some((c) => c.id === searchParams.get('category')) ? searchParams.get('category') : ''
  const { user, isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { addListing } = useListingsStore()

  // Deep links like /sell?category=electronics (used by older nav links)
  // should land straight on the dedicated form for that category too.
  useEffect(() => {
    if (DEDICATED_ROUTES[preselectedCategory]) {
      navigate(DEDICATED_ROUTES[preselectedCategory], { replace: true })
    }
  }, [preselectedCategory, navigate])

  const [activeTab, setActiveTab] = useState('photos')
  const [published, setPublished] = useState(false)
  const [form, setForm] = useState(() => initialForm(preselectedCategory, user))

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const imagesValid = form.images.length > 0
  const detailsValid = form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const contactValid = form.sellerName.trim().length > 1 && /^\d{10}$/.test(form.sellerPhone) && form.location.trim().length > 2 && form.city.trim().length > 1
  const canSubmit = imagesValid && detailsValid && pricingValid && contactValid

  const TABS = [
    { id: 'photos', label: 'Photos', valid: imagesValid },
    { id: 'details', label: 'Details', valid: detailsValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'contact', label: 'Contact', valid: contactValid },
    { id: 'preview', label: 'Preview' },
  ]

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map((f) => URL.createObjectURL(f))
    update('images', [...form.images, ...urls].slice(0, 8))
  }

  const handlePublish = () => {
    if (!canSubmit) return
    addListing({
      category: form.category,
      sellerType: 'individual',
      sellerName: form.sellerName,
      sellerPhone: form.sellerPhone,
      title: form.title,
      description: form.description,
      condition: form.condition,
      location: form.location,
      city: form.city,
      price: Number(form.price),
      images: form.images,
    })
    setPublished(true)
  }

  if (published) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
          <Clock size={40} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Submitted for review!</h1>
        <p className="mt-3 max-w-md text-sm text-text-secondary">
          &ldquo;{form.title}&rdquo; has been submitted &mdash; free of charge. Our team typically reviews new
          listings within 24 hours; you&rsquo;ll be able to track its status from your dashboard, and it goes
          live to buyers the moment it&rsquo;s approved.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-surface-alt px-4 py-2 text-xs font-semibold text-text-secondary">
          <ShieldCheck size={14} className="text-success" aria-hidden="true" />
          Every listing is manually reviewed to keep SwipeDeals spam-free
        </div>
        <div className="mt-8 flex gap-3">
          <Button to="/dashboard" variant="primary">
            Track in Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPublished(false)
              setActiveTab('photos')
              setForm(initialForm('', user))
            }}
          >
            List Another Item
          </Button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isKycVerified) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Sell / Become a Dealer' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname + location.search} />
      </div>
    )
  }

  // No category chosen yet — show the category picker first. Electronics,
  // Spare Parts & Properties redirect immediately; Cars & Commercial Vehicles
  // continue below with the tabbed form.
  if (!form.category) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Sell / Become a Dealer' }]} />

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Sell Your Product</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            List your car, property, electronics or spare parts &mdash; free, always reviewed by our team before it goes live.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          <h2 className="mb-5 text-lg font-bold text-text">What are you listing?</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => (cat.to ? navigate(cat.to) : update('category', cat.id))}
                className="flex flex-col items-center gap-2.5 rounded-xl border-2 border-border p-5 text-center transition-colors hover:border-primary/30"
              >
                <cat.icon size={24} className="text-text-secondary" aria-hidden="true" />
                <span className="text-xs font-semibold text-text">{cat.label}</span>
              </button>
            ))}
          </div>

          <Link
            to="/sell/car"
            className="mt-5 flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Selling a car? Explore verification, dealer & auction options
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    )
  }

  const pageTitle = TITLES[form.category] || 'Sell Your Product'

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell / Become a Dealer' }]} />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">{pageTitle}</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Fill in each tab below, in any order &mdash; free, always reviewed by our team before it goes live.
          </p>
        </div>
        <button type="button" onClick={() => update('category', '')} className="shrink-0 text-xs font-semibold text-primary hover:underline">
          Change category
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors',
              activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text'
            )}
          >
            {tab.valid !== undefined && (
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full',
                  tab.valid ? 'bg-success/15 text-success' : 'bg-surface-alt text-text-light'
                )}
              >
                {tab.valid ? <Check size={10} aria-hidden="true" /> : <span className="h-1 w-1 rounded-full bg-current" />}
              </span>
            )}
            {tab.label}
            {activeTab === tab.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-primary" />}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        {activeTab === 'photos' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Upload photos</h2>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-10 text-center hover:border-primary/40">
              <Upload size={28} className="text-text-light" aria-hidden="true" />
              <span className="text-sm font-semibold text-text">Click to upload or drag and drop</span>
              <span className="text-xs text-text-light">PNG, JPG up to 10MB (max 8 photos)</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>

            {form.images.length > 0 && (
              <div className="mt-5 grid grid-cols-4 gap-3">
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
                {form.images.length < 8 && (
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-text-light hover:border-primary/40">
                    <ImagePlus size={20} aria-hidden="true" />
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Product details</h2>
            <Input label="Title" placeholder="e.g. Hyundai Creta SX(O) Turbo 2023" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <TextArea label="Description" placeholder="Describe the condition, features and history..." value={form.description} onChange={(e) => update('description', e.target.value)} />
            <Dropdown
              label="Condition"
              value={form.condition}
              onChange={(v) => update('condition', v)}
              options={[{ value: 'new', label: 'New' }, { value: 'used', label: 'Used' }]}
            />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input label="Price (₹)" type="number" placeholder="e.g. 1250000" value={form.price} onChange={(e) => update('price', e.target.value)} hint="Set a competitive price based on similar listings in your area." />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Contact &amp; location</h2>
            <p className="-mt-3 text-xs text-text-secondary">Shown to buyers so they can reach you directly once your listing is approved.</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Your Name" icon={User} placeholder="e.g. Rohan Mehta" value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} />
              <Input
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="98765 43210"
                maxLength={10}
                value={form.sellerPhone}
                onChange={(e) => update('sellerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <Input label="Area / Locality" icon={MapPin} placeholder="e.g. Bandra West" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="City" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              {form.images[0] && <img src={form.images[0]} alt="" className="h-56 w-full object-cover" />}
              <div className="p-5">
                <h3 className="text-lg font-bold text-text">{form.title || 'Untitled listing'}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={13} aria-hidden="true" /> {form.location}{form.location && form.city ? ', ' : ''}{form.city}
                </p>
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
                <p className="mt-4 text-2xl font-extrabold text-text">{form.price ? formatCurrencyFull(Number(form.price)) : '—'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-end gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-secondary">
            {canSubmit ? 'All set — ready to submit.' : 'Complete the highlighted tabs before submitting.'}
          </p>
          <Button variant="primary" icon={Rocket} disabled={!canSubmit} onClick={handlePublish}>
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  )
}
