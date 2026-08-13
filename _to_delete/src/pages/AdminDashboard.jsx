import { useState } from 'react'
import {
  Briefcase, Building2, Check, Clock, LayoutDashboard, LogIn, Mail, MapPin, Package,
  Phone, ShieldAlert, ShieldCheck, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Badge from '../components/common/Badge'
import Button from '../components/buttons/Button'
import Input from '../components/forms/Input'
import StatCard from '../components/dashboard/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useListingsStore } from '../hooks/useListingsStore'
import { useDealerApplications } from '../hooks/useDealerApplications'
import { DEMO_ADMIN_PROFILE } from '../utils/demoAuth'
import { getPlanById } from '../data/plans'
import { formatCurrencyFull } from '../utils/format'

const CATEGORY_LABELS = { cars: 'Car', commercial: 'Commercial', electronics: 'Electronics', properties: 'Property', 'spare-parts': 'Spare Part' }
const STATUS_VARIANT = { pending: 'warning', approved: 'success', rejected: 'danger' }
const STATUS_FILTERS = ['pending', 'approved', 'rejected']

export default function AdminDashboard() {
  const { user, isAuthenticated, login } = useAuth()

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Admin' }]} />
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldAlert size={28} aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-text">Admin access required</h1>
          <p className="mt-2 text-sm text-text-secondary">
            This dashboard is restricted to SwipeDeals moderators. There&rsquo;s no real backend behind this demo,
            so sign in as the seeded admin account to explore it.
          </p>
          <Button variant="primary" icon={LogIn} className="mt-6" onClick={() => login(DEMO_ADMIN_PROFILE)}>
            Continue as Demo Admin
          </Button>
        </div>
      </div>
    )
  }

  return <ModerationQueue />
}

