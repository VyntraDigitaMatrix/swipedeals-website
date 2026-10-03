import { useEffect, useState } from 'react'
import {
  Archive, Building2, Clock, Eye, FileCheck, Heart, ImagePlus, Laptop, LayoutDashboard, MessageCircle, PackageSearch,
  Pencil, RefreshCw, Rocket, ShieldCheck, ShoppingBag, Sliders, Sparkles, Star, Tags, Trash2, User as UserIcon, Wrench, X, XCircle,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Badge from '../components/common/Badge'
import EmptyState from '../components/common/EmptyState'
import StatCard from '../components/dashboard/StatCard'
import SimpleBarChart from '../components/dashboard/SimpleBarChart'
import SimpleLineChart from '../components/dashboard/SimpleLineChart'
import SavedListingsTable from '../components/dashboard/SavedListingsTable'
// import SellerReviewSection from '../components/seller/SellerReviewSection'
import PropertyImagesManager from '../components/dashboard/PropertyImagesManager'
import VehicleImagesManager from '../components/dashboard/VehicleImagesManager'
import VehicleDocumentsManager from '../components/dashboard/VehicleDocumentsManager'
import VehicleFeaturesManager from '../components/dashboard/VehicleFeaturesManager'
import VehicleSpecsManager from '../components/dashboard/VehicleSpecsManager'
import ChatDrawer from '../components/chat/ChatDrawer'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import TextArea from '../components/forms/TextArea'
import { useAuth } from '../hooks/useAuth'
import { userProfileService } from '../services/userProfileService'
import { useWishlist } from '../hooks/useWishlist'
import { useListingsStore } from '../hooks/useListingsStore'
import { useVehicleListings } from '../hooks/useVehicleListings'
import { usePropertyListings } from '../hooks/usePropertyListings'
import { useSparePartsListings } from '../hooks/useSparePartsListings'
import { useElectronicsListings } from '../hooks/useElectronicsListings'
import { useChat } from '../hooks/useChat'
import {
  VEHICLE_BRANDS,
  VEHICLE_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
} from '../services/vehicleListingService'
import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  FURNISHING_STATUSES,
  CONSTRUCTION_STATUSES,
  FACING_OPTIONS,
  AREA_UNITS,
} from '../services/propertyListingService'
import { findItemsByIds } from '../utils/findItem'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'
import { titleCaseEnum, PLACEHOLDER_IMAGE } from '../utils/enumFormat'
import { browsingActivity, inquiriesByWeek, userOrders, userInquiries, userMessages } from '../data/dashboard'

const LISTING_STATUS_VARIANT = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  PUBLISHED: 'success',
  REJECTED: 'danger',
  SOLD: 'info',
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  RENTED: 'info',
  ARCHIVED: 'neutral',
}

const LISTING_STATUS_LABEL = {
  pending: 'Under Review',
  approved: 'Live',
  rejected: 'Rejected',
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Under Review',
  PUBLISHED: 'Live',
  REJECTED: 'Rejected',
  SOLD: 'Sold',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  RENTED: 'Rented',
  ARCHIVED: 'Archived',
}

const CATEGORY_LABELS = {
  cars: 'Car',
  commercial: 'Commercial',
  electronics: 'Electronics',
  properties: 'Property',
  'spare-parts': 'Spare Part',
}

const CATEGORY_DOT = {
  cars: 'bg-primary',
  commercial: 'bg-info',
  electronics: 'bg-warning',
  properties: 'bg-success',
  'spare-parts': 'bg-danger',
}

const ORDER_STATUS_VARIANT = { Delivered: 'success', Shipped: 'info', Processing: 'warning', Cancelled: 'danger' }
const INQUIRY_STATUS_VARIANT = { Responded: 'success', Pending: 'warning', Closed: 'neutral' }

