import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CarFront,
  Crown,
  Laptop,
  Loader2,
  Wrench,
} from 'lucide-react'

import Hero from '../components/hero/Hero'
import CategoryGrid from '../components/hero/CategoryGrid'
import VehicleServices from '../components/common/VehicleServices'
import SectionHeader from '../components/common/SectionHeader'
import Carousel from '../components/common/Carousel'
import Testimonials from '../components/common/Testimonials'
import Statistics from '../components/common/Statistics'
import HowItWorks from '../components/common/HowItWorks'
import AppBanner from '../components/common/AppBanner'
import Newsletter from '../components/common/Newsletter'
import BrandsMarquee from '../components/common/BrandsMarquee'
import VehicleCard from '../components/vehicle/VehicleCard'
import CommercialVehicleCard from '../components/vehicle/CommercialVehicleCard'
import ElectronicsCard from '../components/electronics/ElectronicsCard'
import SparePartCard from '../components/cards/SparePartCard'
import PropertyCard from '../components/property/PropertyCard'
import MixedListingCard from '../components/cards/MixedListingCard'

import {
  vehicleService,
  electronicsService,
  propertyService,
  sparePartsService,
  mapVehicleToCarCard,
  mapVehicleToCommercialCard,
  mapElectronicsToCard,
  mapSparePartToCard,
  mapPropertyToCard,
} from '../services/publicListingService'
import { useListingsStore } from '../hooks/useListingsStore'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/cn'

const CATEGORY_LABELS = {
  cars: 'Car',
  commercial: 'Commercial',
  electronics: 'Electronics',
  properties: 'Property',
  'spare-parts': 'Spare Part',
}

// ── Category-tab browse section ─────────────────────────────────────────────
const BROWSE_TABS = [
  { id: 'vehicles', label: 'Buy Vehicles', icon: CarFront, activeClass: 'bg-primary border-transparent text-white shadow-sm', inactiveClass: 'border-border bg-surface text-text-secondary hover:bg-surface-alt' },
  { id: 'properties', label: 'Properties', icon: Building2, activeClass: 'bg-emerald-600 border-transparent text-white shadow-sm', inactiveClass: 'border-border bg-surface text-text-secondary hover:bg-surface-alt' },
  { id: 'spare-parts', label: 'Spare Parts', icon: Wrench, activeClass: 'bg-amber-600 border-transparent text-white shadow-sm', inactiveClass: 'border-border bg-surface text-text-secondary hover:bg-surface-alt' },
  { id: 'electronics', label: 'Electronics', icon: Laptop, activeClass: 'bg-purple-600 border-transparent text-white shadow-sm', inactiveClass: 'border-border bg-surface text-text-secondary hover:bg-surface-alt' },
]

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  )
}

function EmptyState({ label, to }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-alt py-12 text-center">
      <p className="text-sm font-semibold text-text-secondary">No listings found yet</p>
      <Link to={to} className="text-xs font-bold text-primary hover:underline">Browse {label} →</Link>
    </div>
  )
}

