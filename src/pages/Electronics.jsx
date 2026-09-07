import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Laptop } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import ElectronicsCard from '../components/electronics/ElectronicsCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { electronicsService, mapElectronicsToCard } from '../services/publicListingService'

const PAGE_SIZE = 8

export default function Electronics() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [electronics, setElectronics] = useState([])
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState({ category: [], brand: [] })
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    electronicsService
      .getAll({ size: 100, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setElectronics(Array.isArray(content) ? content.map(mapElectronicsToCard) : [])
      })
      .catch((err) => {
        console.error('Failed to fetch electronics:', err)
        if (!cancelled) setElectronics([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => [...new Set(electronics.map((e) => e.category))].sort(), [electronics])
  const brands = useMemo(() => [...new Set(electronics.map((e) => e.brand))].sort(), [electronics])

  const toggleValue = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val] }))
    setPage(1)
  }
  const clearAll = () => {
    setValues({ category: [], brand: [] })
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = electronics.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q.toLowerCase())) return false
      if (values.category.length && !values.category.includes(e.category)) return false
      if (values.brand.length && !values.brand.includes(e.brand)) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [electronics, q, values, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Electronics' }]} />

      <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-white sm:text-3xl">
            <Laptop size={28} aria-hidden="true" />
            Electronics
          </h1>
          <p className="mt-1.5 text-sm text-white/75">Mobiles, laptops, gaming, TVs, cameras & home appliances</p>
        </div>
      </div>

      <CommunityListingsStrip category="electronics" />

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
            renderItem={(item, i) => <ElectronicsCard key={item.id} item={item} index={i} />}
            emptyProps={{ icon: Laptop, title: 'No electronics match your filters', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
