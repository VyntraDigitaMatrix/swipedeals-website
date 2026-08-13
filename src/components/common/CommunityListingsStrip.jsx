import { Users } from 'lucide-react'
import Carousel from './Carousel'
import MixedListingCard from '../cards/MixedListingCard'
import { useListingsStore } from '../../hooks/useListingsStore'

const CATEGORY_LABELS = { cars: 'Car', commercial: 'Commercial', electronics: 'Electronics', properties: 'Property', 'spare-parts': 'Spare Part' }

/** Shows admin-approved listings posted directly by individual sellers for a given category. Renders nothing if there are none yet. */
export default function CommunityListingsStrip({ category }) {
  const { getApprovedByCategory } = useListingsStore()
  const listings = getApprovedByCategory(category).map((l) => ({
    ...l,
    categoryLabel: CATEGORY_LABELS[l.category] || l.category,
    detailPath: `/listing/${l.id}`,
    location: `${l.location}, ${l.city}`,
  }))

  if (listings.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-text">
        <Users size={17} className="text-primary" aria-hidden="true" />
        Listed by individual sellers
      </h2>
      <Carousel>
        {listings.map((item, i) => (
          <MixedListingCard key={item.id} item={item} index={i} />
        ))}
      </Carousel>
    </div>
  )
}
