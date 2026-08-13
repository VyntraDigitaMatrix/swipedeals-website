import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BadgeCheck, Calendar, LayoutGrid, MapPin, Package, Phone, Star, Store } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import Button from '../components/buttons/Button'
import MixedListingCard from '../components/cards/MixedListingCard'
import { useDealerApplications } from '../hooks/useDealerApplications'
import { getListingsByDealerId, resolveDealerBySlug } from '../utils/dealerListings'

export default function DealerStorefront() {
  const { dealerSlug } = useParams()
  const { approved: approvedApplications } = useDealerApplications()
  const dealer = resolveDealerBySlug(dealerSlug, approvedApplications)
  const [categoryFilter, setCategoryFilter] = useState('all')

  if (!dealer) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Dealer not found" description="This storefront doesn't exist or may have been removed." actionLabel="Back to Home" actionTo="/" />
      </div>
    )
  }

  const listings = getListingsByDealerId(dealer.id)
  const categories = [...new Set(listings.map((l) => l.categoryLabel))]
  const filteredListings = categoryFilter === 'all' ? listings : listings.filter((l) => l.categoryLabel === categoryFilter)

  return (
    <div>
      <div className="relative h-48 overflow-hidden bg-gradient-hero sm:h-64">
        {dealer.banner && <img src={dealer.banner} alt="" className="h-full w-full object-cover opacity-40" />}
      </div>

      <div className="container-page">
        <div className="relative -mt-16 mb-8 flex flex-col items-start gap-5 rounded-2xl border border-border bg-surface p-6 shadow-lift sm:flex-row sm:items-end sm:p-8">
          {dealer.logo ? (
            <img src={dealer.logo} alt={dealer.name} className="h-24 w-24 shrink-0 rounded-2xl border-4 border-surface object-cover shadow-lift" />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-surface bg-primary/10 text-3xl font-black text-primary shadow-lift">
              {dealer.name.charAt(0)}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-text sm:text-2xl">{dealer.name}</h1>
              {dealer.verified && <Badge variant="info" icon={BadgeCheck}>Verified Dealer</Badge>}
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">{dealer.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" /> {dealer.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} aria-hidden="true" /> Since {dealer.since}</span>
              <span className="flex items-center gap-1.5"><Package size={13} aria-hidden="true" /> {listings.length} active listings</span>
              {dealer.reviews > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star size={13} className="fill-warning text-warning" aria-hidden="true" /> {dealer.rating} ({dealer.reviews} reviews)
                </span>
              )}
            </div>
          </div>

          {dealer.phone ? (
            <Button href={`tel:+91${dealer.phone}`} variant="primary" icon={Phone} className="shrink-0">
              Call +91 {dealer.phone}
            </Button>
          ) : (
            <Button variant="primary" icon={Phone} className="shrink-0">
              Contact Dealer
            </Button>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="mb-16 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-alt/40 py-16 text-center">
            <Store size={30} className="mb-4 text-text-light" aria-hidden="true" />
            <p className="font-semibold text-text">No listings published yet</p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              {dealer.name} hasn&rsquo;t added any inventory yet &mdash; check back soon.
            </p>
          </div>
        ) : (
          <div className="mb-16">
            <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  categoryFilter === 'all' ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                <LayoutGrid size={14} aria-hidden="true" /> All ({listings.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    categoryFilter === c ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {c} ({listings.filter((l) => l.categoryLabel === c).length})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredListings.map((item, i) => (
                <MixedListingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
