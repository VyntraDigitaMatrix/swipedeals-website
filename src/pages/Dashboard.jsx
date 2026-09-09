import { useEffect, useState } from 'react'
import {
  Clock, Eye, Heart, LayoutDashboard, MessageCircle, PackageSearch,
  Pencil, RefreshCw, ShoppingBag, Sparkles, Tags, Trash2, User as UserIcon, X, XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Badge from '../components/common/Badge'
import EmptyState from '../components/common/EmptyState'
import StatCard from '../components/dashboard/StatCard'
import SimpleBarChart from '../components/dashboard/SimpleBarChart'
import SimpleLineChart from '../components/dashboard/SimpleLineChart'
import SavedListingsTable from '../components/dashboard/SavedListingsTable'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import TextArea from '../components/forms/TextArea'
import { useAuth } from '../hooks/useAuth'
import { useWishlist } from '../hooks/useWishlist'
import { useListingsStore } from '../hooks/useListingsStore'
import { useVehicleListings } from '../hooks/useVehicleListings'
import {
  VEHICLE_BRANDS,
  VEHICLE_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
} from '../services/vehicleListingService'
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
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { getByPhone } = useListingsStore()
  const {
    listings: apiListings,
    loading: apiLoading,
    fetchListings,
    updateListing,
    deleteListing,
  } = useVehicleListings()

  const [editingVehicle, setEditingVehicle] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState(null)

  useEffect(() => {
    fetchListings().catch(() => {
      // Ignore API errors gracefully
    })
  }, [fetchListings])

  const savedItems = findItemsByIds(wishlist).map((item) => ({ ...item, categoryLabel: CATEGORY_LABELS[item.category] }))
  const localListings = user?.phone ? getByPhone(user.phone) : []
  const combinedListingsCount = apiListings.length + localListings.length
  const unreadCount = userMessages.filter((m) => m.unread).length
  const initials = (user?.name || 'U').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'listings', label: 'My Listings', icon: Tags, count: combinedListingsCount },
    { id: 'saved', label: 'Saved', icon: Heart, count: savedItems.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: userOrders.length },
    { id: 'inquiries', label: 'Inquiries', icon: PackageSearch, count: userInquiries.length },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: unreadCount },
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
            <StatCard label="Saved Listings" value={savedItems.length} icon={Heart} index={0} accent="primary" />
            <StatCard label="Orders Placed" value={userOrders.length} icon={ShoppingBag} index={1} accent="success" />
            <StatCard label="Inquiries Sent" value={userInquiries.length} icon={PackageSearch} index={2} accent="warning" />
            <StatCard label="Unread Messages" value={unreadCount} icon={MessageCircle} index={3} accent="danger" />
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
                  {apiListings.slice(0, 3).map((v) => (
                    <div key={v.slug} className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        <img src={PLACEHOLDER_IMAGE} alt="" className="h-full w-full object-cover" />
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
                  ))}
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
              {apiListings.map((v) => (
                <div key={v.slug} className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-0.5">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                      <img src={PLACEHOLDER_IMAGE} alt="" className="h-full w-full object-cover" />
                      <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-bold text-text">
                          {titleCaseEnum(v.brand)} {v.model} {v.variant}
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
                    <div className="flex gap-2">
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
              ))}

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

      {tab === 'saved' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-secondary">{savedItems.length} saved listing{savedItems.length === 1 ? '' : 's'}</p>
          </div>
          <SavedListingsTable items={savedItems} onRemove={removeFromWishlist} categoryDot={CATEGORY_DOT} />
        </div>
      )}

      {tab === 'orders' && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
                <th className="p-4">Order ID</th>
                <th className="p-4">Item</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50">
                  <td className="p-4 font-mono text-xs font-semibold text-text">{order.id}</td>
                  <td className="p-4 text-text-secondary">{order.item}</td>
                  <td className="p-4 font-mono font-semibold tabular-nums text-text">{formatCurrencyFull(order.amount)}</td>
                  <td className="p-4">
                    <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="p-4 text-text-secondary">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <Button size="sm" variant="primary" className="flex-1" icon={MessageCircle}>
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
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {userMessages.map((msg) => (
            <div key={msg.id} className={cn('flex items-start gap-3 p-5', msg.unread && 'bg-primary/[0.03]')}>
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
      )}

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
                <Input label="Model" value={editForm.model} onChange={(e) => setEditForm((prev) => ({ ...prev, model: e.target.value }))} />
                <Input label="Variant" value={editForm.variant} onChange={(e) => setEditForm((prev) => ({ ...prev, variant: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Year" type="number" value={editForm.year} onChange={(e) => setEditForm((prev) => ({ ...prev, year: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Price (₹)" type="number" value={editForm.price} onChange={(e) => setEditForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Mileage / Odometer" type="number" value={editForm.mileage} onChange={(e) => setEditForm((prev) => ({ ...prev, mileage: parseInt(e.target.value, 10) || 0 }))} />
                <Input label="Color" value={editForm.color} onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Condition" value={editForm.condition} onChange={(v) => setEditForm((prev) => ({ ...prev, condition: v }))} options={VEHICLE_CONDITIONS} />
                <Dropdown label="Fuel Type" value={editForm.fuelType} onChange={(v) => setEditForm((prev) => ({ ...prev, fuelType: v }))} options={FUEL_TYPES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Dropdown label="Transmission" value={editForm.transmissionType} onChange={(v) => setEditForm((prev) => ({ ...prev, transmissionType: v }))} options={TRANSMISSION_TYPES} />
                <Input label="Owners Count" type="number" value={editForm.ownersCount} onChange={(e) => setEditForm((prev) => ({ ...prev, ownersCount: parseInt(e.target.value, 10) || 1 }))} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Reg Number" value={editForm.registrationNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, registrationNumber: e.target.value }))} />
                <Input label="Chassis Number" value={editForm.chassisNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, chassisNumber: e.target.value }))} />
                <Input label="VIN" value={editForm.vin} onChange={(e) => setEditForm((prev) => ({ ...prev, vin: e.target.value }))} />
              </div>
              <TextArea label="Description" value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} />
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
    </div>
  )
}