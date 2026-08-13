import { LayoutGrid, List } from 'lucide-react'
import Dropdown from '../forms/Dropdown'
import { cn } from '../../utils/cn'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
]

export default function ListingToolbar({ count, sort, onSortChange, view, onViewChange }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-text-secondary">
        <span className="font-bold text-text">{count}</span> results found
      </p>

      <div className="flex items-center gap-3">
        {view !== undefined && onViewChange && (
          <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              className={cn('rounded-md p-1.5', view === 'grid' ? 'bg-primary text-white' : 'text-text-secondary')}
            >
              <LayoutGrid size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              className={cn('rounded-md p-1.5', view === 'list' ? 'bg-primary text-white' : 'text-text-secondary')}
            >
              <List size={15} aria-hidden="true" />
            </button>
          </div>
        )}
        <Dropdown value={sort} onChange={onSortChange} options={SORT_OPTIONS} placeholder="Sort by" className="w-48" />
      </div>
    </div>
  )
}
