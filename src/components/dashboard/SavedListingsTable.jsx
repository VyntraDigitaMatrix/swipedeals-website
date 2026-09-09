import { Link } from 'react-router-dom'
import { Eye, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatCurrencyFull } from '../../utils/format'

/** Table of the buyer's saved (wishlisted) listings across every category. */
export default function SavedListingsTable({ items, onRemove, categoryDot }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-alt/40 p-10 text-center">
        <p className="text-sm font-semibold text-text">No saved listings yet</p>
        <p className="mt-1 text-xs text-text-secondary">Tap the heart icon on any listing to save it here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-alt text-left text-xs font-bold uppercase tracking-wide text-text-secondary">
            <th className="p-4">Listing</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="group border-b border-border last:border-b-0 hover:bg-surface-alt/50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={item.images?.[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <span className="line-clamp-1 max-w-[220px] font-semibold text-text">{item.title}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                  <span className={cn('h-1.5 w-1.5 rounded-full', categoryDot?.[item.category] || 'bg-primary')} aria-hidden="true" />
                  {item.categoryLabel}
                </span>
              </td>
              <td className="p-4 font-mono font-semibold tabular-nums text-text">{formatCurrencyFull(item.price)}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-1 text-text-secondary opacity-70 transition-opacity group-hover:opacity-100">
                  <Link to={item.detailPath} aria-label="View listing" className="rounded-lg p-1.5 hover:bg-surface-alt hover:text-primary">
                    <Eye size={15} aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove from saved"
                    className="rounded-lg p-1.5 hover:bg-surface-alt hover:text-danger"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}