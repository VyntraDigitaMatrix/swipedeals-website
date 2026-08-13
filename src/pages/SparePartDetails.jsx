import { useParams } from 'react-router-dom'
import { BadgeCheck, Package, Tag as TagIcon, Wrench } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import SparePartCard from '../components/cards/SparePartCard'
import EmptyState from '../components/common/EmptyState'
import { spareParts, getSparePartById } from '../data/spareParts'
import { formatCurrencyFull } from '../utils/format'

export default function SparePartDetails() {
  const { id } = useParams()
  const part = getSparePartById(id)

  if (!part) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Part not found" description="This listing may have been sold or removed." actionLabel="Browse Spare Parts" actionTo="/spare-parts" />
      </div>
    )
  }

  const discount = part.originalPrice ? Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100) : 0
  const similar = spareParts.filter((s) => s.id !== part.id && s.category === part.category).slice(0, 6)

  return (
    <DetailLayout
      item={part}
      breadcrumbLabel="Spare Parts"
      breadcrumbTo="/spare-parts"
      badges={[
        { label: part.category, variant: 'neutral', icon: Wrench },
        ...(discount > 0 ? [{ label: `${discount}% OFF`, variant: 'danger', icon: TagIcon }] : []),
        ...(part.verified ? [{ label: 'Verified', variant: 'info', icon: BadgeCheck }] : []),
      ]}
      specs={[
        { label: 'Brand', value: part.brand, icon: Package },
        { label: 'Category', value: part.category, icon: Wrench },
        { label: 'Condition', value: part.condition === 'new' ? 'New' : 'Used' },
      ]}
      description={`Genuine ${part.brand} ${part.title} sourced directly from authorized distributors. Comes with manufacturer warranty and fitment guidance from our verified spare parts dealer.`}
      priceBlock={
        <div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(part.price)}</p>
            {part.originalPrice && <p className="text-sm text-text-light line-through">{formatCurrencyFull(part.originalPrice)}</p>}
          </div>
          {discount > 0 && <p className="mt-1 text-sm font-semibold text-success">You save {discount}%</p>}
        </div>
      }
      similar={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((s, i) => (
            <SparePartCard key={s.id} part={s} index={i} />
          ))}
        </div>
      }
    />
  )
}
