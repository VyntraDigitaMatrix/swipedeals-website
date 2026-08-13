import { Heart } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import MixedListingCard from '../components/cards/MixedListingCard'
import { useWishlist } from '../hooks/useWishlist'
import { findItemsByIds } from '../utils/findItem'

const CATEGORY_LABELS = {
  cars: 'Car',
  commercial: 'Commercial',
  electronics: 'Electronics',
  properties: 'Property',
  'spare-parts': 'Spare Part',
}

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const items = findItemsByIds(wishlist).map((item) => ({ ...item, categoryLabel: CATEGORY_LABELS[item.category] }))

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="mb-8">
        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-text sm:text-3xl">
          <Heart size={26} className="text-primary" aria-hidden="true" />
          My Wishlist
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart icon on any listing to save it here for later."
          actionLabel="Start Browsing"
          actionTo="/cars"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <MixedListingCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
