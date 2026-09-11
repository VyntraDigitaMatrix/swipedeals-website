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
import { useElectronicsListings } from '../hooks/useElectronicsListings'
import electronicsListingService, { ELECTRONICS_TYPES, ELECTRONICS_CONDITIONS } from '../services/electronicsListingService'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

const initialForm = () => ({
  type: '',
  brand: '',
  model: '',
  title: '',
  condition: 'NEW',
  purchaseYear: new Date().getFullYear(),
  warrantyAvailable: false,
  billAvailable: false,
  boxAvailable: false,
  description: '',
  price: '',
  negotiable: false,
  city: '',
  locality: '',
})

export default function SellElectronics() {
  const { isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { createListing, submitListing } = useElectronicsListings()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('details')
  const [published, setPublished] = useState(false)
  const [createdSlug, setCreatedSlug] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [selectedFiles, setSelectedFiles] = useState([])

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const detailsValid = !!form.type && form.brand.trim().length > 1 && form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const imagesValid = selectedFiles.length > 0
  const locationValid = form.city.trim().length > 1 && form.locality.trim().length > 2
  const canSubmit = imagesValid && detailsValid && pricingValid && locationValid

  const TABS = [
    { id: 'details', label: 'Product Details', valid: detailsValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'location', label: 'Location', valid: locationValid },
    { id: 'images', label: 'Photos', valid: imagesValid },
    { id: 'preview', label: 'Preview' },
  ]

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type,
    brand: form.brand.trim(),
    model: form.model.trim(),
    price: Number(form.price) || 0,
    negotiable: form.negotiable,
    condition: form.condition,
    purchaseYear: Number(form.purchaseYear) || new Date().getFullYear(),
    warrantyAvailable: form.warrantyAvailable,
    billAvailable: form.billAvailable,
    boxAvailable: form.boxAvailable,
    city: form.city.trim(),
    locality: form.locality.trim(),
  })

  const handlePublish = async () => {
    if (!canSubmit) return
    setSubmitError(null)
    setLoading(true)
    try {
      // Step 1: Create Draft
      const created = await createListing(buildPayload())
      const slug = created?.slug
      if (!slug) throw new Error('Could not get slug from created listing')

      // Step 2: Upload Images
      if (selectedFiles.length > 0) {
        await electronicsListingService.uploadImages(slug, selectedFiles)
      }

      // Step 3: Submit for approval
      await submitListing(slug)
      setCreatedSlug(slug)
      setPublished(true)
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to submit listing.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!detailsValid) return
    setSubmitError(null)
    setLoading(true)
    try {
      const created = await createListing(buildPayload())
      const slug = created?.slug
      
      if (slug && selectedFiles.length > 0) {
        await electronicsListingService.uploadImages(slug, selectedFiles)
      }
      
      setCreatedSlug(slug)
      setSubmitError(null)
      alert('Draft saved successfully! You can submit it later from your dashboard.')
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to save draft.')
    } finally {
      setLoading(false)
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
              setActiveTab('details')
              setForm(initialForm())
              setSelectedFiles([])
              setCreatedSlug(null)
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
        {submitError && (
          <div className="mb-6 rounded-lg bg-danger/10 p-4 text-sm font-semibold text-danger">
            {submitError}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Photos</h2>
            <p className="-mt-3 text-xs text-text-secondary">Upload high quality photos of the product to get more inquiries. The first photo will be the main cover image.</p>
            
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-alt py-10 transition-colors hover:border-primary hover:bg-primary/5">
                <div className="rounded-full bg-primary/10 p-3 text-primary mb-2">
                  <ImagePlus size={24} />
                </div>
                <p className="font-semibold text-text">Click to upload photos</p>
                <p className="mt-1 text-xs text-text-light">JPG, PNG, WEBP</p>
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
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Product details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Category" value={form.type} onChange={(v) => update('type', v)} placeholder="Select category" options={ELECTRONICS_TYPES} />
              <Dropdown label="Condition" value={form.condition} onChange={(v) => update('condition', v)} options={ELECTRONICS_CONDITIONS} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Brand" icon={Tag} placeholder="e.g. Apple, Samsung" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
              <Input label="Model" placeholder="e.g. iPhone 15 Pro Max" value={form.model} onChange={(e) => update('model', e.target.value)} />
            </div>
            <Input label="Listing Title" icon={Laptop} placeholder="e.g. Apple iPhone 15 Pro Max 256GB" value={form.title} onChange={(e) => update('title', e.target.value)} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Purchase Year" type="number" min="2000" max={new Date().getFullYear()} value={form.purchaseYear} onChange={(e) => update('purchaseYear', e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-text">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.warrantyAvailable} onChange={(e) => update('warrantyAvailable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                Under Warranty
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.billAvailable} onChange={(e) => update('billAvailable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                Original Bill Available
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.boxAvailable} onChange={(e) => update('boxAvailable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                Original Box Available
              </label>
            </div>
            <TextArea label="Description" placeholder="Describe condition, usage, accessories included, reason for selling..." value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input label="Selling Price (₹)" type="number" placeholder="e.g. 139900" value={form.price} onChange={(e) => update('price', e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              Price is negotiable
            </label>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Location details</h2>
            <p className="-mt-3 text-xs text-text-secondary">Where is this item located?</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="City *" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Input label="Locality / Area *" icon={MapPin} placeholder="e.g. Andheri West" value={form.locality} onChange={(e) => update('locality', e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="bg-gradient-to-br from-primary/10 via-surface-alt to-surface p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="primary" icon={Laptop}>{ELECTRONICS_TYPES.find(t => t.value === form.type)?.label || form.type || 'Electronics'}</Badge>
                  <Badge variant="neutral">{ELECTRONICS_CONDITIONS.find(c => c.value === form.condition)?.label || form.condition}</Badge>
                  {form.warrantyAvailable && <Badge variant="success" icon={ShieldCheck}>Warranty Available</Badge>}
                  {form.negotiable && <Badge variant="warning">Negotiable</Badge>}
                </div>
                <h3 className="text-lg font-bold text-text">{form.title || 'Untitled listing'}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  {form.brand} • {form.model} • Bought in {form.purchaseYear}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={13} aria-hidden="true" /> {form.locality}{form.locality && form.city ? ', ' : ''}{form.city}
                </p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  {form.billAvailable && <span className="flex items-center gap-1.5"><Check size={14} /> Bill Available</span>}
                  {form.boxAvailable && <span className="flex items-center gap-1.5"><Package size={14} /> Box Available</span>}
                </div>
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
                <p className="mt-4 text-2xl font-extrabold text-text">
                  {form.price ? formatCurrencyFull(Number(form.price)) : '—'}
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
