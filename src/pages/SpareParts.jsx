import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Settings } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import SparePartCard from '../components/cards/SparePartCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { spareParts, sparePartCategories } from '../data/spareParts'

const PAGE_SIZE = 8
const BRANDS = [...new Set(spareParts.map((s) => s.brand))]

export default function SpareParts() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [values, setValues] = useState({ category: [], brand: [] })
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  const toggleValue = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val] }))
    setPage(1)
  }
  const clearAll = () => {
    setValues({ category: [], brand: [] })
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = spareParts.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q.toLowerCase())) return false
      if (values.category.length && !values.category.includes(s.category)) return false
      if (values.brand.length && !values.brand.includes(s.brand)) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [q, values, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Spare Parts' }]} />

      <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-white sm:text-3xl">
            <Settings size={28} aria-hidden="true" />
            Spare Parts
          </h1>
          <p className="mt-1.5 text-sm text-white/75">Genuine & aftermarket parts for every make and model</p>
        </div>
      </div>

      <CommunityListingsStrip category="spare-parts" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          resultCount={filtered.length}
          values={values}
          onToggle={toggleValue}
          onClear={clearAll}
          groups={[
            { key: 'category', title: 'Category', options: sparePartCategories.map((c) => ({ value: c, label: c })) },
            { key: 'brand', title: 'Brand', options: BRANDS.map((b) => ({ value: b, label: b })) },
          ]}
        />
        <div className="flex-1">
          <ListingToolbar count={filtered.length} sort={sort} onSortChange={setSort} />
          <ListingGrid
            items={pageItems}
            renderItem={(part, i) => <SparePartCard key={part.id} part={part} index={i} />}
            emptyProps={{ icon: Settings, title: 'No spare parts match your filters', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
