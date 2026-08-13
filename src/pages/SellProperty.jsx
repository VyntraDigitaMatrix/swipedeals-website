import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bath, Bed, Building2, Check, Clock, ImagePlus,
  Landmark, MapPin, Maximize, Phone, Rocket, ShieldCheck, Sofa, Upload, User, X,
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
import { propertyTypes } from '../data/properties'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

const PROPERTY_TYPE_OPTIONS = [...propertyTypes, 'Other'].map((t) => ({ value: t, label: t }))
const PURPOSE_OPTIONS = [{ value: 'Buy', label: 'Sell (Buy for buyer)' }, { value: 'Rent', label: 'Rent Out' }, { value: 'Lease', label: 'Lease' }]
const BEDROOM_OPTIONS = ['0', '1', '2', '3', '4', '5+'].map((v) => ({ value: v, label: v === '0' ? 'N/A (Plot/Land/Commercial)' : `${v} BHK` }))
const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi', label: 'Semi-Furnished' },
  { value: 'full', label: 'Fully Furnished' },
]
const AGE_OPTIONS = [
  { value: 'new', label: 'New / Under Construction' },
  { value: '0-5', label: '0 – 5 years' },
  { value: '5-10', label: '5 – 10 years' },
  { value: '10+', label: '10+ years' },
]

const initialForm = (user) => ({
  images: [],
  propertyType: '',
  purpose: 'Buy',
  title: '',
  bedrooms: '0',
  bathrooms: '',
  area: '',
  furnishing: 'unfurnished',
  floor: '',
  totalFloors: '',
  propertyAge: 'new',
  amenities: '',
  description: '',
  price: '',
  location: '',
  city: '',
  sellerName: user?.name || '',
  sellerPhone: user?.phone || '',
})

export default function SellProperty() {
  const { user, isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { addListing } = useListingsStore()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('photos')
  const [published, setPublished] = useState(false)
  const [form, setForm] = useState(() => initialForm(user))

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const isRental = form.purpose === 'Rent'

  const imagesValid = form.images.length > 0
  const detailsValid = !!form.propertyType && form.title.trim().length > 2 && Number(form.area) > 0 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const contactValid = form.sellerName.trim().length > 1 && /^\d{10}$/.test(form.sellerPhone) && form.location.trim().length > 2 && form.city.trim().length > 1
  const canSubmit = imagesValid && detailsValid && pricingValid && contactValid

  const TABS = [
    { id: 'photos', label: 'Photos', valid: imagesValid },
    { id: 'details', label: 'Property Details', valid: detailsValid },
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
      category: 'properties',
      sellerType: 'individual',
      sellerName: form.sellerName,
      sellerPhone: form.sellerPhone,
      title: form.title,
      description: form.description,
      condition: form.propertyAge === 'new' ? 'new' : 'used',
      location: form.location,
      city: form.city,
      price: Number(form.price),
      images: form.images,
      propertyType: form.propertyType,
      purpose: form.purpose,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      furnishing: form.furnishing,
      floor: form.floor,
      totalFloors: form.totalFloors,
      propertyAge: form.propertyAge,
      amenities: form.amenities,
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
          &ldquo;{form.title}&rdquo; has been submitted &mdash; free of charge, zero brokerage. Our team typically
          reviews new listings within 24 hours; you&rsquo;ll be able to track its status from your dashboard, and
          it goes live to buyers/tenants the moment it&rsquo;s approved.
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
            List Another Property
          </Button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isKycVerified) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Property' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname} />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Property' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">List a Property</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          List an apartment, villa, plot or commercial space with zero brokerage &mdash; always reviewed by our team before it goes live.
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
              <span className="text-xs text-text-light">PNG, JPG up to 10MB (max 8 photos) &mdash; include exteriors, rooms &amp; the view</span>
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
            <h2 className="text-lg font-bold text-text">Property details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Property Type" value={form.propertyType} onChange={(v) => update('propertyType', v)} placeholder="Select type" options={PROPERTY_TYPE_OPTIONS} />
              <Dropdown label="Purpose" value={form.purpose} onChange={(v) => update('purpose', v)} options={PURPOSE_OPTIONS} />
            </div>
            <Input label="Listing Title" icon={Building2} placeholder="e.g. Skyline Heights 3BHK Sea-View Apartment" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Dropdown label="Bedrooms" value={form.bedrooms} onChange={(v) => update('bedrooms', v)} options={BEDROOM_OPTIONS} />
              <Input label="Bathrooms" icon={Bath} type="number" min="0" placeholder="e.g. 2" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} />
              <Input label="Area (sq. ft.)" icon={Maximize} type="number" min="0" placeholder="e.g. 1850" value={form.area} onChange={(e) => update('area', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Furnishing" value={form.furnishing} onChange={(v) => update('furnishing', v)} options={FURNISHING_OPTIONS} />
              <Dropdown label="Property Age" value={form.propertyAge} onChange={(v) => update('propertyAge', v)} options={AGE_OPTIONS} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Floor Number (optional)" placeholder="e.g. 7" value={form.floor} onChange={(e) => update('floor', e.target.value)} />
              <Input label="Total Floors in Building (optional)" placeholder="e.g. 18" value={form.totalFloors} onChange={(e) => update('totalFloors', e.target.value)} />
            </div>
            <TextArea
              label="Amenities (optional)"
              placeholder="e.g. Covered Parking, Lift, Gym, Swimming Pool, 24x7 Security"
              value={form.amenities}
              onChange={(e) => update('amenities', e.target.value)}
              hint="Separate amenities with commas."
              rows={2}
            />
            <TextArea label="Description" placeholder="Describe the property, nearby landmarks, why it's a great buy..." value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input
              label={isRental ? 'Monthly Rent (₹)' : 'Price (₹)'}
              type="number"
              placeholder={isRental ? 'e.g. 45000' : 'e.g. 24500000'}
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              hint="Set a competitive price based on similar listings in your area."
            />
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
            <Input label="Locality" icon={MapPin} placeholder="e.g. Bandra West" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="City" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              {form.images[0] && <img src={form.images[0]} alt="" className="h-56 w-full object-cover" />}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {form.propertyType && <Badge variant="primary" icon={Landmark}>{form.propertyType}</Badge>}
                  <Badge variant={form.purpose === 'Rent' ? 'info' : 'success'}>For {form.purpose}</Badge>
                  <Badge variant="neutral" icon={Sofa}>{FURNISHING_OPTIONS.find((f) => f.value === form.furnishing)?.label}</Badge>
                </div>
                <h3 className="mt-2 text-lg font-bold text-text">{form.title || 'Untitled listing'}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={13} aria-hidden="true" /> {form.location}{form.location && form.city ? ', ' : ''}{form.city}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  {form.bedrooms !== '0' && (
                    <span className="flex items-center gap-1.5"><Bed size={14} aria-hidden="true" /> {form.bedrooms} BHK</span>
                  )}
                  {form.bathrooms && (
                    <span className="flex items-center gap-1.5"><Bath size={14} aria-hidden="true" /> {form.bathrooms} Bath</span>
                  )}
                  {form.area && (
                    <span className="flex items-center gap-1.5"><Maximize size={14} aria-hidden="true" /> {form.area} sq.ft.</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
                {form.amenities && <p className="mt-2 text-xs text-text-light">Amenities: {form.amenities}</p>}
                <p className="mt-4 text-2xl font-extrabold text-text">
                  {form.price ? formatCurrencyFull(Number(form.price)) : '—'}
                  {isRental && <span className="text-sm font-medium text-text-secondary">/month</span>}
                </p>
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
