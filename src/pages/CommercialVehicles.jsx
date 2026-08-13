import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Truck } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import CommercialVehicleCard from '../components/vehicle/CommercialVehicleCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { commercialVehicles } from '../data/commercialVehicles'

const PAGE_SIZE = 9
const TYPES = [...new Set(commercialVehicles.map((v) => v.type))]

export default function CommercialVehicles() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [values, setValues] = useState({ type: [], condition: [] })
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  const toggleValue = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val] }))
    setPage(1)
  }
  const clearAll = () => {
    setValues({ type: [], condition: [] })
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = commercialVehicles.filter((v) => {
      if (q && !v.title.toLowerCase().includes(q.toLowerCase())) return false
      if (values.type.length && !values.type.includes(v.type)) return false
      if (values.condition.length && !values.condition.includes(v.condition)) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') list = [...list].sort((a, b) => b.year - a.year)
    return list
  }, [q, values, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Commercial Vehicles' }]} />

      <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-white sm:text-3xl">
            <Truck size={28} aria-hidden="true" />
            Commercial Vehicles
          </h1>
          <p className="mt-1.5 text-sm text-white/75">Trucks, buses, tractors & construction equipment for your business</p>
        </div>
      </div>

      <CommunityListingsStrip category="commercial" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          resultCount={filtered.length}
          values={values}
          onToggle={toggleValue}
          onClear={clearAll}
          groups={[
            { key: 'type', title: 'Vehicle Type', options: TYPES.map((t) => ({ value: t, label: t })) },
            { key: 'condition', title: 'Condition', options: [{ value: 'new', label: 'New' }, { value: 'used', label: 'Used' }] },
          ]}
        />
        <div className="flex-1">
          <ListingToolbar count={filtered.length} sort={sort} onSortChange={setSort} />
          <ListingGrid
            items={pageItems}
            renderItem={(v, i) => <CommercialVehicleCard key={v.id} vehicle={v} index={i} />}
            emptyProps={{ icon: Truck, title: 'No vehicles match your filters', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
