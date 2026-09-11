import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Check, Clock, ImagePlus, MapPin,
  Rocket, ShieldCheck, Tag, Upload, User, Wrench, X,
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
import { useSparePartsListings } from '../hooks/useSparePartsListings'
import sparePartsListingService from '../services/sparePartsListingService'
import { sparePartCategories } from '../data/spareParts'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'

const PART_CATEGORY_OPTIONS = [...sparePartCategories, 'Other'].map((c) => ({ value: c, label: c }))
const CONDITION_OPTIONS = [{ value: 'NEW', label: 'New' }, { value: 'USED', label: 'Used (Refurbished/Old)' }]

const initialForm = () => ({
  category: '',
  subCategory: '',
  brand: '',
  partNumber: '',
  title: '',
  condition: 'NEW',
  description: '',
  price: '',
  negotiable: false,
  compatibleVehicleBrand: '',
  compatibleVehicleModel: '',
  compatibleVehicleVariant: '',
})

export default function SellSparePart() {
  const { isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const { createListing, submitListing } = useSparePartsListings()
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
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)].slice(0, 8))
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const detailsValid = !!form.category && form.brand.trim().length > 1 && form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const imagesValid = selectedFiles.length > 0
  const canSubmit = imagesValid && detailsValid && pricingValid

  const TABS = [
    { id: 'details', label: 'Part Details', valid: detailsValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'photos', label: 'Photos', valid: imagesValid },
    { id: 'preview', label: 'Preview' },
  ]

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    subCategory: form.subCategory.trim(),
    brand: form.brand.trim(),
    partNumber: form.partNumber.trim(),
    price: Number(form.price) || 0,
    negotiable: form.negotiable,
    condition: form.condition,
    compatibleVehicleBrand: form.compatibleVehicleBrand.trim(),
    compatibleVehicleModel: form.compatibleVehicleModel.trim(),
    compatibleVehicleVariant: form.compatibleVehicleVariant.trim(),
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
        await sparePartsListingService.uploadImages(slug, selectedFiles)
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
        await sparePartsListingService.uploadImages(slug, selectedFiles)
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
            List Another Part
          </Button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isKycVerified) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Spare Parts' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname} />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Spare Parts' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Sell a Spare Part</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          List batteries, tyres, engine parts, accessories &amp; more &mdash; free, always reviewed by our team before it goes live.
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

        {activeTab === 'details' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Part details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Category *" value={form.category} onChange={(v) => update('category', v)} placeholder="Select category" options={PART_CATEGORY_OPTIONS} />
              <Input label="Sub Category" placeholder="e.g. Battery" value={form.subCategory} onChange={(e) => update('subCategory', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Brand *" icon={Tag} placeholder="e.g. Bosch, MRF" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
              <Input label="Part Number" placeholder="e.g. 0 092 S40 040" value={form.partNumber} onChange={(e) => update('partNumber', e.target.value)} />
            </div>
            <Input label="Part Title *" icon={Wrench} placeholder="e.g. Bosch S4 Car Battery 65Ah" value={form.title} onChange={(e) => update('title', e.target.value)} />
            
            <h3 className="text-sm font-bold text-text mt-4">Vehicle Compatibility (Optional)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Brand" placeholder="e.g. Maruti" value={form.compatibleVehicleBrand} onChange={(e) => update('compatibleVehicleBrand', e.target.value)} />
              <Input label="Model" placeholder="e.g. Swift" value={form.compatibleVehicleModel} onChange={(e) => update('compatibleVehicleModel', e.target.value)} />
              <Input label="Variant" placeholder="e.g. VXI" value={form.compatibleVehicleVariant} onChange={(e) => update('compatibleVehicleVariant', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown label="Condition *" value={form.condition} onChange={(v) => update('condition', v)} options={CONDITION_OPTIONS} />
            </div>
            <TextArea label="Description *" placeholder="Describe condition, usage history, reason for selling..." value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text">Pricing</h2>
            <Input label="Selling Price (₹) *" type="number" placeholder="e.g. 8499" value={form.price} onChange={(e) => update('price', e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input type="checkbox" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              Price is negotiable
            </label>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Upload photos of the part</h2>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-10 text-center hover:border-primary/40">
              <Upload size={28} className="text-text-light" aria-hidden="true" />
              <span className="text-sm font-semibold text-text">Click to upload photos</span>
              <span className="text-xs text-text-light">PNG, JPG up to 10MB (max 8 photos)</span>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-5 grid grid-cols-4 gap-3">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                    <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label="Remove photo"
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))}
                {selectedFiles.length < 8 && (
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-text-light hover:border-primary/40">
                    <ImagePlus size={20} aria-hidden="true" />
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              {selectedFiles[0] && <img src={URL.createObjectURL(selectedFiles[0])} alt="" className="h-56 w-full object-cover" />}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {form.category && <Badge variant="warning" icon={Wrench}>{form.category}</Badge>}
                  {form.brand && <Badge variant="neutral">{form.brand}</Badge>}
                  <Badge variant={form.condition === 'NEW' ? 'success' : 'neutral'}>{form.condition === 'NEW' ? 'New' : 'Used'}</Badge>
                </div>
                <h3 className="mt-2 text-lg font-bold text-text">{form.title || 'Untitled part'}</h3>
                {(form.compatibleVehicleBrand || form.compatibleVehicleModel || form.compatibleVehicleVariant) && (
                  <p className="mt-1 text-xs text-text-secondary">Fits: {form.compatibleVehicleBrand} {form.compatibleVehicleModel} {form.compatibleVehicleVariant}</p>
                )}
                <p className="mt-3 text-sm text-text-secondary">{form.description}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-text">{form.price ? formatCurrencyFull(Number(form.price)) : '—'}</p>
                  {form.negotiable && <Badge variant="warning">Negotiable</Badge>}
                </div>
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