function ModerationQueue() {
  const { listings, pending, approved, rejected, approveListing, rejectListing } = useListingsStore()
  const { applications, pending: pendingApps, approved: approvedApps, rejected: rejectedApps, approveApplication, rejectApplication } = useDealerApplications()

  const [listingFilter, setListingFilter] = useState('pending')
  const [appFilter, setAppFilter] = useState('pending')
  const [rejectingId, setRejectingId] = useState(null)
  const [reason, setReason] = useState('')

  const filteredListings = listings.filter((l) => l.status === listingFilter)
  const filteredApps = applications.filter((a) => a.status === appFilter)

  const approvedToday = [...approved].filter((l) => l.reviewedAt && new Date(l.reviewedAt).toDateString() === new Date().toDateString()).length

  const confirmReject = (id, type) => {
    if (type === 'listing') rejectListing(id, reason)
    else rejectApplication(id, reason)
    setRejectingId(null)
    setReason('')
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Admin Dashboard' }]} />

      <div className="mb-8">
        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-text sm:text-3xl">
          <LayoutDashboard size={26} className="text-primary" aria-hidden="true" />
          Admin Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">Moderate listing submissions and dealer applications before they go live.</p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Listings" value={pending.length} icon={Clock} index={0} />
        <StatCard label="Pending Dealer Apps" value={pendingApps.length} icon={Briefcase} index={1} />
        <StatCard label="Approved Today" value={approvedToday} icon={Check} index={2} />
        <StatCard label="Active Dealers" value={approvedApps.length} icon={Building2} index={3} />
      </div>

      {/* Listing submissions */}
      <section className="mb-14">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text">
            <Package size={18} aria-hidden="true" /> Listing Submissions
          </h2>
          <div className="flex gap-1.5 rounded-xl bg-surface-alt p-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setListingFilter(s)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  listingFilter === s ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
                }`}
              >
                {s} ({s === 'pending' ? pending.length : s === 'approved' ? approved.length : rejected.length})
              </button>
            ))}
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <EmptyRow text={`No ${listingFilter} listings.`} />
        ) : (
          <div className="space-y-4">
            {filteredListings.map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <div className="flex flex-wrap items-start gap-4">
                  <img src={l.images?.[0]} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover bg-surface-alt" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-text">{l.title}</p>
                      <Badge variant="neutral">{CATEGORY_LABELS[l.category] || l.category}</Badge>
                      <Badge variant={STATUS_VARIANT[l.status]}>{l.status}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-text-secondary">{l.description}</p>
                    <p className="mt-1.5 text-sm font-bold text-text">{formatCurrencyFull(l.price)}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-light">
                      <span className="flex items-center gap-1"><Phone size={11} aria-hidden="true" /> {l.sellerName} &middot; {l.sellerPhone}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} aria-hidden="true" /> {l.location}, {l.city}</span>
                    </div>
                    {l.status === 'rejected' && l.rejectionReason && (
                      <p className="mt-2 text-xs font-medium text-danger">Reason: {l.rejectionReason}</p>
                    )}
                  </div>
                  {l.status === 'pending' && (
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button size="sm" variant="primary" icon={Check} onClick={() => approveListing(l.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" icon={X} onClick={() => setRejectingId(l.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {rejectingId === l.id && (
                  <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row sm:items-center">
                    <Input
                      containerClassName="flex-1"
                      placeholder="Reason for rejection (optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger" onClick={() => confirmReject(l.id, 'listing')}>
                        Confirm Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setReason('') }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dealer applications */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text">
            <Briefcase size={18} aria-hidden="true" /> Dealer Applications
          </h2>
          <div className="flex gap-1.5 rounded-xl bg-surface-alt p-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAppFilter(s)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  appFilter === s ? 'bg-surface text-primary shadow-soft' : 'text-text-secondary hover:text-text'
                }`}
              >
                {s} ({s === 'pending' ? pendingApps.length : s === 'approved' ? approvedApps.length : rejectedApps.length})
              </button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <EmptyRow text={`No ${appFilter} dealer applications.`} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredApps.map((a) => {
              const plan = getPlanById(a.plan)
              return (
                <div key={a.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 font-bold text-text">
                      <Building2 size={15} className="text-primary" aria-hidden="true" /> {a.businessName}
                    </p>
                    <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">Owner: {a.ownerName}</p>
                  <div className="mt-2 space-y-1 text-xs text-text-light">
                    <p className="flex items-center gap-1.5"><Phone size={11} aria-hidden="true" /> {a.phone}</p>
                    <p className="flex items-center gap-1.5"><Mail size={11} aria-hidden="true" /> {a.email}</p>
                    <p className="flex items-center gap-1.5"><MapPin size={11} aria-hidden="true" /> {a.city}</p>
                  </div>
                  {plan && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <ShieldCheck size={12} aria-hidden="true" /> {plan.name} Plan &middot; {formatCurrencyFull(plan.price)}/mo
                    </p>
                  )}
                  {a.status === 'approved' && (
                    <p className="mt-2 font-mono text-xs text-success">swipedeals.com/{a.slug}</p>
                  )}
                  {a.status === 'rejected' && a.rejectionReason && (
                    <p className="mt-2 text-xs font-medium text-danger">Reason: {a.rejectionReason}</p>
                  )}

                  {a.status === 'pending' && (
                    <div className="mt-4 border-t border-border pt-4">
                      {rejectingId === a.id ? (
                        <div className="flex flex-col gap-2.5">
                          <Input placeholder="Reason for rejection (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
                          <div className="flex gap-2">
                            <Button size="sm" variant="danger" onClick={() => confirmReject(a.id, 'application')}>
                              Confirm Reject
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setReason('') }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="primary" icon={Check} onClick={() => approveApplication(a.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" icon={X} onClick={() => setRejectingId(a.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyRow({ text }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/40 py-12 text-center">
      <ShieldCheck size={26} className="mb-3 text-text-light" aria-hidden="true" />
      <p className="text-sm text-text-secondary">{text}</p>
    </div>
  )
}
