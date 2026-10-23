import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle, Archive, Bath, Bed, Building2, Check, CheckCircle2, Clock, Compass, Eye, FileCheck, FileText, ImagePlus,
  Landmark, MapPin, Maximize, Pencil, Phone, Plus, RefreshCw, Rocket, Ruler, ShieldCheck, Sofa, Sparkles, Trash2, Upload, User, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Dropdown from '../components/forms/Dropdown'
import Badge from '../components/common/Badge'
import SellAccessGate from '../components/common/SellAccessGate'
import ConfirmModal from '../components/common/ConfirmModal'
import PropertyImagesManager from '../components/dashboard/PropertyImagesManager'
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
import { PLACEHOLDER_IMAGE } from '../utils/enumFormat'

const BEDROOM_OPTIONS = [
  { value: '0', label: 'N/A (Plot / Land / Commercial)' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5+ BHK' },
]

const LISTING_STATUS_VARIANT = {
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'success',
  AVAILABLE: 'success',
  REJECTED: 'danger',
  ARCHIVED: 'neutral',
  RENTED: 'info',
  SOLD: 'info',
}

const LISTING_STATUS_LABEL = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Under Review',
  APPROVED: 'Live / Approved',
  AVAILABLE: 'Available',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
  RENTED: 'Rented',
  SOLD: 'Sold',
}

