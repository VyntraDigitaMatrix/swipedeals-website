import { ListingGridSkeleton } from '../common/SkeletonLoader'
import EmptyState from '../common/EmptyState'

export default function ListingGrid({ items, renderItem, loading = false, emptyProps, columns = 'xl:grid-cols-3' }) {
  if (loading) return <ListingGridSkeleton />
  if (!items || items.length === 0) return <EmptyState {...emptyProps} />

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${columns}`}>
      {items.map((item, i) => renderItem(item, i))}
    </div>
  )
}