function SectionHeading({ eyebrow, title, count }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="font-mono text-xs font-bold tabular-nums text-primary">{String(count).padStart(2, '0')}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">{eyebrow}</p>
        <h2 className="text-lg font-bold text-text">{title}</h2>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { tab: urlTab } = useParams()
  const navigate = useNavigate()
  const [tab, setTabState] = useState(urlTab || 'overview')

  // Sync local tab state when URL changes (browser back/forward)
  useEffect(() => {
    setTabState(urlTab || 'overview')
  }, [urlTab])

  const setTab = (newTab) => {
    if (newTab === 'overview') {
      navigate('/dashboard', { replace: true })
    } else {
      navigate(`/dashboard/${newTab}`, { replace: true })
    }
  }
  const { user } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { getByPhone } = useListingsStore()
  const {
    listings: apiListings,
    archivedListings: archivedVehicleListings,
    loading: apiLoading,
    fetchListings,
    fetchArchivedListings,
    updateListing,
    deleteListing,
    submitListing: submitVehicleListing,
    archiveListing: archiveVehicleListing,
    restoreListing: restoreVehicleListing,
  } = useVehicleListings()

  const {
    listings: propertyListings,
    loading: propertyLoading,
    fetchListings: fetchPropertyListings,
    patchListing: patchPropertyListing,
    deleteListing: deletePropertyListing,
    submitListing: submitPropertyListing,
    makeAvailableListing: makeAvailablePropertyListing,
    archiveListing: archivePropertyListing,
  } = usePropertyListings()

  const {
    listings: electronicsListings,
    loading: electronicsLoading,
    fetchListings: fetchElectronicsListings,
    deleteListing: deleteElectronicsListing,
    submitListing: submitElectronicsListing,
    makeAvailableListing: makeAvailableElectronicsListing,
    archiveListing: archiveElectronicsListing,
  } = useElectronicsListings()

  const {
    listings: sparePartsListings,
    loading: sparePartsLoading,
    fetchListings: fetchSparePartsListings,
    deleteListing: deleteSparePartListing,
    submitListing: submitSparePartListing,
    makeAvailableListing: makeAvailableSparePartListing,
    archiveListing: archiveSparePartListing,
  } = useSparePartsListings()

  const [editingVehicle, setEditingVehicle] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState(null)
  const [editingProperty, setEditingProperty] = useState(null)
  const [propEditForm, setPropEditForm] = useState({})
  const [savingPropEdit, setSavingPropEdit] = useState(false)
  const [deletingPropSlug, setDeletingPropSlug] = useState(null)
  const [managingImagesForSlug, setManagingImagesForSlug] = useState(null)
  const [managingVehicleImagesSlug, setManagingVehicleImagesSlug] = useState(null)
  const [managingVehicleDocsSlug, setManagingVehicleDocsSlug] = useState(null)
  const [managingVehicleFeaturesSlug, setManagingVehicleFeaturesSlug] = useState(null)
  const [managingVehicleSpecsSlug, setManagingVehicleSpecsSlug] = useState(null)
  const [dashboardChatOpen, setDashboardChatOpen] = useState(false)
  const [chatRecipient, setChatRecipient] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)

  const handleSubmitVehicle = async (slug) => {
    if (!window.confirm('Submit this vehicle listing for approval?')) return
    try {
      await submitVehicleListing(slug)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit vehicle listing.'
      if (errMsg.toLowerCase().includes('image') || errMsg.toLowerCase().includes('photo')) {
        if (window.confirm(`${errMsg}\n\nWould you like to upload images now?`)) {
          setManagingVehicleImagesSlug(slug)
        }
      } else {
        alert(errMsg)
      }
    }
  }

  const { conversations: apiConversations, loading: chatLoading, selectConversation } = useChat(true)

  useEffect(() => {
    fetchListings().catch(() => { })
    fetchArchivedListings().catch(() => { })
    fetchPropertyListings().catch(() => { })
    fetchElectronicsListings().catch(() => { })
    fetchSparePartsListings().catch(() => { })
    
    // Fetch dashboard stats from backend
    userProfileService.getDashboardStats()
      .then((res) => {
        if (res?.data) setDashboardStats(res.data)
      })
      .catch((err) => console.error('Failed to fetch dashboard stats:', err))
  }, [fetchListings, fetchArchivedListings, fetchPropertyListings, fetchElectronicsListings, fetchSparePartsListings])

  const savedItems = findItemsByIds(wishlist).map((item) => ({ ...item, categoryLabel: CATEGORY_LABELS[item.category] }))
  const localListings = user?.phone ? getByPhone(user.phone) : []
  const combinedListingsCount = apiListings.length + propertyListings.length + electronicsListings.length + sparePartsListings.length + localListings.length
  const unreadCount = userMessages.filter((m) => m.unread).length
  const initials = (user?.name || 'U').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')

  const archivedProperties = propertyListings.filter((p) => p.status === 'ARCHIVED')
  const archivedElectronics = electronicsListings.filter((e) => e.status === 'ARCHIVED')
  const archivedSpareParts = sparePartsListings.filter((s) => s.status === 'ARCHIVED')
  const totalArchivedCount = archivedVehicleListings.length + archivedProperties.length + archivedElectronics.length + archivedSpareParts.length

  // Pending approval across all listing types
  const pendingVehicles = apiListings.filter((l) => l.status === 'PENDING_APPROVAL' || l.status === 'pending').length
  const pendingProperties = propertyListings.filter((l) => l.status === 'PENDING_APPROVAL' || l.status === 'pending').length
  const pendingElectronics = electronicsListings.filter((l) => l.status === 'PENDING_APPROVAL' || l.status === 'pending').length
  const pendingSpareParts = sparePartsListings.filter((l) => l.status === 'PENDING_APPROVAL' || l.status === 'pending').length
  const pendingApprovalCount = pendingVehicles + pendingProperties + pendingElectronics + pendingSpareParts

  // Use dashboard API stats if available, otherwise fallback to local calculation
  const displayTotalListings = dashboardStats?.totalProducts ?? combinedListingsCount
  const displayTotalLeads = dashboardStats?.totalLeads ?? 0
  const displayTotalArchived = dashboardStats?.totalArchivedProducts ?? totalArchivedCount

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'listings', label: 'My Listings', icon: Tags, count: displayTotalListings },
    { id: 'archived', label: 'Archived Listings', icon: Archive, count: displayTotalArchived },
    { id: 'properties', label: 'My Properties', icon: Building2, count: propertyListings.length },
    { id: 'electronics', label: 'My Electronics', icon: Laptop, count: electronicsListings.length },
    { id: 'spare-parts', label: 'My Spare Parts', icon: Wrench, count: sparePartsListings.length },
    { id: 'saved', label: 'Saved', icon: Heart, count: savedItems.length },
    { id: 'inquiries', label: 'Inquiries', icon: PackageSearch, count: userInquiries.length },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: unreadCount },
    // { id: 'reviews', label: 'Reviews', icon: Star, count: null },
  ]

  const handleOpenEdit = (v) => {
    setEditingVehicle(v)
    setEditForm({
      brand: v.brand || 'MARUTI_SUZUKI',
      model: v.model || '',
      variant: v.variant || '',
      year: v.year || new Date().getFullYear(),
      price: v.price || 0,
      mileage: v.mileage || 0,
      condition: v.condition || 'USED',
      fuelType: v.fuelType || 'PETROL',
      transmissionType: v.transmissionType || 'MANUAL',
      color: v.color || '',
      registrationNumber: v.registrationNumber || '',
      chassisNumber: v.chassisNumber || '',
      vin: v.vin || '',
      vehicleType: v.vehicleType || 'CAR',
      ownersCount: v.ownersCount || 1,
      description: v.description || '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editingVehicle?.slug) return
    setSavingEdit(true)
    try {
      await updateListing(editingVehicle.slug, editForm)
      setEditingVehicle(null)
    } catch (err) {
      alert(`Failed to update vehicle listing: ${err?.response?.data?.message || err?.message}`)
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDeleteVehicle = async (slug) => {
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

  const handleOpenPropEdit = (p) => {
    setEditingProperty(p)
    setPropEditForm({
      title: p.title || '',
      description: p.description || '',
      propertyType: p.propertyType || 'APARTMENT',
      listingType: p.listingType || 'FOR_SALE',
      price: p.price || 0,
      negotiable: p.negotiable || false,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      balconies: p.balconies || 0,
      builtUpArea: p.builtUpArea || 0,
      carpetArea: p.carpetArea || 0,
      plotArea: p.plotArea || 0,
      areaUnit: p.areaUnit || 'SQ_FT',
      furnishingStatus: p.furnishingStatus || 'UNFURNISHED',
      constructionStatus: p.constructionStatus || 'READY_TO_MOVE',
      facing: p.facing || '',
      floor: p.floor ?? '',
      totalFloors: p.totalFloors ?? '',
      ageOfProperty: p.ageOfProperty ?? '',
      city: p.city || '',
      locality: p.locality || '',
      address: p.address || '',
      pincode: p.pincode || '',
    })
  }

  const handleSavePropEdit = async () => {
    if (!editingProperty?.slug) return
    setSavingPropEdit(true)
    try {
      await patchPropertyListing(editingProperty.slug, propEditForm)
      setEditingProperty(null)
    } catch (err) {
      alert(`Failed to update property: ${err?.response?.data?.message || err?.message}`)
    } finally {
      setSavingPropEdit(false)
    }
  }

  const handleDeleteProperty = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return
    setDeletingPropSlug(slug)
    try {
      await deletePropertyListing(slug)
    } catch (err) {
      alert(`Failed to delete property: ${err?.response?.data?.message || err?.message}`)
    } finally {
      setDeletingPropSlug(null)
    }
  }

  const handleSubmitProperty = async (slug) => {
    if (!window.confirm('Submit this property for approval?')) return
    try {
      await submitPropertyListing(slug)
    } catch (err) {
      alert(`Failed to submit property: ${err?.response?.data?.message || err?.message}`)
    }
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'My Dashboard' }]} />

      {/* Header plate */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-surface p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white" aria-hidden="true">
              {initials || <UserIcon size={22} />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">Account Manifest</p>
              <h1 className="text-2xl font-extrabold text-text sm:text-[1.75rem]">Welcome back, {user?.name || 'there'}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                <span><strong className="text-text">{combinedListingsCount}</strong> listings</span>
                <span className="text-border">·</span>
                <span><strong className="text-text">{savedItems.length}</strong> saved</span>
                <span className="text-border">·</span>
                <span><strong className="text-text">{unreadCount}</strong> unread</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button to="/profile" variant="outline" icon={UserIcon}>
              Edit Profile
            </Button>
            <Button to="/cars" variant="primary" icon={Sparkles}>
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>

      {/* Tab rail */}
      <div className="no-scrollbar mb-8 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-surface-alt/60 p-1.5">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                active ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
              )}
            >
              <t.icon size={16} aria-hidden="true" />
              {t.label}
              {t.count !== null && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums',
                    active ? 'bg-primary/10 text-primary' : 'bg-border/60 text-text-secondary'
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Listings"
              value={displayTotalListings}
              icon={Tags}
              index={0}
              accent="primary"
            />
            <StatCard
              label="Total Leads"
              value={displayTotalLeads}
              icon={PackageSearch}
              index={1}
              accent="success"
            />
            <StatCard
              label="Pending Approval"
              value={pendingApprovalCount}
              icon={Clock}
              index={2}
              accent="warning"
            />
            <StatCard
              label="Archived Listings"
              value={displayTotalArchived}
              icon={Archive}
              index={3}
              accent="danger"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SimpleLineChart data={browsingActivity} title="Listings Viewed" subtitle="Last 7 months" />
            <SimpleBarChart data={inquiriesByWeek} title="Inquiries Sent" subtitle="This week" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Inventory" title="Active Listings" count={Math.min(combinedListingsCount, 3)} />
              {combinedListingsCount > 0 ? (
                <div className="space-y-4">
                  {apiListings.slice(0, 3).map((v) => {
                    const vehicleImage = (typeof v.images?.[0] === 'string' ? v.images[0] : v.images?.[0]?.imageUrl) || v.primaryImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=60'
                    return (
                      <div key={v.slug} className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                          <img src={vehicleImage} alt="" className="h-full w-full object-cover" />
                          <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-1 text-sm font-bold text-text">{titleCaseEnum(v.brand)} {v.model} {v.variant}</p>
                            <Badge variant={LISTING_STATUS_VARIANT[v.status] || 'neutral'}>
                              {LISTING_STATUS_LABEL[v.status] || v.status}
                            </Badge>
                          </div>
                          <p className="mt-1 font-mono text-xs font-semibold text-text-secondary">
                            {v.year} · {titleCaseEnum(v.fuelType)} · Reg: {v.registrationNumber || 'N/A'}
                          </p>
                          <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(v.price)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
                  <p className="text-sm text-text-secondary">No active listings currently.</p>
                </div>
              )}
            </div>

            <div>
              <SectionHeading eyebrow="Messages" title="Recent Inquiries" count={Math.min(userMessages.length, 3)} />
              {userMessages.length > 0 ? (
                <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                  {userMessages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className={cn('flex items-start gap-3 p-4', msg.unread && 'bg-primary/[0.03]')}>
                      <img src={msg.avatar} alt={msg.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-text">{msg.name}</p>
                          <span className="font-mono text-[10px] text-text-light">{msg.time}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">{msg.preview}</p>
                      </div>
                      {msg.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
                  <p className="text-sm text-text-secondary">No recent messages.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Wishlist" title="Recently Saved" count={Math.min(savedItems.length, 5)} />
            <SavedListingsTable items={savedItems.slice(0, 5)} onRemove={removeFromWishlist} categoryDot={CATEGORY_DOT} />
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{combinedListingsCount} listing{combinedListingsCount === 1 ? '' : 's'} submitted</p>
              <button
                type="button"
                onClick={() => fetchListings()}
                disabled={apiLoading}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} className={cn(apiLoading && 'animate-spin')} /> Refresh
              </button>
            </div>
            <Button to="/sell" variant="primary" size="sm">
              Submit New Listing
            </Button>
          </div>

          {combinedListingsCount === 0 && !apiLoading ? (
            <EmptyState
              icon={Tags}
              title="No listings submitted yet"
              description="List your car, commercial vehicle, or other items — our team reviews it before it goes live."
              actionLabel="Sell Something"
              actionTo="/sell"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* API Vehicle Listings */}
              {apiListings.map((v) => {
                const vehicleImage = v.images?.[0]?.imageUrl || v.primaryImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=60'
                const vehicleTitle = v.title || `${titleCaseEnum(v.brand)} ${v.model} ${v.variant}`.trim()
                return (
                  <div key={v.slug} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={vehicleImage} alt={vehicleTitle} className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">
                            {vehicleTitle}
                          </p>
                          <Badge variant={LISTING_STATUS_VARIANT[v.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[v.status] || v.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          {v.year} · {titleCaseEnum(v.fuelType)} · {titleCaseEnum(v.transmissionType)}
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(v.price)}</p>
                      </div>
                    </div>

                    {/* Schema fields display */}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Reg:</span> {v.registrationNumber || 'N/A'}</div>
                      <div><span className="text-text-light">VIN:</span> {v.vin || 'N/A'}</div>
                      <div><span className="text-text-light">Chassis:</span> {v.chassisNumber || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/cars/${v.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {v.status === 'DRAFT' && (
                          <Button
                            size="xs"
                            variant="primary"
                            icon={Rocket}
                            onClick={() => handleSubmitVehicle(v.slug)}
                          >
                            Submit
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="outline"
                          icon={ImagePlus}
                          onClick={() => setManagingVehicleImagesSlug(v.slug)}
                        >
                          Photos
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={FileCheck}
                          onClick={() => setManagingVehicleDocsSlug(v.slug)}
                        >
                          Docs
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Sparkles}
                          onClick={() => setManagingVehicleFeaturesSlug({ slug: v.slug, vehicleType: v.vehicleType })}
                        >
                          Features
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Sliders}
                          onClick={() => setManagingVehicleSpecsSlug(v.slug)}
                        >
                          Specs
                        </Button>
                        {v.status === 'ARCHIVED' ? (
                          <Button
                            size="xs"
                            variant="outline"
                            icon={RefreshCw}
                            onClick={() => {
                              if (window.confirm('Restore this archived vehicle listing?')) {
                                restoreVehicleListing(v.slug)
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
                                archiveVehicleListing(v.slug)
                              }
                            }}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} onClick={() => handleOpenEdit(v)}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          disabled={deletingSlug === v.slug}
                          onClick={() => handleDeleteVehicle(v.slug)}
                        >
                          {deletingSlug === v.slug ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* API Property Listings */}
              {propertyListings.map((p) => {
                const propType = PROPERTY_TYPES.find((t) => t.value === p.propertyType)?.label || titleCaseEnum(p.propertyType || '')
                const listType = LISTING_TYPES.find((t) => t.value === p.listingType)?.label || titleCaseEnum(p.listingType || '')
                const primaryImage = p.images?.find((img) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || p.primaryImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={p.slug || p.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-success" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{p.title}</p>
                          <Badge variant={LISTING_STATUS_VARIANT[p.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[p.status] || p.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Property · {propType} ({listType})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(p.price)}</p>
                      </div>
                    </div>

                    {/* Property details schema grid */}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">City:</span> {p.city || 'N/A'}</div>
                      <div><span className="text-text-light">Locality:</span> {p.locality || 'N/A'}</div>
                      <div><span className="text-text-light">Area:</span> {p.builtUpArea || p.carpetArea || p.plotArea || 'N/A'} {p.areaUnit ? titleCaseEnum(p.areaUnit) : ''}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/sell/properties?mode=edit&slug=${p.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {p.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => submitPropertyListing(p.slug)}>
                            Submit
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={ImagePlus} onClick={() => setManagingImagesForSlug(p.slug)}>
                          Photos
                        </Button>
                        {p.status !== 'AVAILABLE' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => makeAvailablePropertyListing(p.slug)}
                          >
                            Available
                          </Button>
                        )}
                        {p.status !== 'ARCHIVED' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white"
                            onClick={() => archivePropertyListing(p.slug)}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/properties?mode=edit&slug=${p.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          disabled={deletingPropSlug === p.slug}
                          onClick={() => deletePropertyListing(p.slug)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* API Electronics Listings */}
              {electronicsListings.map((e) => {
                const electronicsImage = e.images?.[0]?.imageUrl || e.primaryImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={e.slug || e.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={electronicsImage} alt={e.title} className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{e.title}</p>
                          <Badge variant={LISTING_STATUS_VARIANT[e.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[e.status] || e.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Electronics · {titleCaseEnum(e.type || '')} ({e.brand} {e.model})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(e.price)}</p>
                      </div>
                    </div>

                    {/* Electronics details schema grid */}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Type:</span> {titleCaseEnum(e.type || 'N/A')}</div>
                      <div><span className="text-text-light">Condition:</span> {e.condition || 'N/A'}</div>
                      <div><span className="text-text-light">Year:</span> {e.purchaseYear || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/sell/electronics?mode=edit&slug=${e.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {e.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => submitElectronicsListing(e.slug)}>
                            Submit
                          </Button>
                        )}
                        {e.status !== 'AVAILABLE' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => makeAvailableElectronicsListing(e.slug)}
                          >
                            Available
                          </Button>
                        )}
                        {e.status !== 'ARCHIVED' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white"
                            onClick={() => archiveElectronicsListing(e.slug)}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/electronics?mode=edit&slug=${e.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this electronics listing?')) {
                              deleteElectronicsListing(e.slug)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* API Spare Parts Listings */}
              {sparePartsListings.map((s) => {
                const spareImage = s.images?.[0]?.imageUrl || s.primaryImage || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={s.slug || s.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={spareImage} alt={s.title} className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">
                            {s.title}
                          </p>
                          <Badge variant={LISTING_STATUS_VARIANT[s.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[s.status] || s.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Spare Part · {s.category || 'N/A'} ({s.brand})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(s.price)}</p>
                      </div>
                    </div>

                    {/* Spare Part details schema grid */}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Sub:</span> {s.subCategory || 'N/A'}</div>
                      <div><span className="text-text-light">Part #:</span> {s.partNumber || 'N/A'}</div>
                      <div><span className="text-text-light">Cond:</span> {s.condition || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/sell/spare-parts?mode=edit&slug=${s.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {s.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => {
                            if (window.confirm('Submit this spare part for approval?')) {
                              submitSparePartListing(s.slug)
                            }
                          }}>
                            Submit
                          </Button>
                        )}
                        {s.status !== 'AVAILABLE' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => makeAvailableSparePartListing(s.slug)}
                          >
                            Available
                          </Button>
                        )}
                        {s.status !== 'ARCHIVED' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white"
                            onClick={() => archiveSparePartListing(s.slug)}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/spare-parts?mode=edit&slug=${s.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this spare part listing?')) {
                              deleteSparePartListing(s.slug)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Local Fallback Listings */}
              {localListings.map((listing) => (
                <div key={listing.id} className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                    <img src={listing.images?.[0] || PLACEHOLDER_IMAGE} alt={listing.title} className="h-full w-full object-cover" />
                    <span className={cn('absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full', CATEGORY_DOT[listing.category])} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-bold text-text">{listing.title}</p>
                      <Badge variant={LISTING_STATUS_VARIANT[listing.status]}>{LISTING_STATUS_LABEL[listing.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{CATEGORY_LABELS[listing.category] || listing.category}</p>
                    <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(listing.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'archived' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{totalArchivedCount} archived listing{totalArchivedCount === 1 ? '' : 's'}</p>
              <button
                type="button"
                onClick={() => {
                  fetchArchivedListings().catch(() => { })
                  fetchPropertyListings().catch(() => { })
                  fetchElectronicsListings().catch(() => { })
                  fetchSparePartsListings().catch(() => { })
                }}
                disabled={apiLoading || propertyLoading || electronicsLoading || sparePartsLoading}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} className={cn((apiLoading || propertyLoading || electronicsLoading || sparePartsLoading) && 'animate-spin')} /> Refresh
              </button>
            </div>
          </div>

          {totalArchivedCount === 0 && !apiLoading && !propertyLoading && !electronicsLoading && !sparePartsLoading ? (
            <EmptyState
              icon={Archive}
              title="No archived listings"
              description="Listings you archive will appear here. You can restore or make them available anytime to make them live again."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Archived Vehicles */}
              {archivedVehicleListings.map((v) => {
                const vehicleImage = v.images?.[0]?.imageUrl || v.primaryImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=60'
                const vehicleTitle = v.title || `${titleCaseEnum(v.brand)} ${v.model} ${v.variant}`.trim()
                return (
                  <div key={v.slug} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/70 p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={vehicleImage} alt={vehicleTitle} className="h-full w-full object-cover grayscale opacity-80" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">
                            {vehicleTitle}
                          </p>
                          <Badge variant="neutral">
                            ARCHIVED
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Vehicle · {v.year} · {titleCaseEnum(v.fuelType)} · {titleCaseEnum(v.transmissionType)}
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(v.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Reg:</span> {v.registrationNumber || 'N/A'}</div>
                      <div><span className="text-text-light">VIN:</span> {v.vin || 'N/A'}</div>
                      <div><span className="text-text-light">Chassis:</span> {v.chassisNumber || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-text-secondary">Archived Vehicle</span>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          icon={RefreshCw}
                          onClick={() => {
                            if (window.confirm('Restore this archived vehicle listing?')) {
                              restoreVehicleListing(v.slug)
                            }
                          }}
                        >
                          Restore
                        </Button>
                        <Button size="xs" variant="outline" icon={Pencil} onClick={() => handleOpenEdit(v)}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          disabled={deletingSlug === v.slug}
                          onClick={() => handleDeleteVehicle(v.slug)}
                        >
                          {deletingSlug === v.slug ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Archived Properties */}
              {archivedProperties.map((p) => {
                const propType = PROPERTY_TYPES.find((t) => t.value === p.propertyType)?.label || titleCaseEnum(p.propertyType || '')
                const listType = LISTING_TYPES.find((t) => t.value === p.listingType)?.label || titleCaseEnum(p.listingType || '')
                const primaryImage = p.images?.find((img) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || p.primaryImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={p.slug || p.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/70 p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover grayscale opacity-80" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-success" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{p.title}</p>
                          <Badge variant="neutral">
                            ARCHIVED
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Property · {propType} ({listType})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(p.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">City:</span> {p.city || 'N/A'}</div>
                      <div><span className="text-text-light">Locality:</span> {p.locality || 'N/A'}</div>
                      <div><span className="text-text-light">Area:</span> {p.builtUpArea || p.carpetArea || p.plotArea || 'N/A'} {p.areaUnit ? titleCaseEnum(p.areaUnit) : ''}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-text-secondary">Archived Property</span>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          onClick={() => makeAvailablePropertyListing(p.slug)}
                        >
                          Make Available
                        </Button>
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/properties?mode=edit&slug=${p.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          disabled={deletingPropSlug === p.slug}
                          onClick={() => deletePropertyListing(p.slug)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Archived Electronics */}
              {archivedElectronics.map((e) => {
                const electronicsImage = e.images?.[0]?.imageUrl || e.primaryImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={e.slug || e.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/70 p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={electronicsImage} alt={e.title} className="h-full w-full object-cover grayscale opacity-80" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{e.title}</p>
                          <Badge variant="neutral">
                            ARCHIVED
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Electronics · {titleCaseEnum(e.type || '')} ({e.brand} {e.model})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(e.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Type:</span> {titleCaseEnum(e.type || 'N/A')}</div>
                      <div><span className="text-text-light">Condition:</span> {e.condition || 'N/A'}</div>
                      <div><span className="text-text-light">Year:</span> {e.purchaseYear || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-text-secondary">Archived Electronics</span>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          onClick={() => makeAvailableElectronicsListing(e.slug)}
                        >
                          Make Available
                        </Button>
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/electronics?mode=edit&slug=${e.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this electronics listing?')) {
                              deleteElectronicsListing(e.slug)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Archived Spare Parts */}
              {archivedSpareParts.map((s) => {
                const spareImage = s.images?.[0]?.imageUrl || s.primaryImage || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={s.slug || s.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/70 p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={spareImage} alt={s.title} className="h-full w-full object-cover grayscale opacity-80" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{s.title}</p>
                          <Badge variant="neutral">
                            ARCHIVED
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Spare Part · {s.category || 'N/A'} ({s.brand})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(s.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Sub:</span> {s.subCategory || 'N/A'}</div>
                      <div><span className="text-text-light">Part #:</span> {s.partNumber || 'N/A'}</div>
                      <div><span className="text-text-light">Cond:</span> {s.condition || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-text-secondary">Archived Spare Part</span>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          onClick={() => makeAvailableSparePartListing(s.slug)}
                        >
                          Make Available
                        </Button>
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/spare-parts?mode=edit&slug=${s.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this spare part listing?')) {
                              deleteSparePartListing(s.slug)
                            }
                          }}
                        >
                          Delete
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

      {tab === 'properties' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{propertyListings.length} propert{propertyListings.length === 1 ? 'y' : 'ies'}</p>
              <button
                type="button"
                onClick={() => fetchPropertyListings()}
                disabled={propertyLoading}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} className={cn(propertyLoading && 'animate-spin')} /> Refresh
              </button>
            </div>
            <Button to="/sell/property" variant="primary" size="sm" icon={Building2}>
              List New Property
            </Button>
          </div>

          {propertyListings.length === 0 && !propertyLoading ? (
            <EmptyState
              icon={Building2}
              title="No properties listed yet"
              description="List your apartment, villa, plot or commercial space — our team reviews it before it goes live."
              actionLabel="List Property"
              actionTo="/sell/property"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {propertyListings.map((p) => {
                const propType = PROPERTY_TYPES.find((t) => t.value === p.propertyType)?.label || titleCaseEnum(p.propertyType || '')
                const listType = LISTING_TYPES.find((t) => t.value === p.listingType)?.label || titleCaseEnum(p.listingType || '')
                const primaryImage = p.images?.find((img) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE
                return (
                  <div key={p.slug || p.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={primaryImage} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-success" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{p.title}</p>
                          <Badge variant={LISTING_STATUS_VARIANT[p.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[p.status] || p.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          {propType} · {listType}
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(p.price)}</p>
                      </div>
                    </div>

                    {/* Property details grid */}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">City:</span> {p.city || 'N/A'}</div>
                      <div><span className="text-text-light">Locality:</span> {p.locality || 'N/A'}</div>
                      <div><span className="text-text-light">Area:</span> {p.builtUpArea || p.carpetArea || p.plotArea || 'N/A'} {p.areaUnit ? titleCaseEnum(p.areaUnit) : ''}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      {p.slug && (
                        <Link to={`/properties/${p.slug}`} className="text-xs font-semibold text-primary hover:underline">
                          View details &rarr;
                        </Link>
                      )}
                      <div className="flex gap-2">
                        {p.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => handleSubmitProperty(p.slug)}>
                            Submit
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={ImagePlus} onClick={() => setManagingImagesForSlug(p.slug)}>
                          Images
                        </Button>
                        <Button size="xs" variant="outline" icon={Pencil} onClick={() => handleOpenPropEdit(p)}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          disabled={deletingPropSlug === p.slug}
                          onClick={() => handleDeleteProperty(p.slug)}
                        >
                          {deletingPropSlug === p.slug ? 'Deleting...' : 'Delete'}
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

      {tab === 'saved' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-secondary">{savedItems.length} saved listing{savedItems.length === 1 ? '' : 's'}</p>
          </div>
          <SavedListingsTable items={savedItems} onRemove={removeFromWishlist} categoryDot={CATEGORY_DOT} />
        </div>
      )}

      {tab === 'electronics' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{electronicsListings.length} electronics product{electronicsListings.length === 1 ? '' : 's'}</p>
              <button
                type="button"
                onClick={() => fetchElectronicsListings()}
                disabled={electronicsLoading}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} className={cn(electronicsLoading && 'animate-spin')} /> Refresh
              </button>
            </div>
            <Button to="/sell/electronics" variant="primary" size="sm" icon={Laptop}>
              Sell Electronics
            </Button>
          </div>

          {electronicsListings.length === 0 && !electronicsLoading ? (
            <EmptyState
              icon={Laptop}
              title="No electronics listed yet"
              description="List mobile phones, laptops, TVs or appliances — our team reviews it before it goes live."
              actionLabel="Sell Electronics"
              actionTo="/sell/electronics"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {electronicsListings.map((e) => {
                const electronicsImage = e.images?.[0]?.imageUrl || e.primaryImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={e.slug || e.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={electronicsImage} alt={e.title} className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{e.title}</p>
                          <Badge variant={LISTING_STATUS_VARIANT[e.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[e.status] || e.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          {titleCaseEnum(e.type || '')} · {e.brand} {e.model}
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(e.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Type:</span> {titleCaseEnum(e.type || 'N/A')}</div>
                      <div><span className="text-text-light">Condition:</span> {e.condition || 'N/A'}</div>
                      <div><span className="text-text-light">Year:</span> {e.purchaseYear || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/sell/electronics?mode=edit&slug=${e.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {e.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => submitElectronicsListing(e.slug)}>
                            Submit
                          </Button>
                        )}
                        {e.status !== 'AVAILABLE' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => makeAvailableElectronicsListing(e.slug)}
                          >
                            Available
                          </Button>
                        )}
                        {e.status !== 'ARCHIVED' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white"
                            onClick={() => archiveElectronicsListing(e.slug)}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/electronics?mode=edit&slug=${e.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this electronics listing?')) {
                              deleteElectronicsListing(e.slug)
                            }
                          }}
                        >
                          Delete
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

      {tab === 'spare-parts' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{sparePartsListings.length} spare part{sparePartsListings.length === 1 ? '' : 's'}</p>
              <button
                type="button"
                onClick={() => fetchSparePartsListings()}
                disabled={sparePartsLoading}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} className={cn(sparePartsLoading && 'animate-spin')} /> Refresh
              </button>
            </div>
            <Button to="/sell/spare-parts" variant="primary" size="sm" icon={Wrench}>
              Sell Spare Part
            </Button>
          </div>

          {sparePartsListings.length === 0 && !sparePartsLoading ? (
            <EmptyState
              icon={Wrench}
              title="No spare parts listed yet"
              description="List batteries, tyres, engine parts or accessories — our team reviews it before it goes live."
              actionLabel="Sell Spare Part"
              actionTo="/sell/spare-parts"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sparePartsListings.map((s) => {
                const spareImage = s.images?.[0]?.imageUrl || s.primaryImage || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=60'
                return (
                  <div key={s.slug || s.id} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={spareImage} alt={s.title} className="h-full w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-bold text-text">{s.title}</p>
                          <Badge variant={LISTING_STATUS_VARIANT[s.status] || 'neutral'}>
                            {LISTING_STATUS_LABEL[s.status] || s.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                          Spare Part · {s.category || 'N/A'} ({s.brand})
                        </p>
                        <p className="mt-1 font-mono text-sm font-extrabold text-text">{formatCurrencyFull(s.price)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/70 p-2.5 font-mono text-[11px] text-text-secondary">
                      <div><span className="text-text-light">Sub:</span> {s.subCategory || 'N/A'}</div>
                      <div><span className="text-text-light">Part #:</span> {s.partNumber || 'N/A'}</div>
                      <div><span className="text-text-light">Cond:</span> {s.condition || 'N/A'}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/sell/spare-parts?mode=edit&slug=${s.slug}`} className="text-xs font-semibold text-primary hover:underline">
                        View details &rarr;
                      </Link>
                      <div className="flex flex-wrap gap-1.5">
                        {s.status === 'DRAFT' && (
                          <Button size="xs" variant="primary" icon={Rocket} onClick={() => {
                            if (window.confirm('Submit this spare part for approval?')) {
                              submitSparePartListing(s.slug)
                            }
                          }}>
                            Submit
                          </Button>
                        )}
                        {s.status !== 'AVAILABLE' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            onClick={() => makeAvailableSparePartListing(s.slug)}
                          >
                            Available
                          </Button>
                        )}
                        {s.status !== 'ARCHIVED' && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white"
                            onClick={() => archiveSparePartListing(s.slug)}
                          >
                            Archive
                          </Button>
                        )}
                        <Button size="xs" variant="outline" icon={Pencil} to={`/sell/spare-parts?mode=edit&slug=${s.slug}`}>
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Trash2}
                          className="text-danger border-danger/20 hover:bg-danger/10"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this spare part listing?')) {
                              deleteSparePartListing(s.slug)
                            }
                          }}
                        >
                          Delete
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

      {tab === 'inquiries' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {userInquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-text">{inquiry.dealer}</p>
                <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>{inquiry.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-text-secondary">Regarding: {inquiry.item}</p>
              <p className="mt-1 font-mono text-[11px] text-text-light">{inquiry.date}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  icon={MessageCircle}
                  onClick={() => {
                    setChatRecipient(inquiry.id)
                    setDashboardChatOpen(true)
                  }}
                >
                  Message Seller
                </Button>
                <Button size="sm" variant="outline" className="flex-1" icon={Eye}>
                  View Listing
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'messages' && (
        <div className="space-y-4">
          {apiConversations.length > 0 && (
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="bg-surface-alt p-3 text-xs font-bold uppercase tracking-wider text-text-secondary">
                Live Conversations ({apiConversations.length})
              </div>
              {apiConversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    selectConversation(c)
                    setDashboardChatOpen(true)
                  }}
                  className="flex cursor-pointer items-start gap-3 p-5 transition-colors hover:bg-surface-alt/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-text">{c.participantTwoRole || 'Seller'}</p>
                      {c.lastMessage?.createdAt && (
                        <span className="font-mono text-xs text-text-light">
                          {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
                      {c.lastMessage?.content || 'Click to open conversation'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {userMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setChatRecipient(msg.id)
                  setDashboardChatOpen(true)
                }}
                className={cn('flex cursor-pointer items-start gap-3 p-5 transition-colors hover:bg-surface-alt/50', msg.unread && 'bg-primary/[0.03]')}
              >
                <img src={msg.avatar} alt={msg.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-text">{msg.name}</p>
                    <span className="font-mono text-xs text-text-light">{msg.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{msg.preview}</p>
                </div>
                {msg.unread && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {tab === 'reviews' && (
        <div className="max-w-4xl">
          <SellerReviewSection sellerId={user?.id || '3fa85f64-5717-4562-b3fc-2c963f66afa6'} sellerName={user?.name || 'Seller'} />
        </div>
      )} */}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold text-text">Edit Vehicle Listing</h2>
              <button type="button" onClick={() => setEditingVehicle(null)} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Dropdown
                label="Brand"
                value={editForm.brand}
                onChange={(v) => setEditForm((prev) => ({ ...prev, brand: v }))}
                options={VEHICLE_BRANDS}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Model (max 100 chars)" maxLength={100} value={editForm.model} onChange={(e) => setEditForm((prev) => ({ ...prev, model: e.target.value }))} />
                <Input label="Variant (max 100 chars)" maxLength={100} value={editForm.variant} onChange={(e) => setEditForm((prev) => ({ ...prev, variant: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Manufacturing Year (1950-2100)" type="number" min="1950" max="2100" value={editForm.year} onChange={(e) => setEditForm((prev) => ({ ...prev, year: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Price (₹)" type="number" min="0" value={editForm.price} onChange={(e) => setEditForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Mileage / Odometer (km)" type="number" min="0" value={editForm.mileage} onChange={(e) => setEditForm((prev) => ({ ...prev, mileage: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Color (max 50 chars)" maxLength={50} value={editForm.color} onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Condition" value={editForm.condition} onChange={(v) => setEditForm((prev) => ({ ...prev, condition: v }))} options={VEHICLE_CONDITIONS} />
                <Dropdown label="Fuel Type" value={editForm.fuelType} onChange={(v) => setEditForm((prev) => ({ ...prev, fuelType: v }))} options={FUEL_TYPES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Transmission" value={editForm.transmissionType} onChange={(v) => setEditForm((prev) => ({ ...prev, transmissionType: v }))} options={TRANSMISSION_TYPES} />
                <Input label="Owners Count (1-10)" type="number" min="1" max="10" value={editForm.ownersCount} onChange={(e) => setEditForm((prev) => ({ ...prev, ownersCount: Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)) }))} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Reg Number (5-20 chars)" maxLength={20} value={editForm.registrationNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, registrationNumber: e.target.value }))} />
                <Input label="Chassis Number (10-50 chars)" maxLength={50} value={editForm.chassisNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, chassisNumber: e.target.value }))} />
                <Input label="VIN (max 100 chars)" maxLength={100} value={editForm.vin} onChange={(e) => setEditForm((prev) => ({ ...prev, vin: e.target.value }))} />
              </div>
              <TextArea label="Description (max 3000 chars)" maxLength={3000} value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setEditingVehicle(null)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={savingEdit} onClick={handleSaveEdit}>
                {savingEdit ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold text-text">Edit Property Listing</h2>
              <button type="button" onClick={() => setEditingProperty(null)} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Title" value={propEditForm.title} onChange={(e) => setPropEditForm((prev) => ({ ...prev, title: e.target.value }))} />
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Property Type" value={propEditForm.propertyType} onChange={(v) => setPropEditForm((prev) => ({ ...prev, propertyType: v }))} options={PROPERTY_TYPES} />
                <Dropdown label="Listing Type" value={propEditForm.listingType} onChange={(v) => setPropEditForm((prev) => ({ ...prev, listingType: v }))} options={LISTING_TYPES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (₹)" type="number" value={propEditForm.price} onChange={(e) => setPropEditForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} />
                <label className="flex items-center gap-2 text-sm text-text self-end pb-2">
                  <input
                    type="checkbox"
                    checked={propEditForm.negotiable}
                    onChange={(e) => setPropEditForm((prev) => ({ ...prev, negotiable: e.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Negotiable
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Bedrooms" type="number" min="0" value={propEditForm.bedrooms} onChange={(e) => setPropEditForm((prev) => ({ ...prev, bedrooms: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Bathrooms" type="number" min="0" value={propEditForm.bathrooms} onChange={(e) => setPropEditForm((prev) => ({ ...prev, bathrooms: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Balconies" type="number" min="0" value={propEditForm.balconies} onChange={(e) => setPropEditForm((prev) => ({ ...prev, balconies: parseInt(e.target.value, 10) || 0 }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Area Unit" value={propEditForm.areaUnit} onChange={(v) => setPropEditForm((prev) => ({ ...prev, areaUnit: v }))} options={AREA_UNITS} />
                <Input label="Built-Up Area" type="number" min="0" step="0.1" value={propEditForm.builtUpArea} onChange={(e) => setPropEditForm((prev) => ({ ...prev, builtUpArea: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Carpet Area" type="number" min="0" step="0.1" value={propEditForm.carpetArea} onChange={(e) => setPropEditForm((prev) => ({ ...prev, carpetArea: parseFloat(e.target.value) || 0 }))} />
                <Input label="Plot Area" type="number" min="0" step="0.1" value={propEditForm.plotArea} onChange={(e) => setPropEditForm((prev) => ({ ...prev, plotArea: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Furnishing" value={propEditForm.furnishingStatus} onChange={(v) => setPropEditForm((prev) => ({ ...prev, furnishingStatus: v }))} options={FURNISHING_STATUSES} />
                <Dropdown label="Construction Status" value={propEditForm.constructionStatus} onChange={(v) => setPropEditForm((prev) => ({ ...prev, constructionStatus: v }))} options={CONSTRUCTION_STATUSES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Facing" value={propEditForm.facing} onChange={(v) => setPropEditForm((prev) => ({ ...prev, facing: v }))} placeholder="Select" options={FACING_OPTIONS} />
                <Input label="Age of Property (years)" type="number" min="0" value={propEditForm.ageOfProperty} onChange={(e) => setPropEditForm((prev) => ({ ...prev, ageOfProperty: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Floor" type="number" min="0" value={propEditForm.floor} onChange={(e) => setPropEditForm((prev) => ({ ...prev, floor: e.target.value }))} />
                <Input label="Total Floors" type="number" min="0" value={propEditForm.totalFloors} onChange={(e) => setPropEditForm((prev) => ({ ...prev, totalFloors: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={propEditForm.city} onChange={(e) => setPropEditForm((prev) => ({ ...prev, city: e.target.value }))} />
                <Input label="Locality" value={propEditForm.locality} onChange={(e) => setPropEditForm((prev) => ({ ...prev, locality: e.target.value }))} />
              </div>
              <Input label="Address" value={propEditForm.address} onChange={(e) => setPropEditForm((prev) => ({ ...prev, address: e.target.value }))} />
              <Input label="Pincode" maxLength={6} value={propEditForm.pincode} onChange={(e) => setPropEditForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} />
              <TextArea label="Description" value={propEditForm.description} onChange={(e) => setPropEditForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setEditingProperty(null)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={savingPropEdit} onClick={handleSavePropEdit}>
                {savingPropEdit ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Property Images Manager Modal */}
      {managingImagesForSlug && (
        <PropertyImagesManager
          slug={managingImagesForSlug}
          onClose={() => {
            setManagingImagesForSlug(null)
            fetchPropertyListings() // refresh listings to pick up new primary images
          }}
        />
      )}

      {/* Vehicle Images Manager Modal */}
      {managingVehicleImagesSlug && (
        <VehicleImagesManager
          slug={managingVehicleImagesSlug}
          onClose={() => {
            setManagingVehicleImagesSlug(null)
            fetchListings() // refresh listings to pick up new vehicle images
          }}
        />
      )}

      {/* Vehicle Documents Manager Modal */}
      {managingVehicleDocsSlug && (
        <VehicleDocumentsManager
          slug={managingVehicleDocsSlug}
          onClose={() => {
            setManagingVehicleDocsSlug(null)
            fetchListings()
          }}
        />
      )}

      {/* Vehicle Features Manager Modal */}
      {managingVehicleFeaturesSlug && (
        <VehicleFeaturesManager
          slug={managingVehicleFeaturesSlug?.slug}
          vehicleType={managingVehicleFeaturesSlug?.vehicleType}
          onClose={() => {
            setManagingVehicleFeaturesSlug(null)
            fetchListings()
          }}
        />
      )}

      {/* Vehicle Specs Manager Modal */}
      {managingVehicleSpecsSlug && (
        <VehicleSpecsManager
          slug={managingVehicleSpecsSlug}
          onClose={() => {
            setManagingVehicleSpecsSlug(null)
            fetchListings()
          }}
        />
      )}

      {/* Global Chat Drawer */}
      <ChatDrawer
        isOpen={dashboardChatOpen}
        onClose={() => setDashboardChatOpen(false)}
        recipientId={chatRecipient}
      />
    </div>
  )
}