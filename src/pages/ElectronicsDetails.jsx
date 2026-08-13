import { useParams } from 'react-router-dom'
import { BadgeCheck, Package, ShieldCheck, Tag as TagIcon } from 'lucide-react'
import DetailLayout from '../components/listing/DetailLayout'
import ElectronicsCard from '../components/electronics/ElectronicsCard'
import EmptyState from '../components/common/EmptyState'
import { electronics, getElectronicsById } from '../data/electronics'
import { formatCurrencyFull } from '../utils/format'

export default function ElectronicsDetails() {
  const { id } = useParams()
  const item = getElectronicsById(id)

  if (!item) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Product not found" description="This listing may have been sold or removed." actionLabel="Browse Electronics" actionTo="/electronics" />
      </div>
    )
  }

  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0
  const similar = electronics.filter((e) => e.id !== item.id && e.category === item.category).slice(0, 6)

  return (
    <DetailLayout
      item={item}
      breadcrumbLabel="Electronics"
      breadcrumbTo="/electronics"
      badges={[
        { label: item.category, variant: 'neutral' },
        ...(discount > 0 ? [{ label: `${discount}% OFF`, variant: 'danger', icon: TagIcon }] : []),
        ...(item.verified ? [{ label: 'Verified Seller', variant: 'info', icon: BadgeCheck }] : []),
      ]}
      specs={[
        { label: 'Brand', value: item.brand, icon: Package },
        { label: 'Category', value: item.category },
        { label: 'Condition', value: item.condition === 'new' ? 'New (Sealed)' : 'Used', icon: ShieldCheck },
        { label: 'Warranty', value: '1 Year Brand Warranty' },
      ]}
      description={`Brand new ${item.title}, backed by manufacturer warranty and sold by an authorized SwipeDeals electronics dealer. Enjoy secure payment and doorstep delivery on every order.`}
      priceBlock={
        <div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-extrabold text-text">{formatCurrencyFull(item.price)}</p>
            {item.originalPrice && <p className="text-sm text-text-light line-through">{formatCurrencyFull(item.originalPrice)}</p>}
          </div>
          {discount > 0 && <p className="mt-1 text-sm font-semibold text-success">You save {discount}%</p>}
        </div>
      }
      similar={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((e, i) => (
            <ElectronicsCard key={e.id} item={e} index={i} />
          ))}
        </div>
      }
    />
  )
}
