import { useState } from 'react'
import {
  Clock, Eye, Heart, LayoutDashboard, MessageCircle, PackageSearch,
  ShoppingBag, Sparkles, Tags, User as UserIcon, XCircle,
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
import { useAuth } from '../hooks/useAuth'
import { useWishlist } from '../hooks/useWishlist'
import { useListingsStore } from '../hooks/useListingsStore'
import { findItemsByIds } from '../utils/findItem'
import { cn } from '../utils/cn'
import { formatCurrencyFull } from '../utils/format'
import { browsingActivity, inquiriesByWeek, userOrders, userInquiries, userMessages } from '../data/dashboard'

const LISTING_STATUS_VARIANT = { pending: 'warning', approved: 'success', rejected: 'danger' }
const LISTING_STATUS_LABEL = { pending: 'Under Review', approved: 'Live', rejected: 'Rejected' }

const CATEGORY_LABELS = {
  cars: 'Car',
  commercial: 'Commercial',
  electronics: 'Electronics',
  properties: 'Property',
  'spare-parts': 'Spare Part',
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'listings', label: 'My Listings', icon: Tags },
  { id: 'saved', label: 'Saved Listings', icon: Heart },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'inquiries', label: 'Inquiries', icon: PackageSearch },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
]

const ORDER_STATUS_VARIANT = { Delivered: 'success', Shipped: 'info', Processing: 'warning', Cancelled: 'danger' }
const INQUIRY_STATUS_VARIANT = { Responded: 'success', Pending: 'warning', Closed: 'neutral' }

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { getByPhone } = useListingsStore()

  const savedItems = findItemsByIds(wishlist).map((item) => ({ ...item, categoryLabel: CATEGORY_LABELS[item.category] }))
  const myListings = user?.phone ? getByPhone(user.phone) : []

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'My Dashboard' }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text sm:text-3xl">My Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">Welcome back, {user?.name || 'there'} 👋</p>
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

      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text'
            )}
          >
            <t.icon size={16} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Saved Listings" value={savedItems.length} icon={Heart} index={0} />
            <StatCard label="Orders Placed" value={userOrders.length} icon={ShoppingBag} index={1} />
            <StatCard label="Inquiries Sent" value={userInquiries.length} icon={PackageSearch} index={2} />
            <StatCard label="Unread Messages" value={userMessages.filter((m) => m.unread).length} icon={MessageCircle} index={3} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SimpleLineChart data={browsingActivity} title="Listings Viewed (Last 7 Months)" />
            <SimpleBarChart data={inquiriesByWeek} title="Inquiries Sent This Week" />
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-text">Recently Saved</h2>
            <SavedListingsTable items={savedItems.slice(0, 5)} onRemove={removeFromWishlist} />
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">{myListings.length} listing{myListings.length === 1 ? '' : 's'} submitted</p>
            <Button to="/sell" variant="primary" size="sm">
              Submit New Listing
            </Button>
          </div>

          {myListings.length === 0 ? (
            <EmptyState
              icon={Tags}
              title="No listings submitted yet"
              description="List your car, property or any item for free — our team reviews it before it goes live."
              actionLabel="Sell Something"
              actionTo="/sell"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {myListings.map((listing) => (
                <div key={listing.id} className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                  <img src={listing.images?.[0]} alt={listing.title} className="h-20 w-24 shrink-0 rounded-xl object-cover bg-surface-alt" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-bold text-text">{listing.title}</p>
                      <Badge variant={LISTING_STATUS_VARIANT[listing.status]}>{LISTING_STATUS_LABEL[listing.status]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{CATEGORY_LABELS[listing.category] || listing.category}</p>
                    <p className="mt-1 text-sm font-extrabold text-text">{formatCurrencyFull(listing.price)}</p>

                    {listing.status === 'pending' && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-warning">
                        <Clock size={12} aria-hidden="true" /> Awaiting admin review
                      </p>
                    )}
                    {listing.status === 'rejected' && listing.rejectionReason && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
                        <XCircle size={12} className="shrink-0" aria-hidden="true" /> {listing.rejectionReason}
                      </p>
                    )}
                    {listing.status === 'approved' && (
                      <Link to={`/listing/${listing.id}`} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
                        View live listing &rarr;
                      </Link>
                    )}
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
          <SavedListingsTable items={savedItems} onRemove={removeFromWishlist} />
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
                  <td className="p-4 font-semibold text-text">{order.id}</td>
                  <td className="p-4 text-text-secondary">{order.item}</td>
                  <td className="p-4 font-semibold text-text">{formatCurrencyFull(order.amount)}</td>
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
            <div key={inquiry.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-bold text-text">{inquiry.dealer}</p>
                <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>{inquiry.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-text-secondary">Regarding: {inquiry.item}</p>
              <p className="mt-1 text-xs text-text-light">{inquiry.date}</p>
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
            <div key={msg.id} className="flex items-start gap-3 p-5">
              <img src={msg.avatar} alt={msg.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-text">{msg.name}</p>
                  <span className="text-xs text-text-light">{msg.time}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{msg.preview}</p>
              </div>
              {msg.unread && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
