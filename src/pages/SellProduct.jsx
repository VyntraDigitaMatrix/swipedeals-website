import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle, ArrowRight, CarFront, Check, Clock, Eye, FileCheck, FileText, Home as HomeIcon,
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

  // View state: 'create' or 'listings'
  const [viewMode, setViewMode] = useState('create')

  // Step tabs inside creation flow: 'details', 'images', 'specifications', 'features', 'documents'
  const [activeStep, setActiveStep] = useState('details')
  const [form, setForm] = useState(() => initialForm(preselectedCategory, user))

  // Once details are saved via "Save Changes", createdSlug is set
  const [createdSlug, setCreatedSlug] = useState(null)
  const [createdVehicle, setCreatedVehicle] = useState(null)
  const [savingDetails, setSavingDetails] = useState(false)
  const [savingAction, setSavingAction] = useState(false)
  const [apiSuccessMsg, setApiSuccessMsg] = useState(null)
  const [apiErrorMsg, setApiErrorMsg] = useState(null)

  // Modals for manage actions from listings table
  const [modalSlug, setModalSlug] = useState(null)
  const [modalType, setModalType] = useState(null) // 'images' | 'specs' | 'features' | 'docs'
  const [deletingSlug, setDeletingSlug] = useState(null)

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
      const msg = err?.response?.data?.message || err?.message || 'Failed to save vehicle details.'
      setApiErrorMsg(msg)
    } fontFinally: {
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
      const msg = err?.response?.data?.message || err?.message || 'Failed to save draft.'
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
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit vehicle for verification.'
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
    setViewMode('create')
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
    setViewMode('create')
  }

  const handleDeleteVehicleCard = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this vehicle listing?')) return
    setDeletingSlug(slug)
    try {
      await deleteListing(slug)
    } catch (err) {
      alert(`Failed to delete listing: ${err?.response?.data?.message || err?.message}`)
    } finally {
      setDeletingSlug(null)
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
      <Breadcrumb items={[{ label: 'Vehicle Listings' }]} />

      {/* Top Header Mode Toggle & Actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Vehicle Management &amp; Selling</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create vehicle listings, manage images, specifications, features &amp; documents, and send for verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-surface-alt p-1">
            <button
              type="button"
              onClick={() => setViewMode('create')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'create' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <Plus size={14} /> Create Vehicle
            </button>
            <button
              type="button"
              onClick={() => {
                fetchListings()
                setViewMode('listings')
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors',
                viewMode === 'listings' ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <CarFront size={14} /> My Vehicle Listings ({userVehicleListings.length})
            </button>
          </div>

          <Button variant="primary" icon={CarFront} onClick={handleStartNewVehicle}>
            Sell Vehicle
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
                {createdSlug && (
                  <span className="rounded-full bg-success/10 px-3 py-1 font-mono text-xs font-bold text-success">
                    Listing Saved (Slug: {createdSlug})
                  </span>
                )}
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

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="VIN (Vehicle Identification Number)"
                  placeholder="VIN Number"
                  value={form.vin}
                  onChange={(e) => updateField('vin', e.target.value)}
                  maxLength={100}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Seller Name"
                    value={form.sellerName}
                    onChange={(e) => updateField('sellerName', e.target.value)}
                  />
                  <Input
                    label="Seller Phone"
                    value={form.sellerPhone}
                    onChange={(e) => updateField('sellerPhone', e.target.value)}
                  />
                </div>
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                {userVehicleListings.length}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">Your Vehicle Listings</h2>
                <p className="text-xs text-text-secondary">All vehicles created and submitted for verification</p>
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

              <Button variant="primary" icon={Plus} onClick={handleStartNewVehicle}>
                Sell Vehicle
              </Button>
            </div>
          </div>

          {userVehicleListings.length === 0 && !listingsLoading ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center shadow-soft">
              <CarFront size={48} className="mx-auto mb-3 text-text-light/50" />
              <h3 className="text-base font-bold text-text">No vehicle listings found</h3>
              <p className="mt-1 text-xs text-text-secondary">Start listing your cars or commercial vehicles to reach buyers across SwipeDeals.</p>
              <Button variant="primary" className="mt-6" icon={Plus} onClick={handleStartNewVehicle}>
                Sell Vehicle
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

                        {/* Sub-item Count Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-bold text-primary">
                            <ImagePlus size={12} /> {imagesCount} Images
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 font-mono text-[11px] font-bold text-success">
                            <FileCheck size={12} /> {docsCount} Docs
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2.5 py-1 font-mono text-[11px] font-bold text-info">
                            <Sliders size={12} /> {specsCount} Specs
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 font-mono text-[11px] font-bold text-warning">
                            <Sparkles size={12} /> {featuresCount} Features
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-alt/40 px-6 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          icon={ImagePlus}
                          onClick={() => {
                            setModalSlug(v.slug)
                            setModalType('images')
                          }}
                        >
                          Photos ({imagesCount})
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Sliders}
                          onClick={() => {
                            setModalSlug(v.slug)
                            setModalType('specs')
                          }}
                        >
                          Specs ({specsCount})
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Sparkles}
                          onClick={() => {
                            setModalSlug(v.slug)
                            setModalType('features')
                          }}
                        >
                          Features ({featuresCount})
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={FileCheck}
                          onClick={() => {
                            setModalSlug(v.slug)
                            setModalType('docs')
                          }}
                        >
                          Docs ({docsCount})
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {v.status === 'DRAFT' && (
                          <Button
                            size="xs"
                            variant="primary"
                            icon={Rocket}
                            onClick={() => {
                              if (window.confirm('Submit this vehicle for verification?')) {
                                submitListing(v.slug)
                              }
                            }}
                          >
                            Send for Verification
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Pencil}
                          onClick={() => handleEditVehicleCard(v)}
                        >
                          Edit Details
                        </Button>
                        {v.status === 'ARCHIVED' ? (
                          <Button
                            size="xs"
                            variant="outline"
                            icon={RefreshCw}
                            onClick={() => {
                              if (window.confirm('Restore this archived vehicle listing?')) {
                                restoreListing(v.slug)
                              }
                            }}
                          >
                            Restore
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-text-secondary"
                            onClick={() => {
                              if (window.confirm('Archive this vehicle listing?')) {
                                archiveListing(v.slug)
                              }
                            }}
                          >
                            Archive
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="border-danger/30 text-danger hover:bg-danger/10"
                          disabled={deletingSlug === v.slug}
                          onClick={() => handleDeleteVehicleCard(v.slug)}
                        >
                          {deletingSlug === v.slug ? 'Deleting...' : 'Delete'}
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
    </div>
  )
}
