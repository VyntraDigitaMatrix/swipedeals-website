import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bath, Bed, Building2, Check, Clock, Compass, ImagePlus,
  Landmark, MapPin, Maximize, Phone, Rocket, Ruler, ShieldCheck, Sofa, Upload, User, X,
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
import { usePropertyListings } from '../hooks/usePropertyListings'
import propertyListingService, {
  PROPERTY_TYPES,
  LISTING_TYPES,
  FURNISHING_STATUSES,
  CONSTRUCTION_STATUSES,
  FACING_OPTIONS,
  AREA_UNITS,
} from '../services/propertyListingService'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

const BEDROOM_OPTIONS = [
  { value: '0', label: 'N/A (Plot / Land / Commercial)' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5+ BHK' },
]

const initialForm = () => ({
  title: '',
  description: '',
  propertyType: '',
  listingType: 'FOR_SALE',
  price: '',
  negotiable: false,
  bedrooms: 0,
  bathrooms: 0,
  balconies: 0,
  builtUpArea: '',
  carpetArea: '',
  plotArea: '',
  areaUnit: 'SQ_FT',
  furnishingStatus: 'UNFURNISHED',
  constructionStatus: 'READY_TO_MOVE',
  facing: '',
  floor: '',
  totalFloors: '',
  ageOfProperty: '',
  city: '',
  locality: '',
  address: '',
  pincode: '',
})

export default function SellProperty() {
  const { user, isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { createListing, submitListing, loading, error } = usePropertyListings()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('details')
  const [published, setPublished] = useState(false)
  const [createdSlug, setCreatedSlug] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [selectedFiles, setSelectedFiles] = useState([])

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const isRental = form.listingType === 'FOR_RENT'

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Validation
  const detailsValid = !!form.propertyType && form.title.trim().length > 2 && form.description.trim().length > 5
  const areaValid = Number(form.builtUpArea) > 0 || Number(form.carpetArea) > 0 || Number(form.plotArea) > 0
  const pricingValid = Number(form.price) > 0
  const locationValid = form.city.trim().length > 1 && form.locality.trim().length > 1
  const imagesValid = selectedFiles.length > 0
  const canSubmit = detailsValid && areaValid && pricingValid && locationValid && imagesValid

  const TABS = [
    { id: 'details', label: 'Property Details', valid: detailsValid },
    { id: 'area', label: 'Area & Layout', valid: areaValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'location', label: 'Location', valid: locationValid },
    { id: 'images', label: 'Images', valid: imagesValid },
    { id: 'preview', label: 'Preview' },
  ]

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    propertyType: form.propertyType,
    listingType: form.listingType,
    price: Number(form.price),
    negotiable: form.negotiable,
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    balconies: Number(form.balconies) || 0,
    builtUpArea: Number(form.builtUpArea) || 0,
    carpetArea: Number(form.carpetArea) || 0,
    plotArea: Number(form.plotArea) || 0,
    areaUnit: form.areaUnit,
    furnishingStatus: form.furnishingStatus,
    constructionStatus: form.constructionStatus,
    ...(form.facing ? { facing: form.facing } : {}),
    ...(form.floor !== '' ? { floor: Number(form.floor) } : {}),
    ...(form.totalFloors !== '' ? { totalFloors: Number(form.totalFloors) } : {}),
    ...(form.ageOfProperty !== '' ? { ageOfProperty: Number(form.ageOfProperty) } : {}),
    city: form.city.trim(),
    locality: form.locality.trim(),
    ...(form.address.trim() ? { address: form.address.trim() } : {}),
    ...(form.pincode.trim() ? { pincode: form.pincode.trim() } : {}),
  })

  const handlePublish = async () => {
    if (!canSubmit) return
    setSubmitError(null)
    try {
      // Step 1: Create the listing (saved as DRAFT)
      const created = await createListing(buildPayload())
      const slug = created?.slug
      if (!slug) throw new Error('Could not get slug from created listing')

      // Step 2: Upload images
      if (selectedFiles.length > 0) {
        await propertyListingService.uploadImages(slug, selectedFiles)
      }

      // Step 3: Submit for approval
      await submitListing(slug)
      setCreatedSlug(slug)
      setPublished(true)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit listing.'
      setSubmitError(msg)
    }
  }

  const handleSaveDraft = async () => {
    if (!detailsValid) return
    setSubmitError(null)
    try {
      const created = await createListing(buildPayload())
      const slug = created?.slug
      
      if (slug && selectedFiles.length > 0) {
        await propertyListingService.uploadImages(slug, selectedFiles)
      }
      
      setCreatedSlug(slug)
      setSubmitError(null)
      alert('Draft saved successfully! You can submit it later from your dashboard.')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save draft.'
      setSubmitError(msg)
    }
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
              setActiveTab('details')
              setForm(initialForm())
              setCreatedSlug(null)
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

      {submitError && (
        <div className="mb-4 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        {activeTab === 'details' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Property details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Property Type *" value={form.propertyType} onChange={(v) => update('propertyType', v)} placeholder="Select type" options={PROPERTY_TYPES} />
              <Dropdown label="Listing Type *" value={form.listingType} onChange={(v) => update('listingType', v)} options={LISTING_TYPES} />
            </div>
            <Input label="Listing Title *" icon={Building2} placeholder="e.g. Skyline Heights 3BHK Sea-View Apartment" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Dropdown label="Bedrooms" value={String(form.bedrooms)} onChange={(v) => update('bedrooms', Number(v))} options={BEDROOM_OPTIONS} />
              <Input label="Bathrooms" icon={Bath} type="number" min="0" placeholder="e.g. 2" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} />
              <Input label="Balconies" type="number" min="0" placeholder="e.g. 1" value={form.balconies} onChange={(e) => update('balconies', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Furnishing" value={form.furnishingStatus} onChange={(v) => update('furnishingStatus', v)} options={FURNISHING_STATUSES} />
              <Dropdown label="Construction Status" value={form.constructionStatus} onChange={(v) => update('constructionStatus', v)} options={CONSTRUCTION_STATUSES} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Facing (optional)" value={form.facing} onChange={(v) => update('facing', v)} placeholder="Select facing" options={FACING_OPTIONS} />
              <Input label="Age of Property (years, optional)" type="number" min="0" placeholder="e.g. 5" value={form.ageOfProperty} onChange={(e) => update('ageOfProperty', e.target.value)} />
            </div>
            <TextArea label="Description *" placeholder="Describe the property, nearby landmarks, why it's a great buy..." value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
        )}

        {activeTab === 'area' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Area &amp; Layout</h2>
            <Dropdown label="Area Unit" value={form.areaUnit} onChange={(v) => update('areaUnit', v)} options={AREA_UNITS} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Built-Up Area" icon={Ruler} type="number" min="0" step="0.1" placeholder="e.g. 1850" value={form.builtUpArea} onChange={(e) => update('builtUpArea', e.target.value)} />
              <Input label="Carpet Area" icon={Ruler} type="number" min="0" step="0.1" placeholder="e.g. 1450" value={form.carpetArea} onChange={(e) => update('carpetArea', e.target.value)} />
              <Input label="Plot Area" icon={Ruler} type="number" min="0" step="0.1" placeholder="e.g. 2400" value={form.plotArea} onChange={(e) => update('plotArea', e.target.value)} />
            </div>
            <p className="text-xs text-text-light">Fill at least one area field. Plot area is especially relevant for plots, villas and independent houses.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Floor Number (optional)" placeholder="e.g. 7" type="number" min="0" value={form.floor} onChange={(e) => update('floor', e.target.value)} />
              <Input label="Total Floors in Building (optional)" placeholder="e.g. 18" type="number" min="0" value={form.totalFloors} onChange={(e) => update('totalFloors', e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input
              label={isRental ? 'Monthly Rent (₹) *' : 'Price (₹) *'}
              type="number"
              placeholder={isRental ? 'e.g. 45000' : 'e.g. 24500000'}
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              hint="Set a competitive price based on similar listings in your area."
            />
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={form.negotiable}
                onChange={(e) => update('negotiable', e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Price is negotiable
            </label>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Location details</h2>
            <p className="-mt-3 text-xs text-text-secondary">Provide accurate location info so buyers can find your listing easily.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="City *" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Input label="Locality *" icon={MapPin} placeholder="e.g. Bandra West" value={form.locality} onChange={(e) => update('locality', e.target.value)} />
            </div>
            <Input label="Full Address (optional)" icon={MapPin} placeholder="e.g. 12, Palm Grove, Near XYZ Hospital" value={form.address} onChange={(e) => update('address', e.target.value)} />
            <Input label="Pincode (optional)" placeholder="e.g. 400050" maxLength={6} value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Photos</h2>
            <p className="-mt-3 text-xs text-text-secondary">Upload high quality photos of the property to get more inquiries. The first photo will be the main cover image.</p>
            
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-alt py-10 transition-colors hover:border-primary hover:bg-primary/5">
                <div className="rounded-full bg-primary/10 p-3 text-primary mb-2">
                  <ImagePlus size={24} />
                </div>
                <p className="font-semibold text-text">Click to upload photos</p>
                <p className="mt-1 text-xs text-text-light">JPG, PNG, WEBP (Max 5MB each)</p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-alt">
                      <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                          COVER
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-danger"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="bg-gradient-to-br from-primary/10 via-surface-alt to-surface p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {form.propertyType && <Badge variant="primary" icon={Landmark}>{PROPERTY_TYPES.find((t) => t.value === form.propertyType)?.label || form.propertyType}</Badge>}
                  <Badge variant={isRental ? 'info' : 'success'}>{LISTING_TYPES.find((t) => t.value === form.listingType)?.label || form.listingType}</Badge>
                  <Badge variant="neutral" icon={Sofa}>{FURNISHING_STATUSES.find((f) => f.value === form.furnishingStatus)?.label}</Badge>
                  {form.negotiable && <Badge variant="warning">Negotiable</Badge>}
                </div>
                <h3 className="text-lg font-bold text-text">{form.title || 'Untitled listing'}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={13} aria-hidden="true" /> {form.locality}{form.locality && form.city ? ', ' : ''}{form.city}
                  {form.pincode && ` - ${form.pincode}`}
                </p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  {form.bedrooms > 0 && (
                    <span className="flex items-center gap-1.5"><Bed size={14} aria-hidden="true" /> {form.bedrooms} BHK</span>
                  )}
                  {Number(form.bathrooms) > 0 && (
                    <span className="flex items-center gap-1.5"><Bath size={14} aria-hidden="true" /> {form.bathrooms} Bath</span>
                  )}
                  {Number(form.balconies) > 0 && (
                    <span className="flex items-center gap-1.5">{form.balconies} Balcon{Number(form.balconies) > 1 ? 'ies' : 'y'}</span>
                  )}
                  {Number(form.builtUpArea) > 0 && (
                    <span className="flex items-center gap-1.5"><Maximize size={14} aria-hidden="true" /> {form.builtUpArea} {AREA_UNITS.find((u) => u.value === form.areaUnit)?.label}</span>
                  )}
                  {Number(form.carpetArea) > 0 && (
                    <span className="flex items-center gap-1.5"><Ruler size={14} aria-hidden="true" /> Carpet: {form.carpetArea} {AREA_UNITS.find((u) => u.value === form.areaUnit)?.label}</span>
                  )}
                  {form.facing && (
                    <span className="flex items-center gap-1.5"><Compass size={14} aria-hidden="true" /> {FACING_OPTIONS.find((f) => f.value === form.facing)?.label}</span>
                  )}
                  {form.floor !== '' && (
                    <span>Floor {form.floor}{form.totalFloors ? ` / ${form.totalFloors}` : ''}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
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
          <div className="flex gap-2">
            <Button variant="outline" disabled={!detailsValid || loading} onClick={handleSaveDraft}>
              Save as Draft
            </Button>
            <Button variant="primary" icon={Rocket} disabled={!canSubmit || loading} onClick={handlePublish}>
              {loading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
