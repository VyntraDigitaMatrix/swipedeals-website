import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import PropertyCard from '../components/property/PropertyCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { properties, propertyTypes } from '../data/properties'

const PAGE_SIZE = 8

export default function Properties() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [values, setValues] = useState(() => ({
    type: propertyTypes.includes(searchParams.get('type')) ? [searchParams.get('type')] : [],
    purpose: ['Buy', 'Rent'].includes(searchParams.get('purpose')) ? [searchParams.get('purpose')] : [],
  }))
  const [priceRange, setPriceRange] = useState([0, 55000000])
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  const toggleValue = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val] }))
    setPage(1)
  }
  const clearAll = () => {
    setValues({ type: [], purpose: [] })
    setPriceRange([0, 55000000])
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false
      if (values.type.length && !values.type.includes(p.type)) return false
      if (values.purpose.length && !values.purpose.includes(p.purpose)) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [q, values, priceRange, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Properties' }]} />

      <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-white sm:text-3xl">
            <HomeIcon size={28} aria-hidden="true" />
            Properties
          </h1>
          <p className="mt-1.5 text-sm text-white/75">Apartments, villas, plots & commercial spaces to buy or rent</p>
        </div>
      </div>

      <CommunityListingsStrip category="properties" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          resultCount={filtered.length}
          values={values}
          onToggle={toggleValue}
          onClear={clearAll}
          priceRange={{ min: 0, max: 55000000, value: priceRange, onChange: (v) => { setPriceRange(v); setPage(1) } }}
          groups={[
            { key: 'purpose', title: 'Purpose', options: [{ value: 'Buy', label: 'Buy' }, { value: 'Rent', label: 'Rent' }] },
            { key: 'type', title: 'Property Type', options: propertyTypes.map((t) => ({ value: t, label: t })) },
          ]}
        />
        <div className="flex-1">
          <ListingToolbar count={filtered.length} sort={sort} onSortChange={setSort} />
          <ListingGrid
            items={pageItems}
            renderItem={(p, i) => <PropertyCard key={p.id} property={p} index={i} />}
            emptyProps={{ icon: HomeIcon, title: 'No properties match your filters', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
