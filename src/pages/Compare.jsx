import { useSearchParams } from 'react-router-dom'
import { GitCompare, X } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import Rating from '../components/common/Rating'
import { useCompare } from '../hooks/useCompare'
import { findItemsByIds } from '../utils/findItem'
import { formatCurrencyFull } from '../utils/format'

export default function Compare() {
  const [searchParams] = useSearchParams()
  const { removeFromCompare } = useCompare()
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean)
  const items = findItemsByIds(ids)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Compare' }]} />

      <h1 className="mb-8 flex items-center gap-2.5 text-2xl font-extrabold text-text sm:text-3xl">
        <GitCompare size={26} className="text-primary" aria-hidden="true" />
        Compare Listings
      </h1>

      {items.length === 0 ? (
        <EmptyState icon={GitCompare} title="Nothing to compare yet" description="Add items to compare from any listing card." actionLabel="Browse Cars" actionTo="/cars" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 border-b border-border bg-surface-alt p-4 text-left text-xs font-bold uppercase text-text-secondary">Listing</th>
                {items.map((item) => (
                  <th key={item.id} className="border-b border-l border-border bg-surface-alt p-4 text-left">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => removeFromCompare(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="absolute -right-1 -top-1 rounded-full bg-surface p-1 text-text-light shadow-soft hover:text-danger"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                      <img src={item.images?.[0]} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                      <p className="line-clamp-2 text-sm font-bold text-text">{item.title}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Price" values={items.map((i) => formatCurrencyFull(i.price))} />
              <Row label="Location" values={items.map((i) => i.location)} />
              <Row
                label="Rating"
                values={items.map((i) => i.rating)}
                render={(v) => <Rating value={v} showValue />}
              />
              <Row label="Category" values={items.map((i) => i.category)} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Row({ label, values, render }) {
  return (
    <tr>
      <td className="border-b border-border p-4 text-xs font-bold uppercase text-text-secondary">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="border-b border-l border-border p-4 text-text">
          {render ? render(v) : v}
        </td>
      ))}
    </tr>
  )
}