export default function Home() {

  // Community listings (user-submitted)
  const { approved: approvedUserListings } = useListingsStore()
  const communityListings = approvedUserListings.slice(0, 8).map((l) => ({
    ...l,
    categoryLabel: CATEGORY_LABELS[l.category] || l.category,
    detailPath: `/listing/${l.id}`,
    location: `${l.location}, ${l.city}`,
  }))

  // API data state
  const [vehicles, setVehicles] = useState([])
  const [commercial, setCommercial] = useState([])
  const [electronics, setElectronics] = useState([])
  const [spareParts, setSpareParts] = useState([])
  const [properties, setProperties] = useState([])

  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [loadingCommercial, setLoadingCommercial] = useState(true)
  const [loadingElectronics, setLoadingElectronics] = useState(true)
  const [loadingSpareParts, setLoadingSpareParts] = useState(true)
  const [loadingProperties, setLoadingProperties] = useState(true)

  // Browse-tab state
  const [activeTab, setActiveTab] = useState('vehicles')

  useEffect(() => {
    let cancelled = false

    // Cars (CAR type, newest first)
    vehicleService.getAll({ type: 'CAR', size: 12, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setVehicles(Array.isArray(content) ? content.map(mapVehicleToCarCard) : [])
      })
      .catch(() => { if (!cancelled) setVehicles([]) })
      .finally(() => { if (!cancelled) setLoadingVehicles(false) })

    // Commercial vehicles (TRUCK type per CommercialVehicles.jsx)
    vehicleService.getAll({ type: 'TRUCK', size: 6, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setCommercial(Array.isArray(content) ? content.map(mapVehicleToCommercialCard) : [])
      })
      .catch(() => { if (!cancelled) setCommercial([]) })
      .finally(() => { if (!cancelled) setLoadingCommercial(false) })

    // Electronics
    electronicsService.getAll({ size: 8, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setElectronics(Array.isArray(content) ? content.map(mapElectronicsToCard) : [])
      })
      .catch(() => { if (!cancelled) setElectronics([]) })
      .finally(() => { if (!cancelled) setLoadingElectronics(false) })

    // Spare parts
    sparePartsService.getAll({ size: 8, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setSpareParts(Array.isArray(content) ? content.map(mapSparePartToCard) : [])
      })
      .catch(() => { if (!cancelled) setSpareParts([]) })
      .finally(() => { if (!cancelled) setLoadingSpareParts(false) })

    // Properties
    propertyService.getAll({ size: 8, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content
        setProperties(Array.isArray(content) ? content.map(mapPropertyToCard) : [])
      })
      .catch(() => { if (!cancelled) setProperties([]) })
      .finally(() => { if (!cancelled) setLoadingProperties(false) })

    return () => { cancelled = true }
  }, [])

  const tabRoutes = { vehicles: '/cars', properties: '/properties', 'spare-parts': '/spare-parts', electronics: '/electronics' }
  const tabLabels = { vehicles: 'All Vehicles', properties: 'All Properties', 'spare-parts': 'All Spare Parts', electronics: 'All Electronics' }

  const browseLoading = {
    vehicles: loadingVehicles,
    properties: loadingProperties,
    'spare-parts': loadingSpareParts,
    electronics: loadingElectronics,
  }

  const browseData = {
    vehicles: vehicles,
    properties: properties,
    'spare-parts': spareParts,
    electronics: electronics,
  }

  const activeItems = browseData[activeTab] || []
  const activeLoading = browseLoading[activeTab] ?? false

  return (
    <>
      <Hero />
      <CategoryGrid />
      <VehicleServices />

      {/* ── Community Listings ──────────────────────────────────────── */}
      {communityListings.length > 0 && (
        <section className="bg-surface-alt/60 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeader
              eyebrow="Community Marketplace"
              title="Just listed by our sellers"
              description="Fresh, admin-verified listings posted directly by individual sellers across every category."
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {communityListings.map((item, i) => (
                <MixedListingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Browse All Categories (Tabbed) ──────────────────────────── */}
      <section className="container-page py-12 sm:py-16">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-1 inline-block text-[11px] font-bold uppercase tracking-widest text-primary">
              Browse Now
            </span>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">
              Explore all categories
            </h2>
          </div>
          <Link
            to={tabRoutes[activeTab]}
            className="flex w-fit items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            {tabLabels[activeTab]}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tab Pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {BROWSE_TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200',
                  active ? tab.activeClass : tab.inactiveClass
                )}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeLoading ? (
              <SectionLoader />
            ) : activeItems.length === 0 ? (
              <EmptyState label={tabLabels[activeTab]} to={tabRoutes[activeTab]} />
            ) : (
              <>
                {activeTab === 'vehicles' && (
                  <Carousel>
                    {activeItems.map((car, i) => <VehicleCard key={car.id} car={car} index={i} />)}
                  </Carousel>
                )}
                {activeTab === 'properties' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {activeItems.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
                  </div>
                )}
                {activeTab === 'spare-parts' && (
                  <Carousel itemClassName="w-[240px] sm:w-[260px]">
                    {activeItems.map((part, i) => <SparePartCard key={part.id} part={part} index={i} />)}
                  </Carousel>
                )}
                {activeTab === 'electronics' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {activeItems.map((item, i) => <ElectronicsCard key={item.id} item={item} index={i} />)}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        {!activeLoading && activeItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to={tabRoutes[activeTab]}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/5 hover:shadow-md"
            >
              View all {tabLabels[activeTab]}
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* ── Featured Cars ───────────────────────────────────────────── */}
      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Featured"
            title="Hand-picked cars for you"
            description="Top-rated, verified used & new cars from trusted dealers near you."
            action="View All Cars"
            actionTo="/cars"
          />
          {loadingVehicles ? (
            <SectionLoader />
          ) : vehicles.length === 0 ? (
            <EmptyState label="Cars" to="/cars" />
          ) : (
            <Carousel>
              {vehicles.map((car, i) => (
                <VehicleCard key={car.id} car={car} index={i} />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* ── Electronics ─────────────────────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Latest Tech"
          title="Trending electronics"
          description="Mobiles, laptops, gaming consoles and more from authorized resellers."
          action="View All Electronics"
          actionTo="/electronics"
        />
        {loadingElectronics ? (
          <SectionLoader />
        ) : electronics.length === 0 ? (
          <EmptyState label="Electronics" to="/electronics" />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {electronics.slice(0, 4).map((item, i) => (
              <ElectronicsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Properties ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeader
            eyebrow="Real Estate"
            title="Find your dream property"
            description="Apartments, villas, plots and commercial spaces across India's top cities."
            action="View All Properties"
            actionTo="/properties"
          />
          {loadingProperties ? (
            <SectionLoader />
          ) : properties.length === 0 ? (
            <EmptyState label="Properties" to="/properties" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {properties.slice(0, 4).map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Spare Parts ─────────────────────────────────────────────── */}
      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Genuine Parts"
            title="Trending spare parts"
            description="Batteries, tyres, engine kits & accessories at wholesale prices."
            action="Shop Spare Parts"
            actionTo="/spare-parts"
          />
          {loadingSpareParts ? (
            <SectionLoader />
          ) : spareParts.length === 0 ? (
            <EmptyState label="Spare Parts" to="/spare-parts" />
          ) : (
            <Carousel itemClassName="w-[240px] sm:w-[260px]">
              {spareParts.map((part, i) => (
                <SparePartCard key={part.id} part={part} index={i} />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* ── Commercial Vehicles ─────────────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Fleet & Industrial"
          title="Commercial vehicles"
          description="Trucks, buses, tractors and construction equipment for your business."
          action="View All Commercial"
          actionTo="/commercial-vehicles"
        />
        {loadingCommercial ? (
          <SectionLoader />
        ) : commercial.length === 0 ? (
          <EmptyState label="Commercial Vehicles" to="/commercial-vehicles" />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commercial.map((vehicle, i) => (
              <CommercialVehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        )}
      </section>

      <BrandsMarquee />

      {/* ── Premium Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-text py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
        <div className="container-page relative">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-warning">
                <Crown size={14} aria-hidden="true" /> Premium Selection
              </span>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">Exclusive premium listings</h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 sm:text-base">
                Curated luxury cars, villas and penthouses for buyers who expect nothing but the best.
              </p>
            </div>
            <Link to="/cars" className="flex w-fit items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          {loadingVehicles && loadingProperties ? (
            <SectionLoader />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ...vehicles.slice(0, 3).map((v) => ({
                  ...v,
                  categoryLabel: 'Featured Vehicle',
                  detailPath: `/cars/${v.id}`,
                  location: v.location || 'India',
                })),
                ...properties.slice(0, 3).map((p) => ({
                  ...p,
                  categoryLabel: p.purpose ? `${p.purpose} · ${p.type || 'Property'}` : 'Property',
                  detailPath: `/properties/${p.id}`,
                })),
              ].map((item, i) => (
                <MixedListingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <Statistics />
      <HowItWorks />
      <AppBanner />
      <Newsletter />
    </>
  )
}
