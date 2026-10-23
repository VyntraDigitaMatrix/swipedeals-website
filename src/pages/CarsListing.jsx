import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { CarFront } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import FilterSidebar from '../components/filters/FilterSidebar'
import ListingToolbar from '../components/filters/ListingToolbar'
import ListingGrid from '../components/listing/ListingGrid'
import Pagination from '../components/common/Pagination'
import VehicleCard from '../components/vehicle/VehicleCard'
import CommunityListingsStrip from '../components/common/CommunityListingsStrip'
import { vehicleService, mapVehicleToCarCard } from '../services/publicListingService'
import { cn } from '../utils/cn'

const PAGE_SIZE = 9

const PRICE_PRESETS = [
  { label: 'Under ₹5L', value: [0, 500000] },
  { label: '₹5L – 10L', value: [500000, 1000000] },
  { label: '₹10L – 20L', value: [1000000, 2000000] },
  { label: '₹20L – 40L', value: [2000000, 4000000] },
  { label: '₹40L+', value: [4000000, 8000000] },
]

export default function CarsListing() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const routeType = location.pathname.endsWith('/used') ? 'used' : location.pathname.endsWith('/new') ? 'new' : null

  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState({ brand: [], fuel: [], transmission: [], condition: [] })
  const [priceRange, setPriceRange] = useState([0, 8000000])
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)

  // Server-side filter: vehicle category is always CAR on this page; the
  // new/used route (or the "condition" facet below, when unrouted) is the
  // only other dimension the backend filters by — everything else (brand,
  // fuel, transmission, price) is applied client-side on the fetched page.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    vehicleService
      .getAll({ vehicleType: 'CARS', condition: routeType ? routeType.toUpperCase() : undefined, size: 100, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setCars(Array.isArray(content) ? content.map(mapVehicleToCarCard) : [])
      })
      .catch((err) => {
        console.error('Failed to fetch cars:', err)
        if (!cancelled) setCars([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [routeType])

  const carBrands = useMemo(() => [...new Set(cars.map((c) => c.brand))].sort(), [cars])
  const FUEL_TYPES = useMemo(() => [...new Set(cars.map((c) => c.fuel))], [cars])
  const TRANSMISSIONS = useMemo(() => [...new Set(cars.map((c) => c.transmission))], [cars])

  const toggleValue = (key, val) => {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val],
    }))
    setPage(1)
  }

  const clearAll = () => {
    setValues({ brand: [], fuel: [], transmission: [], condition: [] })
    setPriceRange([0, 8000000])
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = cars.filter((c) => {
      if (routeType && c.condition !== routeType) return false
      if (!routeType && values.condition.length && !values.condition.includes(c.condition)) return false
      if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false
      if (values.brand.length && !values.brand.includes(c.brand)) return false
      if (values.fuel.length && !values.fuel.includes(c.fuel)) return false
      if (values.transmission.length && !values.transmission.includes(c.transmission)) return false
      if (c.price < priceRange[0] || c.price > priceRange[1]) return false
      return true
    })

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'newest') list = [...list].sort((a, b) => b.year - a.year)

    return list
  }, [cars, routeType, q, values, priceRange, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const pageTitle = routeType === 'used' ? 'Used Cars' : routeType === 'new' ? 'New Cars' : 'All Cars'

  const filterGroups = [
    { key: 'brand', title: 'Brand', options: carBrands.map((b) => ({ value: b, label: b, count: cars.filter((c) => c.brand === b).length })) },
    { key: 'fuel', title: 'Fuel Type', options: FUEL_TYPES.map((f) => ({ value: f, label: f })) },
    { key: 'transmission', title: 'Transmission', options: TRANSMISSIONS.map((t) => ({ value: t, label: t })) },
    ...(!routeType
      ? [{ key: 'condition', title: 'Condition', options: [{ value: 'new', label: 'New' }, { value: 'used', label: 'Used' }] }]
      : []),
  ]

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Cars', to: '/cars' }, ...(routeType ? [{ label: pageTitle }] : [])]} />

      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-hero p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-white sm:text-3xl">
            <CarFront size={28} aria-hidden="true" />
            {pageTitle}
          </h1>
          <p className="mt-1.5 text-sm text-white/75">{filtered.length} listings from the SwipeDeals marketplace</p>
        </div>

        <div className="flex shrink-0 gap-1.5 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm">
          {[
            { label: 'All Cars', to: '/cars' },
            { label: 'New Cars', to: '/cars/new' },
            { label: 'Used Cars', to: '/cars/used' },
          ].map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-white text-primary shadow-soft' : 'text-white/80 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <CommunityListingsStrip category="cars" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          resultCount={filtered.length}
          values={values}
          onToggle={toggleValue}
          onClear={clearAll}
          priceRange={{
            min: 0,
            max: 8000000,
            value: priceRange,
            onChange: (v) => { setPriceRange(v); setPage(1) },
            presets: PRICE_PRESETS,
          }}
          groups={filterGroups}
        />

        <div className="flex-1">
          <ListingToolbar count={filtered.length} sort={sort} onSortChange={setSort} />
          <ListingGrid
            items={pageItems}
            loading={loading}
            renderItem={(car, i) => <VehicleCard key={car.id} car={car} index={i} />}
            emptyProps={{ icon: CarFront, title: 'No cars match your filters', description: 'Try adjusting your filters or search terms.', actionLabel: 'Reset Filters', onAction: clearAll }}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
