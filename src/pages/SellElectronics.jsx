import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle, Archive, Check, CheckCircle2, Clock, ImagePlus, Laptop, MapPin,
  Package, Pencil, Phone, Plus, RefreshCw, Rocket, ShieldCheck, Tag, Trash2, Upload, User, X,
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
import electronicsListingService, {
  ELECTRONICS_TYPES,
  ELECTRONICS_CONDITIONS,
  prepareElectronicsPayload,
} from '../services/electronicsListingService'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'

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
  type: 'MOBILE_PHONE',
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
})

export default function SellElectronics() {
  const { isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()
  const {
    listings: electronicsListings,
    loading: listingsLoading,
    fetchListings,
    createListing,
    patchListing,
    deleteListing,
    submitListing,
    makeAvailableListing,
    archiveListing,
  } = useElectronicsListings()
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
        electronicsListingService.getBySlug(slugParam).then((detail) => {
          if (detail) {
            setForm({
              type: detail.type || 'MOBILE_PHONE',
              brand: detail.brand || '',
              model: detail.model || '',
              title: detail.title || '',
              condition: detail.condition || 'NEW',
              purchaseYear: detail.purchaseYear || new Date().getFullYear(),
              warrantyAvailable: Boolean(detail.warrantyAvailable),
              billAvailable: Boolean(detail.billAvailable),
              boxAvailable: Boolean(detail.boxAvailable),
              description: detail.description || '',
              price: detail.price ?? '',
              negotiable: Boolean(detail.negotiable),
            })
          }
        }).catch((err) => console.warn('Error loading electronics by slug from URL:', err))
      }
    } else {
      setViewMode('create')
    }

    if (tabParam && ['details', 'pricing', 'images', 'preview'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // API status messages
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Modal image manager slug
  const [managingImagesSlug, setManagingImagesSlug] = useState(null)
  const [deletingSlug, setDeletingSlug] = useState(null)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Form Validation
  const detailsValid = !!form.type && form.brand.trim().length > 1 && form.title.trim().length > 2 && form.description.trim().length > 5
  const pricingValid = Number(form.price) > 0
  const imagesValid = selectedFiles.length > 0 || Boolean(editingSlug)
  const canSubmit = detailsValid && pricingValid

  const TABS = [
    { id: 'details', label: 'Product Details', valid: detailsValid },
    { id: 'pricing', label: 'Pricing', valid: pricingValid },
    { id: 'images', label: 'Photos', valid: imagesValid },
    { id: 'preview', label: 'Preview' },
  ]

  const buildPayload = () => prepareElectronicsPayload(form)

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
          await electronicsListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      if (slug) {
        await submitListing(slug)
      }

      setApiSuccessMsg('Electronics listing submitted for review! Our team will review it shortly.')
      await fetchListings()
      setTimeout(() => {
        setSearchParams({ mode: 'listings' })
      }, 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit electronics listing.'
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
          await electronicsListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      setApiSuccessMsg('Draft saved successfully! You can view and manage it from your Electronics Listings.')
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

  // Start new electronics creation
  const handleStartNewElectronics = () => {
    setEditingSlug(null)
    setForm(initialForm())
    setSelectedFiles([])
    setActiveTab('details')
    setApiErrorMsg(null)
    setApiSuccessMsg(null)
    setSearchParams({ mode: 'create', tab: 'details' })
  }

  // Populate form for editing existing electronics
  const handleEditElectronicsCard = async (item) => {
    setEditingSlug(item.slug)
    setSearchParams({ mode: 'edit', slug: item.slug, tab: 'details' })

    setForm({
      type: item.type || 'MOBILE_PHONE',
      brand: item.brand || '',
      model: item.model || '',
      title: item.title || '',
      condition: item.condition || 'NEW',
      purchaseYear: item.purchaseYear || new Date().getFullYear(),
      warrantyAvailable: Boolean(item.warrantyAvailable),
      billAvailable: Boolean(item.billAvailable),
      boxAvailable: Boolean(item.boxAvailable),
      description: item.description || '',
      price: item.price || '',
      negotiable: Boolean(item.negotiable),
    })
    setSelectedFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const detail = await electronicsListingService.getBySlug(item.slug)
      if (detail) {
        setForm((prev) => ({
          ...prev,
          type: detail.type || prev.type,
          brand: detail.brand || prev.brand,
          model: detail.model || prev.model,
          title: detail.title || prev.title,
          condition: detail.condition || prev.condition,
          purchaseYear: detail.purchaseYear || prev.purchaseYear,
          warrantyAvailable: detail.warrantyAvailable ?? prev.warrantyAvailable,
          billAvailable: detail.billAvailable ?? prev.billAvailable,
          boxAvailable: detail.boxAvailable ?? prev.boxAvailable,
          description: detail.description || prev.description,
          price: detail.price ?? prev.price,
          negotiable: detail.negotiable ?? prev.negotiable,
        }))
      }
    } catch (err) {
      console.warn('Failed to fetch full electronics details:', err)
    }
  }

  const handleDeleteElectronicsCard = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this electronics listing?')) return
    setDeletingSlug(slug)
    try {
      await deleteListing(slug)
      setApiSuccessMsg('Electronics listing deleted successfully!')
    } catch (err) {
      alert(`Failed to delete listing: ${err?.response?.data?.message || err?.message}`)
    } fontFinally: {
      setDeletingSlug(null)
    }
  }

  const handleMakeElectronicsAvailable = async (slug) => {
    try {
      await makeAvailableListing(slug)
      setApiSuccessMsg('Electronics marked as Available!')
    } catch (err) {
      alert(`Failed to make electronics available: ${err?.response?.data?.message || err?.message}`)
    }
  }

  const handleArchiveElectronics = async (slug) => {
    if (!window.confirm('Archive this electronics listing?')) return
    try {
      await archiveListing(slug)
      setApiSuccessMsg('Electronics listing archived!')
    } catch (err) {
      alert(`Failed to archive electronics: ${err?.response?.data?.message || err?.message}`)
    }
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

      {/* Top Header Mode Toggle & Actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Electronics Management &amp; Selling</h1>
          <p className="mt-1 text-sm text-text-secondary">
            List mobiles, laptops, TVs, cameras &amp; appliances &mdash; manage photos, status &amp; approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => setSearchParams({ mode: 'create', tab: 'details' })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'create' && !editingSlug ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Plus size={14} /> Create Electronics
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
              <Laptop size={14} /> My Electronics Listings ({electronicsListings.length})
            </button>
          </div>

          <Button variant="primary" icon={Laptop} onClick={handleStartNewElectronics}>
            Sell Electronics
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

      {/* MODE 1: CREATE ELECTRONICS FORM */}
      {viewMode === 'create' && (
        <div>
          <div className="mb-6 flex flex-wrap gap-4 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearchParams({
                    mode: editingSlug ? 'edit' : 'create',
                    ...(editingSlug ? { slug: editingSlug } : {}),
                    tab: tab.id,
                  })
                }}
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

          <div className="mx-auto max-w-full rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
            {activeTab === 'details' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text">Product details</h2>
                  {editingSlug && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                      Editing Item: {editingSlug}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Dropdown label="Category *" value={form.type} onChange={(v) => update('type', v)} placeholder="Select category" options={ELECTRONICS_TYPES} />
                  <Dropdown label="Condition *" value={form.condition} onChange={(v) => update('condition', v)} options={ELECTRONICS_CONDITIONS} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Brand *" icon={Tag} placeholder="e.g. Apple, Samsung, Sony" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
                  <Input label="Model" placeholder="e.g. iPhone 15 Pro Max" value={form.model} onChange={(e) => update('model', e.target.value)} />
                </div>
                <Input label="Listing Title *" icon={Laptop} placeholder="e.g. Apple iPhone 15 Pro Max 256GB" value={form.title} onChange={(e) => update('title', e.target.value)} />
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
                <TextArea label="Description *" placeholder="Describe condition, usage, accessories included, reason for selling..." value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-text">Pricing</h2>
                <Input label="Selling Price (₹) *" type="number" placeholder="e.g. 139900" value={form.price} onChange={(e) => update('price', e.target.value)} />
                <label className="flex items-center gap-2 text-sm text-text">
                  <input type="checkbox" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  Price is negotiable
                </label>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-text">Photos</h2>
                <p className="-mt-3 text-xs text-text-secondary">Upload high quality photos of the product to get more inquiries.</p>

                <div className="flex flex-col gap-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-alt py-10 transition-colors hover:border-primary hover:bg-primary/5">
                    <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary">
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
                {canSubmit ? 'All set — ready to submit.' : 'Complete the required fields before submitting.'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={!detailsValid || submitting} onClick={handleSaveDraft}>
                  {submitting ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button variant="primary" icon={Rocket} disabled={!canSubmit || submitting} onClick={handlePublish}>
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: MY ELECTRONICS LISTINGS VIEW */}
      {viewMode === 'listings' && (
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                {electronicsListings.length}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">Your Electronics Listings</h2>
                <p className="text-xs text-text-secondary">All electronics created and submitted for review</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchListings()}
                disabled={listingsLoading}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text hover:bg-surface-alt"
              >
                <RefreshCw size={14} className={cn(listingsLoading && 'animate-spin')} /> Refresh
              </button>

              <Button variant="primary" icon={Plus} onClick={handleStartNewElectronics}>
                Sell Electronics
              </Button>
            </div>
          </div>

          {electronicsListings.length === 0 && !listingsLoading ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center shadow-soft">
              <Laptop size={48} className="mx-auto mb-3 text-text-light/50" />
              <h3 className="text-base font-bold text-text">No electronics listings found</h3>
              <p className="mt-1 text-xs text-text-secondary">List your mobiles, laptops, TVs, or appliances to reach buyers across SwipeDeals.</p>
              <Button variant="primary" className="mt-6" icon={Plus} onClick={handleStartNewElectronics}>
                Sell Electronics
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {electronicsListings.map((item) => {
                const imagesList = Array.isArray(item.images) ? item.images : []
                const primaryImgObj = imagesList.find((img) => img.isPrimary) || imagesList[0]
                const primaryImage = primaryImgObj?.imageUrl || primaryImgObj?.url || (typeof primaryImgObj === 'string' ? primaryImgObj : PLACEHOLDER_IMAGE)
                const imagesCount = imagesList.length
                const typeLabel = ELECTRONICS_TYPES.find((t) => t.value === item.type)?.label || item.type || 'Electronics'

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
                              {typeLabel} · {item.brand}
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
                            <strong>Rejection Reason:</strong> {item.rejectionReason || 'Electronics details require verification.'}
                          </div>
                        )}

                        {/* Key Attributes Bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                          <span>Brand: <strong>{item.brand}</strong></span>
                          <span>Model: <strong>{item.model}</strong></span>
                          <span>Bought: <strong>{item.purchaseYear}</strong></span>
                          <span>Condition: <strong>{item.condition}</strong></span>
                          {item.warrantyAvailable && <span className="text-success font-semibold">Warranty</span>}
                          {item.billAvailable && <span className="text-info font-semibold">Bill</span>}
                          {item.boxAvailable && <span className="text-warning font-semibold">Box</span>}
                        </div>

                        {item.description && (
                          <p className="line-clamp-2 text-xs text-text-secondary">{item.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-alt/40 px-6 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          icon={ImagePlus}
                          onClick={() => setManagingImagesSlug(item.slug)}
                        >
                          Photos ({imagesCount})
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {item.status === 'DRAFT' && (
                          <Button
                            size="xs"
                            variant="primary"
                            icon={Rocket}
                            className="font-extrabold shadow-soft px-2 py-2"
                            onClick={() => {
                              if (window.confirm('Submit this electronics item for review?')) {
                                submitListing(item.slug)
                              }
                            }}
                          >
                            Submit for Review
                          </Button>
                        )}

                        {item.status !== 'AVAILABLE' && item.status !== 'DRAFT' && (
                          <Button
                            size="xs"
                            variant="outline"
                            icon={CheckCircle2}
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                            onClick={() => handleMakeElectronicsAvailable(item.slug)}
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
                            onClick={() => handleArchiveElectronics(item.slug)}
                          >
                            Archive
                          </Button>
                        )}

                        <Button
                          size="xs"
                          variant="outline"
                          icon={Pencil}
                          className="border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                          onClick={() => handleEditElectronicsCard(item)}
                        >
                          Edit Details
                        </Button>

                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white font-bold transition-all shadow-xs px-2 py-2"
                          disabled={deletingSlug === item.slug}
                          onClick={() => handleDeleteElectronicsCard(item.slug)}
                        >
                          {deletingSlug === item.slug ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal image manager */}
      {managingImagesSlug && (
        <ElectronicsImagesManager
          slug={managingImagesSlug}
          onClose={() => {
            setManagingImagesSlug(null)
            fetchListings()
          }}
        />
      )}
    </div>
  )
}
