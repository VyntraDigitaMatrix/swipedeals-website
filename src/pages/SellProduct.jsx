import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom'
import {
  AlertCircle, Archive, ArrowRight, CarFront, Check, Clock, Eye, FileCheck, FileText, Home as HomeIcon,
  ImagePlus, Laptop, MapPin, Pencil, Phone, Plus, RefreshCw, Rocket, Settings, ShieldCheck,
  Sliders, Sparkles, Trash2, Truck, Upload, User, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Dropdown from '../components/forms/Dropdown'
import Badge from '../components/common/Badge'
import SellAccessGate from '../components/common/SellAccessGate'
import ConfirmModal from '../components/common/ConfirmModal'
import VehicleImagesManager from '../components/dashboard/VehicleImagesManager'
import VehicleSpecsManager from '../components/dashboard/VehicleSpecsManager'
import VehicleFeaturesManager from '../components/dashboard/VehicleFeaturesManager'
import VehicleDocumentsManager from '../components/dashboard/VehicleDocumentsManager'

import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'
import { useVehicleListings } from '../hooks/useVehicleListings'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'
import { titleCaseEnum, PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import {
  vehicleListingService,
  prepareVehiclePayload,
  VEHICLE_BRANDS,
  VEHICLE_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_TYPES,
} from '../services/vehicleListingService'

const DEDICATED_ROUTES = {
  cars: '/sell/cars',
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

const LISTING_STATUS_VARIANT = {
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  PUBLISHED: 'success',
  REJECTED: 'danger',
  SOLD: 'info',
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  ARCHIVED: 'neutral',
}

const LISTING_STATUS_LABEL = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Under Verification',
  PUBLISHED: 'Live / Approved',
  REJECTED: 'Rejected',
  SOLD: 'Sold',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
}

const initialForm = (category, user) => ({
  brand: 'MARUTI_SUZUKI',
  model: '',
  variant: '',
  year: new Date().getFullYear(),
  price: '',
  mileage: '',
  condition: 'USED',
  fuelType: 'PETROL',
  transmissionType: 'MANUAL',
  color: '',
  registrationNumber: '',
  chassisNumber: '',
  vin: '',
  vehicleType: category === 'commercial' ? 'COMMERCIAL_VEHICLES' : 'CARS',
  ownersCount: '1',
  description: '',
  sellerName: user?.name || '',
  sellerPhone: user?.phone || '',
  location: '',
  city: '',
})

export default function SellProduct() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedCategory = CATEGORIES.some((c) => c.id === searchParams.get('category')) ? searchParams.get('category') : 'cars'
  const { user, isAuthenticated } = useAuth()
  const { isKycVerified } = useKyc()

  const {
    listings: userVehicleListings,
    loading: listingsLoading,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    submitListing,
    archiveListing,
    restoreListing,
  } = useVehicleListings()

  useEffect(() => {
    if (DEDICATED_ROUTES[searchParams.get('category')]) {
      navigate(DEDICATED_ROUTES[searchParams.get('category')], { replace: true })
    }
  }, [searchParams, navigate])

  useEffect(() => {
    fetchListings().catch(() => { })
  }, [fetchListings])

  const { slug } = useParams()

  // View state: 'create' or 'listings'
  const initialMode = (location.pathname.endsWith('add-vehicle') || slug) ? 'create' : (searchParams.get('mode') || 'listings')
  const [viewMode, setViewModeState] = useState(initialMode)

  const setViewMode = (mode) => {
    setViewModeState(mode)
    if (mode === 'listings') {
      navigate('/sell/cars')
    }
  }

  // Step tabs inside creation flow: 'details', 'images', 'specifications', 'features', 'documents'
  const [activeStep, setActiveStep] = useState('details')
  const [form, setForm] = useState(() => initialForm(preselectedCategory, user))

  // Once details are saved via "Save Changes", createdSlug is set
  const [createdSlug, setCreatedSlug] = useState(null)
  const [createdVehicle, setCreatedVehicle] = useState(null)

  useEffect(() => {
    if (slug && createdSlug !== slug) {
      const loadVehicle = async () => {
        try {
          const res = await vehicleListingService.getMyListing(slug)
          const v = res?.data || res
          if (v) {
            setCreatedSlug(v.slug || v.id)
            setCreatedVehicle(v)
            setForm({
              brand: v.brand || 'MARUTI_SUZUKI',
              model: v.model || '',
              variant: v.variant || '',
              year: v.year || new Date().getFullYear(),
              price: v.price || '',
              mileage: v.mileage || '',
              condition: v.condition || 'USED',
              fuelType: v.fuelType || 'PETROL',
              transmissionType: v.transmissionType || 'MANUAL',
              color: v.color || '',
              registrationNumber: v.registrationNumber || '',
              chassisNumber: v.chassisNumber || '',
              vin: v.vin || '',
              vehicleType: v.vehicleType || 'CARS',
              ownersCount: v.ownersCount || '1',
              description: v.description || '',
              sellerName: v.seller?.sellerName || user?.name || '',
              sellerPhone: v.seller?.mobileNumber || user?.phone || '',
              location: '',
              city: '',
            })
            setViewModeState('create')
          }
        } catch (err) {
          console.error('Failed to load vehicle details by slug:', err)
        }
      }
      loadVehicle()
    }
  }, [slug, createdSlug, user])

  const [savingDetails, setSavingDetails] = useState(false)
  const [savingAction, setSavingAction] = useState(false)
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)

  // Modals for manage actions from listings table
  const [modalSlug, setModalSlug] = useState(null)
  const [modalType, setModalType] = useState(null) // 'images' | 'specs' | 'features' | 'docs'
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', slug: '', processing: false })

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  // Save changes handler for vehicle details (Step 1)
  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault()
    setSavingDetails(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    if (!form.model.trim()) {
      setApiErrorMsg('Please enter vehicle Model.')
      setSavingDetails(false)
      return
    }

    const payload = prepareVehiclePayload(form)

    try {
      let resData = null
      if (createdSlug) {
        // Update existing vehicle listing
        const res = await vehicleListingService.updateMyListing(createdSlug, payload)
        resData = res?.data || res
        setApiSuccessMsg('Vehicle details updated successfully!')
      } else {
        // Create new vehicle listing
        const res = await vehicleListingService.createListing(payload)
        resData = res?.data || res
        const newSlug = resData?.slug || resData?.id
        setCreatedSlug(newSlug)
        setApiSuccessMsg('Vehicle details saved successfully! You can now upload images, specifications, features, and documents.')
      }

      if (resData) setCreatedVehicle(resData)
      await fetchListings()
    } catch (err) {
      console.error('Failed to save vehicle details:', err)
      let msg = err?.response?.data?.message || err?.message || 'Failed to save vehicle details.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
    } finally {
      setSavingDetails(false)
    }
  }

  // Handle Save as Draft
  const handleSaveAsDraft = async () => {
    setSavingAction(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      if (!createdSlug) {
        // First save details as draft
        const payload = prepareVehiclePayload(form)
        const res = await vehicleListingService.createListing(payload)
        const resData = res?.data || res
        setCreatedSlug(resData?.slug)
      }
      setApiSuccessMsg('Listing saved as Draft! You can view and manage it from your Vehicle Listings.')
      await fetchListings()
      setTimeout(() => {
        setViewMode('listings')
      }, 1200)
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to save draft.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
    } finally {
      setSavingAction(false)
    }
  }

  // Handle Send for Verification
  const handleSendForVerification = async () => {
    setSavingAction(true)
    setApiErrorMsg(null)
    setApiSuccessMsg(null)

    try {
      let slugToSubmit = createdSlug
      if (!slugToSubmit) {
        // Save details first to get slug
        const payload = prepareVehiclePayload(form)
        const res = await vehicleListingService.createListing(payload)
        const resData = res?.data || res
        slugToSubmit = resData?.slug
        setCreatedSlug(slugToSubmit)
      }

      if (!slugToSubmit) {
        throw new Error('Unable to obtain vehicle slug for verification.')
      }

      await submitListing(slugToSubmit)
      setApiSuccessMsg('Listing successfully submitted for verification! Our team will review it shortly.')
      await fetchListings()
      setTimeout(() => {
        setViewMode('listings')
      }, 1500)
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to submit vehicle for verification.'
      if (err?.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(', ')
        if (fieldErrors) msg += ` - ${fieldErrors}`
      }
      setApiErrorMsg(msg)
      if (msg.toLowerCase().includes('image') || msg.toLowerCase().includes('photo')) {
        setActiveStep('images')
      }
    } finally {
      setSavingAction(false)
    }
  }

  // Edit existing listing from the listings table
  const handleEditVehicleCard = (v) => {
    setCreatedSlug(v.slug)
    setCreatedVehicle(v)
    setForm({
      brand: v.brand || 'MARUTI_SUZUKI',
      model: v.model || '',
      variant: v.variant || '',
      year: v.year || new Date().getFullYear(),
      price: v.price || '',
      mileage: v.mileage || '',
      condition: v.condition || 'USED',
      fuelType: v.fuelType || 'PETROL',
      transmissionType: v.transmissionType || 'MANUAL',
      color: v.color || '',
      registrationNumber: v.registrationNumber || '',
      chassisNumber: v.chassisNumber || '',
      vin: v.vin || '',
      vehicleType: v.vehicleType || 'CARS',
      ownersCount: v.ownersCount || '1',
      description: v.description || '',
      sellerName: user?.name || '',
      sellerPhone: user?.phone || '',
      location: '',
      city: '',
    })
    setActiveStep('details')
    setViewModeState('create')
    navigate(`/sell/cars/${v.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset form to sell another vehicle
  const handleStartNewVehicle = () => {
    setCreatedSlug(null)
    setCreatedVehicle(null)
    setForm(initialForm(preselectedCategory, user))
    setActiveStep('details')
    setApiErrorMsg(null)
    setApiSuccessMsg(null)
    setViewModeState('create')
    navigate('/sell/cars/add-vehicle')
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
        setApiSuccessMsg('Vehicle listing deleted successfully!')
      } else if (type === 'archive') {
        await archiveListing(slug)
        setApiSuccessMsg('Vehicle listing archived!')
      } else if (type === 'restore') {
        await restoreListing(slug)
        setApiSuccessMsg('Vehicle listing restored successfully!')
      } else if (type === 'submit') {
        await submitListing(slug)
        setApiSuccessMsg('Vehicle listing submitted for verification!')
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
        <Breadcrumb items={[{ label: 'Sell / Become a Dealer' }]} />
        <SellAccessGate isAuthenticated={isAuthenticated} redirect={location.pathname + location.search} />
      </div>
    )
  }

  const CREATION_STEPS = [
    { id: 'details', label: '1. Details', disabled: false },
    { id: 'images', label: '2. Images', disabled: !createdSlug },
    { id: 'specifications', label: '3. Specifications', disabled: !createdSlug },
    { id: 'features', label: '4. Features', disabled: !createdSlug },
    { id: 'documents', label: '5. Documents', disabled: !createdSlug },
  ]

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell' }, { label: 'Vehicle Listings' }]} />

      {/* Top Header Mode Toggle & Actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Vehicle Listings</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your vehicle inventory, pricing, specifications, archive/restore status, and verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === 'create' || viewMode === 'edit' || viewMode === 'new' ? (
            <Button variant="outline" icon={CarFront} onClick={() => {
              fetchListings()
              setViewMode('listings')
            }}>
              View Listings
            </Button>
          ) : null}
          <Button variant="primary" icon={Plus} onClick={handleStartNewVehicle}>
            Add Vehicle
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

      {/* MODE 1: CREATE VEHICLE FLOW */}
      {viewMode === 'create' && (
        <div className="mx-auto max-w-full">
          {/* Step Navigation Tabs */}
          <div className="mb-6 flex flex-wrap gap-6 border-b border-border pb-3">
            {CREATION_STEPS.map((step) => {
              const active = activeStep === step.id
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={step.disabled}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all',
                    active
                      ? 'bg-primary text-white shadow-soft'
                      : step.disabled
                        ? 'cursor-not-allowed text-text-light/50 bg-surface-alt/40'
                        : 'bg-surface text-text-secondary hover:bg-surface-alt hover:text-text'
                  )}
                >
                  {step.label}
                  {createdSlug && step.id !== 'details' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  )}
                </button>
              )
            })}
          </div>

          {!createdSlug && activeStep !== 'details' && (
            <div className="mb-6 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-xs text-warning">
              Please enter the vehicle details in Step 1 and click <strong>"Save Changes"</strong> to unlock Images, Specifications, Features, and Documents!
            </div>
          )}

          {/* TAB 1: DETAILS */}
          {activeStep === 'details' && (
            <form onSubmit={handleSaveChanges} className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-text">Enter Vehicle Details</h2>
                  <p className="mt-1 text-xs text-text-secondary">Provide accurate vehicle details according to official registration records.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Dropdown
                  label="Brand / Make"
                  value={form.brand}
                  onChange={(v) => updateField('brand', v)}
                  options={VEHICLE_BRANDS}
                />
                <Input
                  label="Model *"
                  placeholder="e.g. Swift / Creta / Nexon"
                  value={form.model}
                  onChange={(e) => updateField('model', e.target.value)}
                  maxLength={100}
                  required
                />
                <Input
                  label="Variant"
                  placeholder="e.g. VXI / SX(O) / Fearless"
                  value={form.variant}
                  onChange={(e) => updateField('variant', e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  label="Manufacturing Year *"
                  type="number"
                  min="1950"
                  max="2100"
                  placeholder="2023"
                  value={form.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  required
                />
                <Input
                  label="Expected Price (₹) *"
                  type="number"
                  min="1"
                  placeholder="e.g. 650000"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  required
                />
                <Input
                  label="KM Driven (Odometer)"
                  type="number"
                  min="0"
                  placeholder="15000"
                  value={form.mileage}
                  onChange={(e) => updateField('mileage', e.target.value)}
                />
                <Input
                  label="Number of Owners"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1"
                  value={form.ownersCount}
                  onChange={(e) => updateField('ownersCount', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
                <Dropdown
                  label="Vehicle Type"
                  value={form.vehicleType}
                  onChange={(v) => updateField('vehicleType', v)}
                  options={VEHICLE_TYPES}
                />
                <Dropdown
                  label="Fuel Type"
                  value={form.fuelType}
                  onChange={(v) => updateField('fuelType', v)}
                  options={FUEL_TYPES}
                />
                <Dropdown
                  label="Transmission Type"
                  value={form.transmissionType}
                  onChange={(v) => updateField('transmissionType', v)}
                  options={TRANSMISSION_TYPES}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Dropdown
                  label="Condition"
                  value={form.condition}
                  onChange={(v) => updateField('condition', v)}
                  options={VEHICLE_CONDITIONS}
                />
                <Input
                  label="Colour"
                  placeholder="e.g. Pearl Arctic White"
                  value={form.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  maxLength={50}
                />
                <Input
                  label="Registration Number"
                  placeholder="e.g. MH01AB1234 (min 5 chars)"
                  value={form.registrationNumber}
                  onChange={(e) => updateField('registrationNumber', e.target.value)}
                  maxLength={20}
                />
                <Input
                  label="Chassis Number"
                  placeholder="Chassis No. (min 10 chars)"
                  value={form.chassisNumber}
                  onChange={(e) => updateField('chassisNumber', e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="grid grid-cols-1 gap-5">
                <Input
                  label="VIN (Vehicle Identification Number)"
                  placeholder="VIN Number"
                  value={form.vin}
                  onChange={(e) => updateField('vin', e.target.value)}
                  maxLength={100}
                />
              </div>

              <TextArea
                label="Description"
                placeholder="Describe your vehicle condition, service history, key highlights, and reason for selling..."
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                maxLength={3000}
              />

              {/* Save Changes Button on Details Tab */}
              <div className="flex items-center justify-between border-t border-border pt-6">
                <p className="text-xs text-text-secondary">
                  Click <strong>Save Changes</strong> to store vehicle details and enable images, specifications, features, and documents.
                </p>
                <Button type="submit" variant="primary" disabled={savingDetails} icon={FileCheck}>
                  {savingDetails ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: IMAGES */}
          {activeStep === 'images' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              {createdSlug ? (
                <VehicleImagesManager slug={createdSlug} />
              ) : (
                <div className="py-12 text-center text-xs text-text-secondary">
                  Please click <strong>Save Changes</strong> on Step 1 (Details) first to create the vehicle.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeStep === 'specifications' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              {createdSlug ? (
                <VehicleSpecsManager slug={createdSlug} />
              ) : (
                <div className="py-12 text-center text-xs text-text-secondary">
                  Please click <strong>Save Changes</strong> on Step 1 (Details) first to create the vehicle.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FEATURES */}
          {activeStep === 'features' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              {createdSlug ? (
                <VehicleFeaturesManager slug={createdSlug} vehicleType={form.vehicleType} />
              ) : (
                <div className="py-12 text-center text-xs text-text-secondary">
                  Please click <strong>Save Changes</strong> on Step 1 (Details) first to create the vehicle.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeStep === 'documents' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              {createdSlug ? (
                <VehicleDocumentsManager slug={createdSlug} />
              ) : (
                <div className="py-12 text-center text-xs text-text-secondary">
                  Please click <strong>Save Changes</strong> on Step 1 (Details) first to create the vehicle.
                </div>
              )}
            </div>
          )}

          {/* Final Action Footer: Save as Draft & Send for Verification */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface-alt/70 p-6 sm:flex-row">
            <div>
              <h3 className="text-sm font-bold text-text">Final Listing Actions</h3>
              <p className="mt-0.5 text-xs text-text-secondary">
                You can save this listing as a draft to edit later, or send it directly for verification.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                icon={FileText}
                disabled={savingAction}
                onClick={handleSaveAsDraft}
              >
                {savingAction ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                variant="primary"
                icon={Rocket}
                disabled={savingAction}
                onClick={handleSendForVerification}
              >
                {savingAction ? 'Submitting...' : 'Send for Verification'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: GET ALL LISTINGS VIEW */}
      {viewMode === 'listings' && (
        <div>
          {/* We removed the redundant inner header because it is now shown at the top of the page */}

          {userVehicleListings.length === 0 && !listingsLoading ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center shadow-soft">
              <CarFront size={48} className="mx-auto mb-3 text-text-light/50" />
              <h3 className="text-base font-bold text-text">No vehicle listings found</h3>
              <p className="mt-1 text-xs text-text-secondary">Start listing your cars or commercial vehicles to reach buyers across SwipeDeals.</p>
              <Button variant="primary" className="mt-6" icon={Plus} onClick={handleStartNewVehicle}>
                Add Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userVehicleListings.map((v) => {
                const imagesList = Array.isArray(v.images) ? v.images : []
                const primaryImgObj = imagesList.find((img) => img.isPrimary) || imagesList[0]
                const primaryImage = primaryImgObj?.imageUrl || primaryImgObj?.url || (typeof primaryImgObj === 'string' ? primaryImgObj : PLACEHOLDER_IMAGE)
                const imagesCount = imagesList.length
                const docsCount = Array.isArray(v.documents) ? v.documents.length : 0
                const specsCount = Array.isArray(v.specifications) ? v.specifications.length : 0

                const featuresCount = Array.isArray(v.features)
                  ? v.features.reduce((acc, item) => {
                    if (Array.isArray(item.features)) {
                      return acc + item.features.filter((f) => f.available !== false).length
                    }
                    if (item?.available === false) {
                      return acc
                    }
                    return acc + 1
                  }, 0)
                  : 0

                return (
                  <div key={v.slug || v.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:border-primary/40">
                    <div className="flex flex-col gap-6 p-6 lg:flex-row">
                      {/* Image Preview & Badges */}
                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-surface-alt lg:w-64">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                          {imagesCount} {imagesCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <div className="absolute right-2 top-2">
                          <Badge variant={LISTING_STATUS_VARIANT[v.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[v.status] || v.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Main Details & Schema Fields */}
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {titleCaseEnum(v.brand)} · {v.vehicleType || 'CARS'}
                            </span>
                            <h3 className="text-xl font-extrabold text-text">
                              {titleCaseEnum(v.brand)} {v.model} {v.variant} ({v.year})
                            </h3>
                          </div>
                          <p className="font-mono text-2xl font-extrabold text-text">{formatCurrencyFull(v.price)}</p>
                        </div>

                        {/* Rejection Reason Notice Box */}
                        {(v.status === 'REJECTED' || v.rejectionReason) && (
                          <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                            <strong>Rejection Reason:</strong> {v.rejectionReason || 'Your listing does not meet safety or documentation standards.'}
                          </div>
                        )}

                        {/* Key Attributes Bar */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                          <span>KM: <strong>{v.mileage ? `${v.mileage} km` : 'N/A'}</strong></span>
                          <span>·</span>
                          <span>Fuel: <strong>{titleCaseEnum(v.fuelType)}</strong></span>
                          <span>·</span>
                          <span>Transmission: <strong>{titleCaseEnum(v.transmissionType)}</strong></span>
                          <span>·</span>
                          <span>Condition: <strong>{v.condition}</strong></span>
                          <span>·</span>
                          <span>Colour: <strong>{v.color || 'N/A'}</strong></span>
                          <span>·</span>
                          <span>Owners: <strong>{v.ownersCount}</strong></span>
                        </div>

                        {/* Full Schema Technical Identifiers */}
                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-alt/70 p-3 font-mono text-xs text-text-secondary sm:grid-cols-4">
                          <div><span className="text-text-light">Reg No:</span> <strong className="text-text">{v.registrationNumber || 'N/A'}</strong></div>
                          <div><span className="text-text-light">Chassis No:</span> <strong className="text-text">{v.chassisNumber || 'N/A'}</strong></div>
                          <div><span className="text-text-light">VIN:</span> <strong className="text-text">{v.vin || 'N/A'}</strong></div>
                          <div><span className="text-text-light">Seller Type:</span> <strong className="text-text">{v.sellerType || 'INDIVIDUAL'}</strong></div>
                        </div>

                        {v.description && (
                          <p className="line-clamp-2 text-xs text-text-secondary">{v.description}</p>
                        )}

                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-surface-alt/40 px-5 py-3.5">
                      {/* Left group: management tabs */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-xs active:scale-95"
                          onClick={() => { setModalSlug(v.slug); setModalType('images') }}
                          title="Manage Photos"
                        >
                          <ImagePlus size={14} className="text-primary" />
                          <span>Photos</span>
                          <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            {imagesCount}
                          </span>
                        </button>

                        <button
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-info/20 bg-info/5 px-3 py-1.5 text-xs font-semibold text-info transition-all hover:bg-info/10 hover:shadow-xs active:scale-95"
                          onClick={() => { setModalSlug(v.slug); setModalType('specs') }}
                          title="Manage Specs"
                        >
                          <Sliders size={14} className="text-info" />
                          <span>Specs</span>
                          <span className="rounded-md bg-info/20 px-1.5 py-0.5 text-[10px] font-bold text-info">
                            {specsCount}
                          </span>
                        </button>

                        <button
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-warning/20 bg-warning/5 px-3 py-1.5 text-xs font-semibold text-warning transition-all hover:bg-warning/10 hover:shadow-xs active:scale-95"
                          onClick={() => { setModalSlug(v.slug); setModalType('features') }}
                          title="Manage Features"
                        >
                          <Sparkles size={14} className="text-warning" />
                          <span>Features</span>
                          <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                            {featuresCount}
                          </span>
                        </button>

                        <button
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/5 px-3 py-1.5 text-xs font-semibold text-success transition-all hover:bg-success/10 hover:shadow-xs active:scale-95"
                          onClick={() => { setModalSlug(v.slug); setModalType('docs') }}
                          title="Manage Documents"
                        >
                          <FileCheck size={14} className="text-success" />
                          <span>Docs</span>
                          <span className="rounded-md bg-success/20 px-1.5 py-0.5 text-[10px] font-bold text-success">
                            {docsCount}
                          </span>
                        </button>
                      </div>

                      {/* Right group: primary item actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {v.status === 'DRAFT' && (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
                            onClick={() => requestAction('submit', v.slug)}
                          >
                            <Rocket size={13} />
                            <span>Send for Verification</span>
                          </button>
                        )}

                        <Link
                          to={`/cars/${v.slug || v.id}?from=sell`}
                          state={{ from: '/sell/cars' }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-surface-alt hover:text-primary active:scale-95"
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </Link>

                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95"
                          onClick={() => handleEditVehicleCard(v)}
                          title="Edit Details"
                        >
                          <Pencil size={14} />
                          <span>Edit Details</span>
                        </button>

                        {v.status === 'ARCHIVED' ? (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success shadow-xs transition-all hover:bg-success/20 active:scale-95"
                            onClick={() => requestAction('restore', v.slug)}
                            title="Restore Listing"
                          >
                            <RefreshCw size={14} />
                            <span>Restore</span>
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition-all hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-600 active:scale-95"
                            onClick={() => requestAction('archive', v.slug)}
                            title="Archive Listing"
                          >
                            <Archive size={14} />
                            <span>Archive</span>
                          </button>
                        )}

                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs font-semibold text-danger shadow-xs transition-all hover:bg-danger/10 active:scale-95"
                          onClick={() => requestAction('delete', v.slug)}
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

      {/* MODAL DIALOGS FOR LISTINGS CARD MANAGEMENT */}
      {modalSlug && modalType === 'images' && (
        <VehicleImagesManager slug={modalSlug} onClose={() => { setModalSlug(null); setModalType(null); fetchListings(); }} />
      )}
      {modalSlug && modalType === 'specs' && (
        <VehicleSpecsManager slug={modalSlug} onClose={() => { setModalSlug(null); setModalType(null); fetchListings(); }} />
      )}
      {modalSlug && modalType === 'features' && (
        <VehicleFeaturesManager slug={modalSlug} vehicleType={form.vehicleType || 'CARS'} onClose={() => { setModalSlug(null); setModalType(null); fetchListings(); }} />
      )}
      {modalSlug && modalType === 'docs' && (
        <VehicleDocumentsManager slug={modalSlug} onClose={() => { setModalSlug(null); setModalType(null); fetchListings(); }} />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        isLoading={confirmModal.processing}
        onClose={() => setConfirmModal({ isOpen: false, type: '', slug: '', processing: false })}
        onConfirm={executeAction}
        title={
          confirmModal.type === 'delete' ? 'Delete Vehicle Listing' :
            confirmModal.type === 'archive' ? 'Archive Vehicle Listing' :
              confirmModal.type === 'submit' ? 'Submit for Verification' :
                'Restore Vehicle Listing'
        }
        message={
          confirmModal.type === 'delete' ? 'Are you sure you want to permanently delete this vehicle listing? This action cannot be undone.' :
            confirmModal.type === 'archive' ? 'Are you sure you want to archive this vehicle? It will be hidden from public view.' :
              confirmModal.type === 'submit' ? 'Are you sure you want to submit this vehicle for verification? Our team will review the details before making it public.' :
                'Are you sure you want to restore this vehicle listing to active status?'
        }
        confirmText={
          confirmModal.type === 'delete' ? 'Delete' :
            confirmModal.type === 'archive' ? 'Archive' :
              confirmModal.type === 'submit' ? 'Submit' :
                'Restore'
        }
        variant={confirmModal.type === 'delete' ? 'danger' : confirmModal.type === 'archive' ? 'warning' : 'primary'}
      />
    </div>
  )
}
