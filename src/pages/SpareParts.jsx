import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Settings } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import SparePartCard from '../components/cards/SparePartCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { sparePartsService, mapSparePartToCard } from '../services/publicListingService'

const PAGE_SIZE = 9

export default function SpareParts() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [spareParts, setSpareParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState({ category: [], brand: [] })
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    sparePartsService
      .getAll({ size: 100, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSpareParts(Array.isArray(content) ? content.map(mapSparePartToCard) : [])
      })
      .catch((err) => {
        console.error('Failed to fetch spare parts:', err)
        if (!cancelled) setSpareParts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => [...new Set(spareParts.map((s) => s.category))].sort(), [spareParts])
  const brands = useMemo(() => [...new Set(spareParts.map((s) => s.brand))].sort(), [spareParts])

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
    return list
  }, [spareParts, q, values, sort])

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
            { key: 'category', title: 'Category', options: categories.map((c) => ({ value: c, label: c })) },
            { key: 'brand', title: 'Brand', options: brands.map((b) => ({ value: b, label: b })) },
          ]}
        />
        <div className="flex-1">
          <ListingToolbar count={filtered.length} sort={sort} onSortChange={setSort} />
          <ListingGrid
            items={pageItems}
            loading={loading}
            renderItem={(part, i) => <SparePartCard key={part.id} part={part} index={i} />}
            emptyProps={{ icon: Settings, title: 'No spare parts match your filters', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
