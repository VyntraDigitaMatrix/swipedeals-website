import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  PackageSearch, Phone, MessageSquare, Car, Building2, Laptop, Wrench, RefreshCw,
  Search, ExternalLink, Filter, ChevronLeft, ChevronRight, UserCheck, Clock
} from 'lucide-react'
import Button from '../buttons/Button'
import EmptyState from '../common/EmptyState'
import { useLeads } from '../../hooks/useLeads'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'

const PRODUCT_TYPE_CONFIG = {
  VEHICLE: { label: 'Vehicle', icon: Car, color: 'bg-primary/10 text-primary border-primary/20', path: '/cars/' },
  PROPERTY: { label: 'Property', icon: Building2, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', path: '/properties/' },
  ELECTRONICS: { label: 'Electronics', icon: Laptop, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', path: '/electronics/' },
  SPARE_PART: { label: 'Spare Part', icon: Wrench, color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', path: '/spare-parts/' },
}

export default function UserLeadsSection() {
  const { leads, pagination, loading, error, fetchLeads } = useLeads()
  const [selectedType, setSelectedType] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const filterRailRef = useRef(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)

  useEffect(() => {
    const el = filterRailRef.current
    if (!el) return
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaY * 1.2
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  const handleMouseDown = (e) => {
    if (!filterRailRef.current) return
    setIsMouseDown(true)
    setStartX(e.pageX - filterRailRef.current.offsetLeft)
    setScrollLeftPos(filterRailRef.current.scrollLeft)
  }

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false)
  }

  const handleMouseMove = (e) => {
    if (!isMouseDown || !filterRailRef.current) return
    e.preventDefault()
    const x = e.pageX - filterRailRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    filterRailRef.current.scrollLeft = scrollLeftPos - walk
  }

  const loadData = useCallback(() => {
    const params = {
      page: currentPage,
      size: pageSize,
      sort: 'createdAt,desc',
    }
    if (selectedType !== 'ALL') {
      params.productType = selectedType
    }
    fetchLeads(params).catch(() => { })
  }, [currentPage, pageSize, selectedType, fetchLeads])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFilterTypeChange = (type) => {
    setSelectedType(type)
    setCurrentPage(0)
  }

  // Calculate dynamic counts for each type pill
  const typeCounts = {
    ALL: pagination.totalElements || leads.length,
    VEHICLE: leads.filter((l) => !l.productType || l.productType === 'VEHICLE').length,
    PROPERTY: leads.filter((l) => l.productType === 'PROPERTY').length,
    ELECTRONICS: leads.filter((l) => l.productType === 'ELECTRONICS').length,
    SPARE_PART: leads.filter((l) => l.productType === 'SPARE_PART').length,
  }

  // Filter leads client-side by selectedType and searchQuery
  const filteredLeads = leads.filter((lead) => {
    const matchesType =
      selectedType === 'ALL' ||
      lead.productType === selectedType ||
      (selectedType === 'VEHICLE' && (!lead.productType || lead.productType === 'VEHICLE'))

    if (!matchesType) return false

    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.mobileNumber?.includes(q) ||
      lead.productSlug?.toLowerCase().includes(q) ||
      lead.message?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackageSearch size={20} />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-text">User Leads</h2>
              <p className="text-xs text-text-secondary">
                View and manage lead inquiries submitted by prospective buyers across your product listings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            disabled={loading}
            onClick={loadData}
            className={cn(loading && '[&_svg]:animate-spin')}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Product Type Pills */}
        <div
          ref={filterRailRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={cn(
            'no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 select-none',
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          )}
        >
          <button
            type="button"
            onClick={() => handleFilterTypeChange('ALL')}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
              selectedType === 'ALL'
                ? 'bg-primary text-white shadow-soft'
                : 'border border-border bg-surface text-text-secondary hover:text-text'
            )}
          >
            <Filter size={13} />
            All Leads ({typeCounts.ALL})
          </button>
          {Object.entries(PRODUCT_TYPE_CONFIG).map(([typeKey, config]) => {
            const Icon = config.icon
            const active = selectedType === typeKey
            const count = typeCounts[typeKey] ?? 0
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => handleFilterTypeChange(typeKey)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border',
                  active
                    ? `${config.color} font-bold shadow-soft`
                    : 'border-border bg-surface text-text-secondary hover:text-text'
                )}
              >
                <Icon size={13} />
                {config.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone..."
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-xs text-text placeholder-text-secondary transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-xs font-medium text-danger">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && leads.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-surface-alt" />
                <div className="h-5 w-20 rounded-full bg-surface-alt" />
              </div>
              <div className="h-3 w-36 rounded bg-surface-alt" />
              <div className="h-14 rounded-xl bg-surface-alt" />
              <div className="h-8 rounded-xl bg-surface-alt" />
            </div>
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No leads found"
          description={
            searchQuery
              ? `No lead matches "${searchQuery}". Try clearing your search.`
              : 'No leads have been received yet for your listings.'
          }
        />
      ) : (
        /* Leads Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => {
            const config = PRODUCT_TYPE_CONFIG[lead.productType] || PRODUCT_TYPE_CONFIG.VEHICLE
            const Icon = config.icon
            const productUrl = `${config.path}${lead.productSlug}`
            const leadInitials = (lead.name || 'Lead')
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join('')

            return (
              <div
                key={lead.id || lead.productSlug + lead.createdAt}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div>
                  {/* Top Bar: Lead Badge & Product Type */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-hero font-extrabold text-white text-xs shadow-soft">
                        {leadInitials || <UserCheck size={16} />}
                      </div>
                      <div>
                        <h3 className="line-clamp-1 font-bold text-text text-sm">{lead.name || 'Anonymous Inquiry'}</h3>
                        <a
                          href={`tel:${lead.mobileNumber}`}
                          className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary hover:underline"
                        >
                          <Phone size={12} />
                          {lead.mobileNumber}
                        </a>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        config.color
                      )}
                    >
                      <Icon size={11} />
                      {config.label}
                    </span>
                  </div>

                  {/* Date & Listing Link */}
                  <div className="mt-3.5 space-y-1.5 rounded-xl bg-surface-alt/70 p-3 text-xs">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <Clock size={12} className="text-text-light" />
                        {lead.createdAt ? formatDate(lead.createdAt) : 'Recently'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-medium text-text-light text-[11px]">Intrested in:</span>
                      <Link
                        to={productUrl}
                        className="inline-flex items-center gap-1 font-mono font-semibold text-primary hover:underline text-[11px]"
                      >
                        <span className="max-w-[130px] truncate">{lead.productSlug}</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  {lead.message && (
                    <div className="mt-3 relative rounded-xl border border-border/60 bg-surface-alt/40 p-3 text-xs text-text-secondary leading-relaxed">
                      <div className="flex items-center gap-1 font-bold text-[10px] text-text-light uppercase tracking-wider mb-1">
                        <MessageSquare size={11} />
                        Buyer's Message:
                      </div>
                      <p className="line-clamp-3 text-text italic">"{lead.message}"</p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <a
                    href={`tel:${lead.mobileNumber}`}
                    className="flex-1"
                  >
                    <Button variant="primary" size="xs" fullWidth icon={Phone}>
                      Call Lead
                    </Button>
                  </a>
                  <Link to={productUrl} className="flex-1">
                    <Button variant="outline" size="xs" fullWidth icon={ExternalLink}>
                      View Item
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-text-secondary">
            Page <strong className="text-text">{pagination.number + 1}</strong> of{' '}
            <strong className="text-text">{pagination.totalPages}</strong> ({pagination.totalElements} total leads)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              icon={ChevronLeft}
              disabled={pagination.first || loading}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              icon={ChevronRight}
              disabled={pagination.last || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