const initialForm = () => ({
  title: '',
  description: '',
  propertyType: 'APARTMENT',
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
  const {
    listings: propertyListings,
    loading: listingsLoading,
    fetchListings,
    createListing,
    patchListing,
    deleteListing,
    submitListing,
    makeAvailableListing,
    archiveListing,
  } = usePropertyListings()
  const location = useLocation()
  const navigate = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    fetchListings().catch(() => { })
  }, [fetchListings])

  const viewMode = location.pathname === '/sell/properties' ? 'listings' : 'create'

  // Step tabs inside property creation form
  const [activeTab, setActiveTab] = useState('details')
  const [form, setForm] = useState(initialForm)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editingSlug, setEditingSlug] = useState(slug || null)

  useEffect(() => {
    if (viewMode === 'listings') {
      setEditingSlug(null)
      return
    }

    if (location.pathname === '/sell/properties/add-property') {
      // If we were editing, reset to create
      if (editingSlug !== null) {
        setEditingSlug(null)
        setForm(initialForm())
        setSelectedFiles([])
      }
      return
    }

    if (slug && editingSlug !== slug) {
      setEditingSlug(slug)
      propertyListingService.getBySlug(slug).then((detail) => {
        if (detail) {
          setForm({
            title: detail.title || '',
            description: detail.description || '',
            propertyType: detail.propertyType || 'APARTMENT',
            listingType: detail.listingType || 'FOR_SALE',
            price: detail.price ?? '',
            negotiable: Boolean(detail.negotiable),
            bedrooms: detail.bedrooms ?? 0,
            bathrooms: detail.bathrooms ?? 0,
            balconies: detail.balconies ?? 0,
            builtUpArea: detail.builtUpArea ?? '',
            carpetArea: detail.carpetArea ?? '',
            plotArea: detail.plotArea ?? '',
            areaUnit: detail.areaUnit || 'SQ_FT',
            furnishingStatus: detail.furnishingStatus || 'UNFURNISHED',
            constructionStatus: detail.constructionStatus || 'READY_TO_MOVE',
            facing: detail.facing || '',
            floor: detail.floor ?? '',
            totalFloors: detail.totalFloors ?? '',
            ageOfProperty: detail.ageOfProperty ?? '',
            city: detail.city || detail.location?.city || '',
            locality: detail.locality || detail.location?.locality || (typeof detail.location === 'string' ? detail.location : ''),
            address: detail.address || detail.location?.address || '',
            pincode: detail.pincode || detail.location?.pincode || '',
          })
        }
      }).catch((err) => console.warn('Error loading property by slug from URL:', err))
    }
  }, [location.pathname, slug, viewMode, editingSlug])

  // API status messages
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', slug: '', processing: false })

  // Modal image manager slug
  const [managingImagesSlug, setManagingImagesSlug] = useState(null)
  const [deletingSlug, setDeletingSlug] = useState(null)

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

  // Form Validation
  const detailsValid = !!form.propertyType && form.title.trim().length > 2 && form.description.trim().length > 5
  const areaValid = Number(form.builtUpArea) > 0 || Number(form.carpetArea) > 0 || Number(form.plotArea) > 0
  const pricingValid = Number(form.price) > 0
  const locationValid = form.city.trim().length > 1 && form.locality.trim().length > 1
  const imagesValid = selectedFiles.length > 0 || Boolean(editingSlug)
  const canSubmit = detailsValid && areaValid && pricingValid && locationValid

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
          await propertyListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      if (slug) {
        await submitListing(slug)
      }

      setApiSuccessMsg('Property listing submitted for review! Our team will review it shortly.')
      await fetchListings()
      setTimeout(() => {
        navigate('/sell/properties')
      }, 1200)
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to submit property listing.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Save or Create Property Details (stores draft and sets editingSlug)
  const handleSaveDetails = async () => {
    if (!detailsValid) {
      setActiveTab('details')
      setApiErrorMsg('Please fill in the required property details (Title, Type, and Description) first.')
      return null
    }
    setSubmitting(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      let currentSlug = editingSlug
      if (currentSlug) {
        await patchListing(currentSlug, buildPayload())
      } else {
        const created = await createListing(buildPayload())
        currentSlug = created?.slug
        if (currentSlug) {
          setEditingSlug(currentSlug)
          navigate(`/sell/properties/${currentSlug}`, { replace: true })
        }
      }
      setApiSuccessMsg('Property details saved! You can now manage photos.')
      await fetchListings()
      return currentSlug
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to save property details.'
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
          await propertyListingService.uploadImages(slug, selectedFiles)
        } catch (imgErr) {
          console.warn('Image upload warning:', imgErr)
        }
      }

      setApiSuccessMsg('Draft saved successfully! You can view and manage it from your Property Listings.')
      await fetchListings()
      setTimeout(() => {
        navigate('/sell/properties')
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

  // Start new property creation
  const handleStartNewProperty = () => {
    setEditingSlug(null)
    setForm(initialForm())
    setSelectedFiles([])
    setActiveTab('details')
    setApiErrorMsg(null)
    setApiSuccessMsg(null)
    navigate('/sell/properties/add-property')
  }

  // Populate form for editing existing property
  const handleEditPropertyCard = async (p) => {
    setEditingSlug(p.slug)
    navigate(`/sell/properties/${p.slug}`)
    setActiveTab('details')
    setForm({
      title: p.title || '',
      description: p.description || '',
      propertyType: p.propertyType || 'APARTMENT',
      listingType: p.listingType || 'FOR_SALE',
      price: p.price || '',
      negotiable: p.negotiable || false,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      balconies: p.balconies || 0,
      builtUpArea: p.builtUpArea || '',
      carpetArea: p.carpetArea || '',
      plotArea: p.plotArea || '',
      areaUnit: p.areaUnit || 'SQ_FT',
      furnishingStatus: p.furnishingStatus || 'UNFURNISHED',
      constructionStatus: p.constructionStatus || 'READY_TO_MOVE',
      facing: p.facing || '',
      floor: p.floor ?? '',
      totalFloors: p.totalFloors ?? '',
      ageOfProperty: p.ageOfProperty ?? '',
      city: p.city || p.location?.city || '',
      locality: p.locality || p.location?.locality || (typeof p.location === 'string' ? p.location : ''),
      address: p.address || p.location?.address || '',
      pincode: p.pincode || p.location?.pincode || '',
    })
    setSelectedFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const detail = await propertyListingService.getBySlug(p.slug)
      if (detail) {
        setForm((prev) => ({
          ...prev,
          title: detail.title || prev.title,
          description: detail.description || prev.description,
          propertyType: detail.propertyType || prev.propertyType,
          listingType: detail.listingType || prev.listingType,
          price: detail.price ?? prev.price,
          negotiable: detail.negotiable ?? prev.negotiable,
          bedrooms: detail.bedrooms ?? prev.bedrooms,
          bathrooms: detail.bathrooms ?? prev.bathrooms,
          balconies: detail.balconies ?? prev.balconies,
          builtUpArea: detail.builtUpArea ?? prev.builtUpArea,
          carpetArea: detail.carpetArea ?? prev.carpetArea,
          plotArea: detail.plotArea ?? prev.plotArea,
          areaUnit: detail.areaUnit || prev.areaUnit,
          furnishingStatus: detail.furnishingStatus || prev.furnishingStatus,
          constructionStatus: detail.constructionStatus || prev.constructionStatus,
          facing: detail.facing || prev.facing,
          floor: detail.floor ?? prev.floor,
          totalFloors: detail.totalFloors ?? prev.totalFloors,
          ageOfProperty: detail.ageOfProperty ?? prev.ageOfProperty,
          city: detail.city || detail.location?.city || prev.city,
          locality: detail.locality || detail.location?.locality || (typeof detail.location === 'string' ? detail.location : prev.locality),
          address: detail.address || detail.location?.address || prev.address,
          pincode: detail.pincode || detail.location?.pincode || prev.pincode,
        }))
      }
    } catch (err) {
      console.warn('Failed to load full property detail:', err)
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
        setApiSuccessMsg('Property listing deleted successfully!')
      } else if (type === 'archive') {
        await archiveListing(slug)
        setApiSuccessMsg('Property listing archived!')
      } else if (type === 'submit') {
        await submitListing(slug)
        setApiSuccessMsg('Property listing submitted for review! Our team will review it shortly.')
      } else if (type === 'available') {
        await makeAvailableListing(slug)
        setApiSuccessMsg('Property marked as Available!')
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
        <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Property' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname} />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell/properties' }, { label: 'Sell Property' }]} />

      {/* Top Header Mode Toggle & Actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Property Management &amp; Selling</h1>
          <p className="mt-1 text-sm text-text-secondary">
            List an apartment, villa, plot or commercial space with zero brokerage &mdash; manage photos, status &amp; approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => {
                navigate('/sell/properties/add-property')
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'create' && !editingSlug ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Plus size={14} /> Create Property
            </button>
            <button
              type="button"
              onClick={() => {
                fetchListings()
                navigate('/sell/properties')
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'listings' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Building2 size={14} /> My Property Listings ({propertyListings.length})
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

      {/* MODE 1: CREATE PROPERTY FORM */}
      {viewMode === 'create' && (
        <div>
          <div className="mb-6 flex flex-wrap gap-4 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
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
                  <h2 className="text-lg font-bold text-text">Property details</h2>
                </div>
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

                {/* Save Details Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 mt-6">
                  <p className="text-xs text-text-secondary">
                    Click <strong>Save Details</strong> to store your property and unlock photo management (uploads, cover photo, reorder).
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={submitting}
                    loading={submitting}
                    icon={FileCheck}
                    onClick={async () => {
                      const savedSlug = await handleSaveDetails()
                      if (savedSlug) {
                        setActiveTab('images')
                      }
                    }}
                  >
                    {editingSlug ? 'Save Changes & Go to Photos' : 'Save Details & Open Photo Manager'}
                  </Button>
                </div>
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
              <div>
                {editingSlug ? (
                  <PropertyImagesManager slug={editingSlug} isDealer={user?.role === 'DEALER'} />
                ) : (
                  <div className="space-y-6 rounded-2xl border border-dashed border-border bg-surface-alt/50 p-8 text-center sm:p-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ImagePlus size={28} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-text">Save Details to Open Photo Manager</h2>
                      <p className="mx-auto max-w-md text-xs text-text-secondary">
                        Please save the property details first to enable the full Property Images Manager with live reordering, cover photo selection, replace photo, and drag-and-drop uploads.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <Button
                        variant="primary"
                        icon={FileCheck}
                        disabled={submitting}
                        loading={submitting}
                        onClick={async () => {
                          const savedSlug = await handleSaveDetails()
                          if (savedSlug) {
                            setActiveTab('images')
                          }
                        }}
                      >
                        {detailsValid ? 'Save Details & Open Photo Manager' : 'Fill Details (Title & Description) to Continue'}
                      </Button>
                      {!detailsValid && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('details')}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          &larr; Go to Details Tab
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

      {/* MODE 2: MY PROPERTY LISTINGS VIEW */}
      {viewMode === 'listings' && (
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                {propertyListings.length}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">Your Property Listings</h2>
                <p className="text-xs text-text-secondary">All properties created and submitted for review</p>
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

              <Button variant="primary" icon={Plus} onClick={handleStartNewProperty}>
                List Property
              </Button>
            </div>
          </div>

          {propertyListings.length === 0 && !listingsLoading ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center shadow-soft">
              <Building2 size={48} className="mx-auto mb-3 text-text-light/50" />
              <h3 className="text-base font-bold text-text">No property listings found</h3>
              <p className="mt-1 text-xs text-text-secondary">List your apartments, villas, plots or commercial properties with zero brokerage.</p>
              <Button variant="primary" className="mt-6" icon={Plus} onClick={handleStartNewProperty}>
                List Property
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {propertyListings.map((p) => {
                const imagesList = Array.isArray(p.images) ? p.images : []
                const primaryImgObj = imagesList.find((img) => img.isPrimary) || imagesList[0]
                const primaryImage = primaryImgObj?.imageUrl || primaryImgObj?.url || (typeof primaryImgObj === 'string' ? primaryImgObj : PLACEHOLDER_IMAGE)
                const imagesCount = imagesList.length
                const typeLabel = PROPERTY_TYPES.find((t) => t.value === p.propertyType)?.label || p.propertyType || 'Property'
                const listingTypeLabel = LISTING_TYPES.find((t) => t.value === p.listingType)?.label || p.listingType

                return (
                  <div key={p.slug || p.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:border-primary/40">
                    <div className="flex flex-col gap-6 p-6 lg:flex-row">
                      {/* Image Preview & Badges */}
                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-surface-alt lg:w-64">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                          {imagesCount} {imagesCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <div className="absolute right-2 top-2">
                          <Badge variant={LISTING_STATUS_VARIANT[p.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[p.status] || p.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Details & Specs */}
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {typeLabel} · {listingTypeLabel}
                            </span>
                            <h3 className="text-xl font-extrabold text-text">{p.title}</h3>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                              <MapPin size={13} /> {p.locality}{p.locality && p.city ? ', ' : ''}{p.city}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-2xl font-extrabold text-text">
                              {formatCurrencyFull(p.price)}
                              {p.listingType === 'FOR_RENT' && <span className="text-xs font-normal text-text-secondary">/mo</span>}
                            </p>
                            {p.negotiable && <span className="text-[11px] font-semibold text-warning">Negotiable</span>}
                          </div>
                        </div>

                        {/* Rejection Notice */}
                        {(p.status === 'REJECTED' || p.rejectionReason) && (
                          <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                            <strong>Rejection Reason:</strong> {p.rejectionReason || 'Property details require verification.'}
                          </div>
                        )}

                        {/* Key Attributes Bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                          {p.bedrooms > 0 && <span>BHK: <strong>{p.bedrooms}</strong></span>}
                          {p.bathrooms > 0 && <span>Bath: <strong>{p.bathrooms}</strong></span>}
                          {p.builtUpArea > 0 && <span>Built-up: <strong>{p.builtUpArea} {p.areaUnit}</strong></span>}
                          {p.carpetArea > 0 && <span>Carpet: <strong>{p.carpetArea} {p.areaUnit}</strong></span>}
                          {p.plotArea > 0 && <span>Plot: <strong>{p.plotArea} {p.areaUnit}</strong></span>}
                          <span>Furnishing: <strong>{p.furnishingStatus}</strong></span>
                        </div>

                        {p.description && (
                          <p className="line-clamp-2 text-xs text-text-secondary">{p.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-surface-alt/40 px-6 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-xs active:scale-95"
                          onClick={() => setManagingImagesSlug(p.slug)}
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
                        {p.status === 'DRAFT' && (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
                            onClick={() => requestAction('submit', p.slug)}
                          >
                            <Rocket size={13} />
                            <span>Send for Verification</span>
                          </button>
                        )}

                        <Link
                          to={`/properties/${p.slug || p.id}?from=sell`}
                          state={{ from: '/sell/properties' }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-surface-alt hover:text-primary active:scale-95"
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </Link>

                        {p.status !== 'AVAILABLE' && p.status !== 'DRAFT' && (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-xs transition-all hover:bg-emerald-500 hover:text-white active:scale-95"
                            onClick={() => requestAction('available', p.slug)}
                          >
                            <CheckCircle2 size={14} />
                            <span>Make Available</span>
                          </button>
                        )}

                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95"
                          onClick={() => handleEditPropertyCard(p)}
                          title="Edit Details"
                        >
                          <Pencil size={14} />
                          <span>Edit Details</span>
                        </button>

                        {p.status !== 'ARCHIVED' && (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-600 active:scale-95"
                            onClick={() => requestAction('archive', p.slug)}
                            title="Archive Listing"
                          >
                            <Archive size={14} />
                            <span>Archive</span>
                          </button>
                        )}

                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs font-semibold text-danger shadow-xs transition-all hover:bg-danger/10 active:scale-95"
                          onClick={() => requestAction('delete', p.slug)}
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
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
        <PropertyImagesManager
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
          confirmModal.type === 'delete' ? 'Delete Property Listing' :
            confirmModal.type === 'archive' ? 'Archive Property Listing' :
              confirmModal.type === 'submit' ? 'Submit for Review' :
                'Make Property Available'
        }
        message={
          confirmModal.type === 'delete' ? 'Are you sure you want to permanently delete this property listing? This action cannot be undone.' :
            confirmModal.type === 'archive' ? 'Are you sure you want to archive this property? It will be hidden from public view.' :
              confirmModal.type === 'submit' ? 'Are you sure you want to submit this property for verification? Our team will review the details before making it public.' :
                'Are you sure you want to make this property publicly available on the marketplace?'
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
