import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle, Archive, Check, CheckCircle2, Clock, ImagePlus, Pencil, Plus,
  RefreshCw, Rocket, ShieldCheck, Tag, Trash2, Upload, Wrench, X,
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
import sparePartsListingService, { SPARE_PARTS_CONDITIONS } from '../services/sparePartsListingService'
import { sparePartCategories } from '../data/spareParts'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'

const PART_CATEGORY_OPTIONS = [...sparePartCategories, 'Other'].map((c) => ({ value: c, label: c }))
const CONDITION_OPTIONS = SPARE_PARTS_CONDITIONS

const LISTING_STATUS_VARIANT = {
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'success',
  AVAILABLE: 'success',
  REJECTED: 'danger',
  ARCHIVED: 'neutral',
  SOLD: 'info',
}

const LISTING_STATUS_LABEL = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Under Review',
  APPROVED: 'Live / Approved',
  AVAILABLE: 'Available',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
  SOLD: 'Sold',
}

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
  const {
    listings: sparePartsListings,
    loading: listingsLoading,
    fetchListings,
    createListing,
    patchListing,
    deleteListing,
    submitListing,
    makeAvailableListing,
    archiveListing,
  } = useSparePartsListings()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    fetchListings().catch(() => { })
  }, [fetchListings])

  // View state: 'create' or 'listings'
  const [viewMode, setViewMode] = useState(() => searchParams.get('mode') === 'listings' ? 'listings' : 'create')

  // Step tabs inside form
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'details')
  const [form, setForm] = useState(initialForm)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editingSlug, setEditingSlug] = useState(() => searchParams.get('slug') || null)

  // URL search parameter synchronization
  useEffect(() => {
    const modeParam = searchParams.get('mode') || 'create'
    const slugParam = searchParams.get('slug')
    const tabParam = searchParams.get('tab')

    if (modeParam === 'listings') {
      setViewMode('listings')
      setEditingSlug(null)
    } else if (modeParam === 'edit' && slugParam) {
      setViewMode('create')
      if (editingSlug !== slugParam) {
        setEditingSlug(slugParam)
        sparePartsListingService.getBySlug(slugParam).then((detail) => {
          if (detail) {
            setForm({
              category: detail.category || '',
              subCategory: detail.subCategory || '',
              brand: detail.brand || '',
              partNumber: detail.partNumber || '',
              title: detail.title || '',
              condition: detail.condition || 'NEW',
              description: detail.description || '',
              price: detail.price ?? '',
              negotiable: Boolean(detail.negotiable),
              compatibleVehicleBrand: detail.compatibleVehicleBrand || '',
              compatibleVehicleModel: detail.compatibleVehicleModel || '',
              compatibleVehicleVariant: detail.compatibleVehicleVariant || '',
            })
          }
        }).catch((err) => console.warn('Error loading spare part by slug from URL:', err))
      }
    } else {
      setViewMode('create')
    }

    if (tabParam && ['details', 'pricing', 'photos', 'preview'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // API status messages
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState(null)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)].slice(0, 8))
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Form Validation
  const detailsValid = !!form.category && form.brand.trim().length > 1 && form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const imagesValid = selectedFiles.length > 0 || Boolean(editingSlug)
  const canSubmit = detailsValid && pricingValid

  const TABS = [
    { id: 'details', label: 'Part Details', valid: detailsValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'photos', label: 'Photos', valid: imagesValid },
    { id: 'preview', label: 'Preview' },
  ]

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category || 'Other',
    subCategory: form.subCategory.trim(),
    brand: form.brand.trim(),
    partNumber: form.partNumber.trim(),
    price: Number(form.price) || 0,
    negotiable: Boolean(form.negotiable),
    condition: form.condition || 'NEW',
    compatibleVehicleBrand: form.compatibleVehicleBrand.trim(),
    compatibleVehicleModel: form.compatibleVehicleModel.trim(),
    compatibleVehicleVariant: form.compatibleVehicleVariant.trim(),
  })

  // Submit for Review / Verification
  const handlePublish = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      let slug = editingSlug
      if (slug) {
        await patchListing(slug, buildPayload())
      } else {
        const created = await createListing(buildPayload())
        slug = created?.slug
      }

      if (slug && selectedFiles.length > 0) {
        try {
          await sparePartsListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      if (slug) {
        await submitListing(slug)
      }

      setApiSuccessMsg('Spare part listing submitted for review! Our team will review it shortly.')
      await fetchListings()
      setTimeout(() => {
        setSearchParams({ mode: 'listings' })
      }, 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit spare part listing.'
      setApiErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Save as Draft
  const handleSaveDraft = async () => {
    if (!detailsValid || submitting) return
    setSubmitting(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      let slug = editingSlug
      if (slug) {
        await patchListing(slug, buildPayload())
      } else {
        const created = await createListing(buildPayload())
        slug = created?.slug
      }

      if (slug && selectedFiles.length > 0) {
        try {
          await sparePartsListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      setApiSuccessMsg('Draft saved successfully! You can view and manage it from your Spare Parts Listings.')
      await fetchListings()
      setTimeout(() => {
        setSearchParams({ mode: 'listings' })
      }, 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save draft.'
      setApiErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Start new spare part creation
  const handleStartNewSparePart = () => {
    setEditingSlug(null)
    setForm(initialForm())
    setSelectedFiles([])
    setActiveTab('details')
    setApiErrorMsg(null)
    setApiSuccessMsg(null)
    setSearchParams({ mode: 'create', tab: 'details' })
  }

  // Populate form for editing existing spare part
  const handleEditSparePartCard = async (item) => {
    setEditingSlug(item.slug)
    setSearchParams({ mode: 'edit', slug: item.slug, tab: 'details' })
    setForm({
      category: item.category || '',
      subCategory: item.subCategory || '',
      brand: item.brand || '',
      partNumber: item.partNumber || '',
      title: item.title || '',
      condition: item.condition || 'NEW',
      description: item.description || '',
      price: item.price || '',
      negotiable: Boolean(item.negotiable),
      compatibleVehicleBrand: item.compatibleVehicleBrand || '',
      compatibleVehicleModel: item.compatibleVehicleModel || '',
      compatibleVehicleVariant: item.compatibleVehicleVariant || '',
    })
    setSelectedFiles([])
    setActiveTab('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const detail = await sparePartsListingService.getBySlug(item.slug)
      if (detail) {
        setForm((prev) => ({
          ...prev,
          category: detail.category || prev.category,
          subCategory: detail.subCategory || prev.subCategory,
          brand: detail.brand || prev.brand,
          partNumber: detail.partNumber || prev.partNumber,
          title: detail.title || prev.title,
          condition: detail.condition || prev.condition,
          description: detail.description || prev.description,
          price: detail.price ?? prev.price,
          negotiable: detail.negotiable ?? prev.negotiable,
          compatibleVehicleBrand: detail.compatibleVehicleBrand || prev.compatibleVehicleBrand,
          compatibleVehicleModel: detail.compatibleVehicleModel || prev.compatibleVehicleModel,
          compatibleVehicleVariant: detail.compatibleVehicleVariant || prev.compatibleVehicleVariant,
        }))
      }
    } catch (err) {
      console.warn('Failed to fetch full spare part details:', err)
    }
  }

  const handleDeleteSparePartCard = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this spare part listing?')) return
    setDeletingSlug(slug)
    try {
      await deleteListing(slug)
      setApiSuccessMsg('Spare part listing deleted successfully!')
    } catch (err) {
      alert(`Failed to delete spare part: ${err?.response?.data?.message || err?.message}`)
    } finally {
      setDeletingSlug(null)
    }
  }

  const handleMakeSparePartAvailable = async (slug) => {
    try {
      await makeAvailableListing(slug)
      setApiSuccessMsg('Spare part marked as Available!')
    } catch (err) {
      alert(`Failed to make spare part available: ${err?.response?.data?.message || err?.message}`)
    }
  }

  const handleArchiveSparePart = async (slug) => {
    if (!window.confirm('Archive this spare part listing?')) return
    try {
      await archiveListing(slug)
      setApiSuccessMsg('Spare part listing archived!')
    } catch (err) {
      alert(`Failed to archive spare part: ${err?.response?.data?.message || err?.message}`)
    }
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

      {/* Top Header Mode Toggle & Actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Spare Parts Management &amp; Selling</h1>
          <p className="mt-1 text-sm text-text-secondary">
            List batteries, tyres, engine parts &amp; accessories &mdash; manage photos, status &amp; approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => setSearchParams({ mode: editingSlug ? 'edit' : 'create', ...(editingSlug ? { slug: editingSlug } : {}), tab: activeTab })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'create' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Plus size={14} /> {editingSlug ? 'Edit Spare Part' : 'Create Spare Part'}
            </button>
            <button
              type="button"
              onClick={() => {
                fetchListings()
                setSearchParams({ mode: 'listings' })
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'listings' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Wrench size={14} /> My Spare Parts Listings ({sparePartsListings.length})
            </button>
          </div>

          <Button variant="primary" icon={Wrench} onClick={handleStartNewSparePart}>
            Sell Spare Part
          </Button>
        </div>
      </div>

      {/* System Feedback Banners */}
      {apiSuccessMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success shadow-soft">
          <ShieldCheck size={20} className="shrink-0 text-success" />
          <span>{apiSuccessMsg}</span>
          <button type="button" onClick={() => setApiSuccessMsg(null)} className="ml-auto text-success/70 hover:text-success">
            <X size={16} />
          </button>
        </div>
      )}

      {apiErrorMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm font-semibold text-danger shadow-soft">
          <AlertCircle size={20} className="shrink-0 text-danger" />
          <span>{apiErrorMsg}</span>
          <button type="button" onClick={() => setApiErrorMsg(null)} className="ml-auto text-danger/70 hover:text-danger">
            <X size={16} />
          </button>
        </div>
      )}

      {/* MODE 1: CREATE / EDIT SPARE PART FORM */}
      {viewMode === 'create' && (
        <div className="mx-auto max-w-3xl">
          {editingSlug && (
            <div className="mb-6 flex items-center justify-between rounded-xl bg-primary/10 p-4 text-sm font-semibold text-primary">
              <span>Editing Spare Part: {editingSlug}</span>
              <button type="button" onClick={handleStartNewSparePart} className="text-xs underline hover:no-underline">
                Cancel Edit
              </button>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearchParams({ mode: editingSlug ? 'edit' : 'create', ...(editingSlug ? { slug: editingSlug } : {}), tab: tab.id })
                }}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-text-secondary hover:text-text'
                )}
              >
                {tab.valid && <CheckCircle2 size={16} className="text-success" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            {activeTab === 'details' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-text">Part details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Dropdown
                    label="Category *"
                    value={form.category}
                    onChange={(v) => update('category', v)}
                    placeholder="Select category"
                    options={PART_CATEGORY_OPTIONS}
                  />
                  <Input
                    label="Sub Category"
                    placeholder="e.g. Battery, Brake Pad"
                    value={form.subCategory}
                    onChange={(e) => update('subCategory', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Brand *"
                    icon={Tag}
                    placeholder="e.g. Bosch, MRF, Amaron"
                    value={form.brand}
                    onChange={(e) => update('brand', e.target.value)}
                  />
                  <Input
                    label="Part Number"
                    placeholder="e.g. 0 092 S40 040"
                    value={form.partNumber}
                    onChange={(e) => update('partNumber', e.target.value)}
                  />
                </div>

                <Input
                  label="Part Title *"
                  icon={Wrench}
                  placeholder="e.g. Bosch S4 Car Battery 65Ah"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                />

                <Dropdown
                  label="Condition *"
                  value={form.condition}
                  onChange={(v) => update('condition', v)}
                  options={CONDITION_OPTIONS}
                />

                <div className="border-t border-border pt-4">
                  <h3 className="mb-3 text-sm font-bold text-text">Compatible Vehicle Info (Optional)</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Input
                      label="Vehicle Brand"
                      placeholder="e.g. Maruti Suzuki"
                      value={form.compatibleVehicleBrand}
                      onChange={(e) => update('compatibleVehicleBrand', e.target.value)}
                    />
                    <Input
                      label="Vehicle Model"
                      placeholder="e.g. Swift"
                      value={form.compatibleVehicleModel}
                      onChange={(e) => update('compatibleVehicleModel', e.target.value)}
                    />
                    <Input
                      label="Vehicle Variant"
                      placeholder="e.g. VXi / ZXi"
                      value={form.compatibleVehicleVariant}
                      onChange={(e) => update('compatibleVehicleVariant', e.target.value)}
                    />
                  </div>
                </div>

                <TextArea
                  label="Description *"
                  placeholder="Describe condition, compatibility, age, warranty, reason for selling..."
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-text">Pricing</h2>
                <Input
                  label="Selling Price (₹) *"
                  type="number"
                  placeholder="e.g. 4500"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
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

            {activeTab === 'photos' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-text">Photos</h2>
                <p className="-mt-3 text-xs text-text-secondary">Upload clear photos of the part, part number tag, and packaging.</p>

                <div className="flex flex-col gap-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-alt py-10 transition-colors hover:border-primary hover:bg-primary/5">
                    <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary">
                      <ImagePlus size={24} />
                    </div>
                    <p className="font-semibold text-text">Click to upload photos</p>
                    <p className="mt-1 text-xs text-text-light">JPG, PNG, WEBP (Max 8 photos, 5MB each)</p>
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

            {activeTab === 'preview' && (
              <div>
                <h2 className="mb-5 text-lg font-bold text-text">Preview your listing</h2>
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="bg-gradient-to-br from-primary/10 via-surface-alt to-surface p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="primary" icon={Wrench}>{form.category || 'Spare Part'}</Badge>
                      <Badge variant="neutral">{form.condition}</Badge>
                      {form.negotiable && <Badge variant="warning">Negotiable</Badge>}
                    </div>
                    <h3 className="text-xl font-extrabold text-text sm:text-2xl">{form.title || 'Untitled Part'}</h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      Brand: {form.brand || 'N/A'} {form.partNumber ? `· Part #: ${form.partNumber}` : ''}
                    </p>

                    {(form.compatibleVehicleBrand || form.compatibleVehicleModel) && (
                      <p className="mt-1 text-xs text-text-light">
                        Compatible with: {form.compatibleVehicleBrand} {form.compatibleVehicleModel} {form.compatibleVehicleVariant}
                      </p>
                    )}

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-extrabold text-primary">
                        {form.price ? formatCurrencyFull(Number(form.price)) : '₹0'}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-text-secondary">
                      <p className="font-semibold text-text">Description:</p>
                      <p className="mt-1 whitespace-pre-line">{form.description || 'No description provided.'}</p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {selectedFiles.map((f, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(f)}
                            alt=""
                            className="h-16 w-20 shrink-0 rounded-lg border border-border object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <Button type="button" variant="ghost" onClick={() => setForm(initialForm())}>
                Reset Form
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={submitting} onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button type="button" variant="primary" icon={Rocket} disabled={!canSubmit || submitting} onClick={handlePublish}>
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: MY SPARE PARTS LISTINGS */}
      {viewMode === 'listings' && (
        <div>
          {listingsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <RefreshCw size={32} className="animate-spin text-primary" />
              <p className="mt-3 text-sm text-text-secondary">Loading your spare part listings...</p>
            </div>
          ) : sparePartsListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-soft">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wrench size={32} />
              </div>
              <h3 className="text-xl font-bold text-text">No Spare Part Listings Found</h3>
              <p className="mt-1 text-xs text-text-secondary">List your batteries, tyres, engine parts, or accessories to reach buyers across SwipeDeals.</p>
              <Button variant="primary" className="mt-6" icon={Plus} onClick={handleStartNewSparePart}>
                Sell Spare Part
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sparePartsListings.map((item) => {
                const imagesList = Array.isArray(item.images) ? item.images : []
                const primaryImgObj = imagesList.find((img) => img.isPrimary) || imagesList[0]
                const primaryImage = primaryImgObj?.imageUrl || primaryImgObj?.url || (typeof primaryImgObj === 'string' ? primaryImgObj : PLACEHOLDER_IMAGE)
                const imagesCount = imagesList.length

                return (
                  <div key={item.slug || item.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:border-primary/40">
                    <div className="flex flex-col gap-6 p-6 lg:flex-row">
                      {/* Image Preview & Badges */}
                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-surface-alt lg:w-64">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                          {imagesCount} {imagesCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <div className="absolute right-2 top-2">
                          <Badge variant={LISTING_STATUS_VARIANT[item.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[item.status] || item.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Details & Specs */}
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {item.category || 'Spare Part'} · {item.brand}
                            </span>
                            <h3 className="text-xl font-extrabold text-text">{item.title}</h3>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-2xl font-extrabold text-text">
                              {formatCurrencyFull(item.price)}
                            </p>
                            {item.negotiable && <span className="text-[11px] font-semibold text-warning">Negotiable</span>}
                          </div>
                        </div>

                        {/* Rejection Notice */}
                        {(item.status === 'REJECTED' || item.rejectionReason) && (
                          <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                            <strong>Rejection Reason:</strong> {item.rejectionReason || 'Spare part details require verification.'}
                          </div>
                        )}

                        {/* Key Attributes Bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                          <span>Category: <strong>{item.category || 'N/A'}</strong></span>
                          <span>Sub Category: <strong>{item.subCategory || 'N/A'}</strong></span>
                          <span>Part #: <strong>{item.partNumber || 'N/A'}</strong></span>
                          <span>Condition: <strong>{item.condition}</strong></span>
                        </div>

                        {(item.compatibleVehicleBrand || item.compatibleVehicleModel) && (
                          <p className="text-xs text-text-light font-mono">
                            Compatible: {item.compatibleVehicleBrand} {item.compatibleVehicleModel} {item.compatibleVehicleVariant}
                          </p>
                        )}

                        {item.description && (
                          <p className="line-clamp-2 text-xs text-text-secondary">{item.description}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4 mt-4">
                          {item.status === 'DRAFT' && (
                            <Button
                              size="xs"
                              variant="primary"
                              icon={Rocket}
                              className="font-extrabold shadow-soft px-2 py-2"
                              onClick={async () => {
                                try {
                                  await submitListing(item.slug)
                                  setApiSuccessMsg('Spare part submitted for review!')
                                } catch (err) {
                                  alert(`Failed to submit: ${err?.message}`)
                                }
                              }}
                            >
                              Submit for Review
                            </Button>
                          )}

                          {item.status !== 'AVAILABLE' && item.status !== 'APPROVED' && (
                            <Button
                              size="xs"
                              variant="outline"
                              icon={CheckCircle2}
                              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                              onClick={() => handleMakeSparePartAvailable(item.slug)}
                            >
                              Make Available
                            </Button>
                          )}

                          {item.status !== 'ARCHIVED' && (
                            <Button
                              size="xs"
                              variant="outline"
                              icon={Archive}
                              className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                              onClick={() => handleArchiveSparePart(item.slug)}
                            >
                              Archive
                            </Button>
                          )}

                          <Button
                            size="xs"
                            variant="outline"
                            icon={Pencil}
                            className="border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                            onClick={() => handleEditSparePartCard(item)}
                          >
                            Edit Details
                          </Button>

                          <Button
                            size="xs"
                            variant="outline"
                            icon={Trash2}
                            className="border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                            disabled={deletingSlug === item.slug}
                            onClick={() => handleDeleteSparePartCard(item.slug)}
                          >
                            {deletingSlug === item.slug ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
