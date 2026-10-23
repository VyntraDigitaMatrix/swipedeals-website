import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle, Archive, Check, CheckCircle2, Clock, Eye, ImagePlus, Pencil, Plus,
  RefreshCw, Rocket, ShieldCheck, Tag, Trash2, Upload, Wrench, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Dropdown from '../components/forms/Dropdown'
import Badge from '../components/common/Badge'
import SellAccessGate from '../components/common/SellAccessGate'
import ConfirmModal from '../components/common/ConfirmModal'
import SparePartsImagesManager from '../components/dashboard/SparePartsImagesManager'
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
  const { isAuthenticated, user } = useAuth()
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
  const { slug } = useParams()

  useEffect(() => {
    fetchListings().catch(() => { })
  }, [fetchListings])

  const viewMode = location.pathname === '/sell/spare-parts' ? 'listings' : 'create'

  // Step tabs inside form
  const [activeTab, setActiveTab] = useState('details')
  const [form, setForm] = useState(initialForm)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editingSlug, setEditingSlug] = useState(slug || null)

  useEffect(() => {
    if (viewMode === 'listings') {
      setEditingSlug(null)
      return
    }

    if (location.pathname === '/sell/spare-parts/add-part') {
      if (editingSlug !== null) {
        setEditingSlug(null)
        setForm(initialForm())
        setSelectedFiles([])
      }
      return
    }

    if (slug && editingSlug !== slug) {
      setEditingSlug(slug)
      sparePartsListingService.getBySlug(slug).then((detail) => {
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
  }, [location.pathname, slug, viewMode, editingSlug])

  // API status messages
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', slug: '', processing: false })
  const [managingImagesSlug, setManagingImagesSlug] = useState(null)

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
        navigate('/sell/spare-parts')
      }, 1200)
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to submit spare part listing.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
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
        navigate('/sell/spare-parts')
      }, 1200)
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to save draft.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Save details only and return the slug
  const handleSaveDetails = async () => {
    if (!detailsValid || submitting) return null
    setSubmitting(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      let slugResult = editingSlug
      if (slugResult) {
        await patchListing(slugResult, buildPayload())
      } else {
        const created = await createListing(buildPayload())
        slugResult = created?.slug
        if (slugResult) {
          setEditingSlug(slugResult)
          navigate(`/sell/spare-parts/${slugResult}`, { replace: true })
        }
      }

      setApiSuccessMsg('Spare part details saved successfully!')
      return slugResult
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to save spare part details.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
      return null
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
    navigate('/sell/spare-parts/add-part')
  }

  // Populate form for editing existing spare part
  const handleEditSparePartCard = async (item) => {
    setEditingSlug(item.slug)
    navigate(`/sell/spare-parts/${item.slug}`)
    setActiveTab('details')
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

  const requestAction = (type, slug) => {
    setConfirmModal({ isOpen: true, type, slug, processing: false })
  }

  const executeAction = async () => {
    const { type, slug } = confirmModal
    setConfirmModal(prev => ({ ...prev, processing: true }))
    try {
      if (type === 'delete') {
        await deleteListing(slug)
        setApiSuccessMsg('Spare part listing deleted successfully!')
      } else if (type === 'archive') {
        await archiveListing(slug)
        setApiSuccessMsg('Spare part listing archived!')
      } else if (type === 'submit') {
        await submitListing(slug)
        setApiSuccessMsg('Spare part listing submitted for review!')
      } else if (type === 'available') {
        await makeAvailableListing(slug)
        setApiSuccessMsg('Spare part marked as Available!')
      }
      setConfirmModal({ isOpen: false, type: '', slug: '', processing: false })
      await fetchListings()
    } catch (err) {
      alert(`Failed to perform action: ${err?.response?.data?.message || err?.message}`)
      setConfirmModal(prev => ({ ...prev, processing: false }))
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
      <Breadcrumb items={[{ label: 'Sell', to: '/sell/spare-parts' }, { label: 'Sell Spare Parts' }]} />

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
              onClick={() => {
                navigate(editingSlug ? `/sell/spare-parts/${editingSlug}` : '/sell/spare-parts/add-part')
              }}
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
                navigate('/sell/spare-parts')
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'listings' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Wrench size={14} /> My Spare Parts Listings ({sparePartsListings.length})
            </button>
          </div>


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
        <div className="mx-auto max-w-full">


          <div className="mb-6 flex flex-wrap gap-6 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
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

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-xs text-text-secondary">
                    Save details anytime to unlock the full Photos Manager (upload, reorder, primary cover, replace).
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    icon={ImagePlus}
                    disabled={!detailsValid || submitting}
                    loading={submitting}
                    onClick={async () => {
                      const savedSlug = await handleSaveDetails()
                      if (savedSlug) {
                        setActiveTab('photos')
                      }
                    }}
                  >
                    Save Details &amp; Manage Photos
                  </Button>
                </div>
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
              <div>
                {editingSlug ? (
                  <SparePartsImagesManager slug={editingSlug} isDealer={user?.role === 'DEALER'} />
                ) : (
                  <div className="space-y-6 rounded-2xl border border-dashed border-border bg-surface-alt/50 p-8 text-center sm:p-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ImagePlus size={28} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-text">Save Details to Open Photo Manager</h2>
                      <p className="mx-auto max-w-md text-xs text-text-secondary">
                        Please save the spare part details first to enable the full Spare Part Images Manager with live reordering, cover photo selection, replace photo, and drag-and-drop uploads.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <Button
                        variant="primary"
                        icon={CheckCircle2}
                        disabled={submitting}
                        loading={submitting}
                        onClick={async () => {
                          const savedSlug = await handleSaveDetails()
                          if (savedSlug) {
                            setActiveTab('photos')
                          }
                        }}
                      >
                        {detailsValid ? 'Save Details & Open Photo Manager' : 'Fill Details (Category, Brand, Title, Description) to Continue'}
                      </Button>
                      {!detailsValid && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('details')}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          &larr; Go to Part Details Tab
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 mt-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="group inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-xs active:scale-95"
                              onClick={() => setManagingImagesSlug(item.slug)}
                              title="Manage Photos"
                            >
                              <ImagePlus size={14} className="text-primary" />
                              <span>Photos</span>
                              <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                {imagesCount}
                              </span>
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {item.status === 'DRAFT' && (
                              <button
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
                                onClick={() => requestAction('submit', item.slug)}
                              >
                                <Rocket size={13} />
                                <span>Send for Verification</span>
                              </button>
                            )}

                            <Link
                              to={`/spare-parts/${item.slug || item.id}?from=sell`}
                              state={{ from: '/sell/spare-parts' }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-surface-alt hover:text-primary active:scale-95"
                              title="View Details"
                            >
                              <Eye size={14} />
                              <span>View Details</span>
                            </Link>

                            {item.status !== 'AVAILABLE' && item.status !== 'APPROVED' && (
                              <button
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-xs transition-all hover:bg-emerald-500 hover:text-white active:scale-95"
                                onClick={() => requestAction('available', item.slug)}
                              >
                                <CheckCircle2 size={14} />
                                <span>Make Available</span>
                              </button>
                            )}

                            <button
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95"
                              onClick={() => handleEditSparePartCard(item)}
                              title="Edit Details"
                            >
                              <Pencil size={14} />
                              <span>Edit Details</span>
                            </button>

                            {item.status !== 'ARCHIVED' && (
                              <button
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-600 active:scale-95"
                                onClick={() => requestAction('archive', item.slug)}
                                title="Archive Listing"
                              >
                                <Archive size={14} />
                                <span>Archive</span>
                              </button>
                            )}

                            <button
                              className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs font-semibold text-danger shadow-xs transition-all hover:bg-danger/10 active:scale-95"
                              onClick={() => requestAction('delete', item.slug)}
                              title="Delete Listing"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
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

      {/* Modal image manager */}
      {managingImagesSlug && (
        <SparePartsImagesManager
          slug={managingImagesSlug}
          isDealer={user?.role === 'DEALER'}
          onClose={() => {
            setManagingImagesSlug(null)
            fetchListings()
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        isLoading={confirmModal.processing}
        onClose={() => setConfirmModal({ isOpen: false, type: '', slug: '', processing: false })}
        onConfirm={executeAction}
        title={
          confirmModal.type === 'delete' ? 'Delete Spare Part Listing' :
            confirmModal.type === 'archive' ? 'Archive Spare Part Listing' :
              confirmModal.type === 'submit' ? 'Submit for Review' :
                'Make Spare Part Available'
        }
        message={
          confirmModal.type === 'delete' ? 'Are you sure you want to permanently delete this spare part listing? This action cannot be undone.' :
            confirmModal.type === 'archive' ? 'Are you sure you want to archive this spare part? It will be hidden from public view.' :
              confirmModal.type === 'submit' ? 'Are you sure you want to submit this item for verification? Our team will review the details before making it public.' :
                'Are you sure you want to make this spare part publicly available on the marketplace?'
        }
        confirmText={
          confirmModal.type === 'delete' ? 'Delete' :
            confirmModal.type === 'archive' ? 'Archive' :
              confirmModal.type === 'submit' ? 'Submit' :
                'Make Available'
        }
        variant={confirmModal.type === 'delete' ? 'danger' : confirmModal.type === 'archive' ? 'warning' : 'primary'}
      />
    </div>
  )
}
