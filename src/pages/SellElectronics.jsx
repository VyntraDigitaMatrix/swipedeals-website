import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Check, Clock, ImagePlus, Laptop, MapPin,
  Package, Phone, Rocket, ShieldCheck, Tag, Upload, User, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Dropdown from '../components/forms/Dropdown'
import Badge from '../components/common/Badge'
import SellAccessGate from '../components/common/SellAccessGate'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'
import { useListingsStore } from '../hooks/useListingsStore'
import { electronicsCategories } from '../data/electronics'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

const ELECTRONICS_CATEGORY_OPTIONS = [...electronicsCategories, 'Other'].map((c) => ({ value: c, label: c }))
const CONDITION_OPTIONS = [{ value: 'new', label: 'New / Sealed' }, { value: 'used', label: 'Used' }]
const WARRANTY_OPTIONS = [
  { value: 'none', label: 'No warranty' },
  { value: 'manufacturer', label: 'Under manufacturer warranty' },
  { value: 'extended', label: 'Extended / seller warranty' },
]
const BOX_OPTIONS = [{ value: 'yes', label: 'Yes, bill & box available' }, { value: 'no', label: 'No' }]

const initialForm = (user) => ({
  images: [],
  electronicsCategory: '',
  brand: '',
  title: '',
  condition: 'new',
  specifications: '',
  warranty: 'none',
  billBoxAvailable: 'no',
  description: '',
  originalPrice: '',
  price: '',
  location: '',
  city: '',
  sellerName: user?.name || '',
  sellerPhone: user?.phone || '',
})

export default function SellElectronics() {
  const { user, isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { addListing } = useListingsStore()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('photos')
  const [published, setPublished] = useState(false)
  const [form, setForm] = useState(() => initialForm(user))

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const imagesValid = form.images.length > 0
  const detailsValid = !!form.electronicsCategory && form.brand.trim().length > 1 && form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const contactValid = form.sellerName.trim().length > 1 && /^\d{10}$/.test(form.sellerPhone) && form.location.trim().length > 2 && form.city.trim().length > 1
  const canSubmit = imagesValid && detailsValid && pricingValid && contactValid

  const TABS = [
    { id: 'photos', label: 'Photos', valid: imagesValid },
    { id: 'details', label: 'Product Details', valid: detailsValid },
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
      category: 'electronics',
      sellerType: 'individual',
      sellerName: form.sellerName,
      sellerPhone: form.sellerPhone,
      title: form.title,
      description: form.description,
      condition: form.condition,
      location: form.location,
      city: form.city,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images,
      electronicsCategory: form.electronicsCategory,
      brand: form.brand,
      specifications: form.specifications,
      warranty: form.warranty,
      billBoxAvailable: form.billBoxAvailable === 'yes',
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
              setForm(initialForm(user))
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
        <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Electronics' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname} />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Electronics' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Sell Electronics</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          List mobiles, laptops, TVs, cameras &amp; appliances &mdash; free, always reviewed by our team before it goes live.
          Fill in each tab below, in any order, then submit.
        </p>
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
              <span className="text-xs text-text-light">PNG, JPG up to 10MB (max 8 photos) &mdash; include the screen, ports &amp; any scratches</span>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Category" value={form.electronicsCategory} onChange={(v) => update('electronicsCategory', v)} placeholder="Select category" options={ELECTRONICS_CATEGORY_OPTIONS} />
              <Input label="Brand" icon={Tag} placeholder="e.g. Apple, Samsung, Sony" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
            </div>
            <Input label="Model / Title" icon={Laptop} placeholder="e.g. Apple iPhone 15 Pro Max 256GB" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <TextArea
              label="Key Specifications"
              placeholder="e.g. 256GB storage, 8GB RAM, 6.7&quot; display, 1 year old"
              value={form.specifications}
              onChange={(e) => update('specifications', e.target.value)}
              hint="RAM/storage, size, capacity, model year — whatever's relevant for this category."
              rows={3}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Condition" value={form.condition} onChange={(v) => update('condition', v)} options={CONDITION_OPTIONS} />
              <Dropdown label="Warranty Status" value={form.warranty} onChange={(v) => update('warranty', v)} options={WARRANTY_OPTIONS} />
            </div>
            <Dropdown label="Bill & Original Box" value={form.billBoxAvailable} onChange={(v) => update('billBoxAvailable', v)} options={BOX_OPTIONS} />
            <TextArea label="Description" placeholder="Describe condition, usage, accessories included, reason for selling..." value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input label="MRP / Original Price (₹) — optional" type="number" placeholder="e.g. 159900" value={form.originalPrice} onChange={(e) => update('originalPrice', e.target.value)} hint="Shown as a strike-through so buyers see the discount." />
            <Input label="Selling Price (₹)" type="number" placeholder="e.g. 139900" value={form.price} onChange={(e) => update('price', e.target.value)} />
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
            <Input label="Area / Locality" icon={MapPin} placeholder="e.g. Nehru Place" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="City" placeholder="e.g. Delhi" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              {form.images[0] && <img src={form.images[0]} alt="" className="h-56 w-full object-cover" />}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {form.electronicsCategory && <Badge variant="info" icon={Laptop}>{form.electronicsCategory}</Badge>}
                  {form.brand && <Badge variant="neutral">{form.brand}</Badge>}
                  <Badge variant={form.condition === 'new' ? 'success' : 'neutral'}>{form.condition === 'new' ? 'New' : 'Used'}</Badge>
                  {form.billBoxAvailable === 'yes' && <Badge variant="primary" icon={Package}>Bill &amp; Box</Badge>}
                </div>
                <h3 className="mt-2 text-lg font-bold text-text">{form.title || 'Untitled listing'}</h3>
                {form.specifications && <p className="mt-1 text-xs text-text-secondary">{form.specifications}</p>}
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={13} aria-hidden="true" /> {form.location}{form.location && form.city ? ', ' : ''}{form.city}
                </p>
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-text">{form.price ? formatCurrencyFull(Number(form.price)) : '—'}</p>
                  {form.originalPrice && <p className="text-sm text-text-light line-through">{formatCurrencyFull(Number(form.originalPrice))}</p>}
                </div>
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
