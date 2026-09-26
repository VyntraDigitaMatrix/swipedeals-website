import { Heart, Loader2, RefreshCw, AlertCircle, MapPin, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import { useWishlist } from '../hooks/useWishlist'
import { formatCurrency } from '../utils/format'
import { cn } from '../utils/cn'

// ─── Category config ─────────────────────────────────────────────────────────

const PRODUCT_TYPE_META = {
  VEHICLE:     { label: 'Vehicle',     color: 'bg-blue-500/10 text-blue-600',     path: (s) => `/cars/${s}`,        apiKey: 'vehicles' },
  PROPERTY:    { label: 'Property',    color: 'bg-green-500/10 text-green-600',   path: (s) => `/properties/${s}`,  apiKey: 'property' },
  ELECTRONICS: { label: 'Electronics', color: 'bg-purple-500/10 text-purple-600', path: (s) => `/electronics/${s}`, apiKey: 'electronics' },
  SPARE_PARTS: { label: 'Spare Part',  color: 'bg-orange-500/10 text-orange-600', path: (s) => `/spare-parts/${s}`, apiKey: 'spare-parts' },
  SPARE_PART:  { label: 'Spare Part',  color: 'bg-orange-500/10 text-orange-600', path: (s) => `/spare-parts/${s}`, apiKey: 'spare-parts' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveTitle(product, productType) {
  if (product.title) return product.title
  // Vehicles: brand + model + variant + year
  if (['VEHICLE', 'PROPERTY'].includes(productType)) {
    const parts = [product.year, product.brand, product.model, product.variant].filter(Boolean)
    if (parts.length) return parts.join(' ')
  }
  return product.name ?? 'Listing'
}

function resolvePrimaryImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null
  const primary = images.find((img) => img.isPrimary) ?? images[0]
  return primary?.imageUrl ?? primary?.url ?? null
}

// ─── Wishlist item card ──────────────────────────────────────────────────────

function WishlistItemCard({ item, onRemove }) {
  const productType = item.productType ?? 'VEHICLE'
  const product = item.product ?? item
  const meta = PRODUCT_TYPE_META[productType] ?? PRODUCT_TYPE_META.VEHICLE

  const slug = product.slug ?? product.id
  const detailPath = meta.path(slug)
  const title = resolveTitle(product, productType)
  const image = resolvePrimaryImage(product.images) ?? product.imageUrl ?? null
  const location = product.location ?? product.city ?? product.state ?? null
  const price = product.price ?? product.askingPrice ?? null
  const seller = product.seller ?? null

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      {/* Image */}
      <Link to={detailPath} className="relative block aspect-[4/3] overflow-hidden bg-surface-alt">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-alt">
            <Heart size={32} className="text-text-light" aria-hidden="true" />
          </div>
        )}
        {/* Category badge */}
        <span className={cn(
          'absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
          meta.color
        )}>
          {meta.label}
        </span>
        {/* Condition badge for vehicles */}
        {product.condition && (
          <span className="absolute bottom-2.5 left-3 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {product.condition}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link
          to={detailPath}
          className="mb-1 line-clamp-2 text-[15px] font-bold leading-snug text-text hover:text-primary"
        >
          {title}
        </Link>

        {location && (
          <div className="mb-1.5 flex items-center gap-1 text-xs text-text-secondary">
            <MapPin size={11} className="shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        {/* Seller */}
        {seller?.sellerName && (
          <div className="mb-2 flex items-center gap-1 text-[11px] text-text-secondary">
            <span className="line-clamp-1 font-semibold">{seller.sellerName}</span>
            {(seller.sellerType === 'ADMIN' || seller.sellerType === 'DEALER') && (
              <BadgeCheck size={11} className="shrink-0 text-info" aria-hidden="true" />
            )}
          </div>
        )}

        {price != null && (
          <p className="mt-auto pt-3 text-lg font-extrabold text-text">{formatCurrency(price)}</p>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link
            to={detailPath}
            className="flex-1 rounded-lg bg-gradient-primary px-3 py-2.5 text-center text-xs font-bold text-white shadow-soft transition-transform hover:brightness-110"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onRemove(slug, meta.apiKey)}
            aria-label="Remove from wishlist"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-primary transition-colors hover:border-danger/40 hover:bg-danger/5 hover:text-danger"
          >
            <Heart size={15} fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Wishlist() {
  const { items, loading, error, removeFromWishlist, refetch, isAuthenticated } = useWishlist()

  if (!isAuthenticated) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={Heart}
          title="Log in to see your wishlist"
          description="Save your favourite listings and access them from any device."
          actionLabel="Log In / Sign Up"
          actionTo="/login"
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-text sm:text-3xl">
            <Heart size={26} className="text-primary" aria-hidden="true" />
            My Wishlist
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            {loading ? 'Loading…' : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          aria-label="Refresh wishlist"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw size={13} className={cn(loading && 'animate-spin')} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-secondary">
          <Loader2 size={32} className="animate-spin" aria-hidden="true" />
          <p className="text-sm">Loading your wishlist…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <AlertCircle size={32} className="text-danger" aria-hidden="true" />
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart icon on any listing to save it here for later."
          actionLabel="Start Browsing"
          actionTo="/cars"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const product = item.product ?? item
            const slug = product.slug ?? product.id
            return (
              <WishlistItemCard
                key={slug}
                item={item}
                onRemove={removeFromWishlist}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
