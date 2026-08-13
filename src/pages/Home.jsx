import { Link } from 'react-router-dom'
import { Building2, Crown, Home as HomeIcon, ShieldCheck, Sparkles, TreePine, Warehouse } from 'lucide-react'
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
import PropertySpotlight from '../components/property/PropertySpotlight'
import PropertyRowCard from '../components/property/PropertyRowCard'
import MixedListingCard from '../components/cards/MixedListingCard'

import { cars } from '../data/cars'
import { commercialVehicles } from '../data/commercialVehicles'
import { electronics } from '../data/electronics'
import { properties } from '../data/properties'
import { spareParts } from '../data/spareParts'
import { useListingsStore } from '../hooks/useListingsStore'

const CATEGORY_LABELS = { cars: 'Car', commercial: 'Commercial', electronics: 'Electronics', properties: 'Property', 'spare-parts': 'Spare Part' }

const featuredCars = cars.filter((c) => c.rating >= 4.6).slice(0, 8)
const featuredElectronics = electronics.slice(0, 4)
const featuredProperties = properties.slice(0, 5)
const trendingParts = spareParts
const commercialFeatured = commercialVehicles.slice(0, 6)

const propertyTypeFilters = [
  { label: 'Apartments', icon: Building2, type: 'Apartment' },
  { label: 'Villas', icon: HomeIcon, type: 'Villa' },
  { label: 'Plots', icon: TreePine, type: 'Plot' },
  { label: 'Commercial', icon: Warehouse, type: 'Commercial' },
]

const propertyTrustPoints = [
  { icon: ShieldCheck, label: 'RERA Verified Listings' },
  { icon: Sparkles, label: 'Zero Brokerage' },
]

const latestListings = [
  { ...cars[1], categoryLabel: 'Used Car', detailPath: `/cars/${cars[1].id}` },
  { ...properties[2], categoryLabel: 'Property', detailPath: `/properties/${properties[2].id}` },
  { ...electronics[3], categoryLabel: 'Electronics', detailPath: `/electronics/${electronics[3].id}` },
  { ...cars[6], categoryLabel: 'New Car', detailPath: `/cars/${cars[6].id}` },
  { ...commercialVehicles[3], categoryLabel: 'Commercial', detailPath: `/commercial-vehicles/${commercialVehicles[3].id}` },
  { ...properties[7], categoryLabel: 'Property', detailPath: `/properties/${properties[7].id}` },
  { ...electronics[6], categoryLabel: 'Electronics', detailPath: `/electronics/${electronics[6].id}` },
  { ...spareParts[4], categoryLabel: 'Spare Part', detailPath: `/spare-parts/${spareParts[4].id}` },
]

const premiumListings = [
  { ...cars[4], categoryLabel: 'Luxury Car', detailPath: `/cars/${cars[4].id}` },
  { ...properties[6], categoryLabel: 'Penthouse', detailPath: `/properties/${properties[6].id}` },
  { ...cars[8], categoryLabel: 'Luxury Car', detailPath: `/cars/${cars[8].id}` },
  { ...properties[1], categoryLabel: 'Villa', detailPath: `/properties/${properties[1].id}` },
  { ...cars[0], categoryLabel: 'Luxury Car', detailPath: `/cars/${cars[0].id}` },
  { ...properties[3], categoryLabel: 'Commercial', detailPath: `/properties/${properties[3].id}` },
]

export default function Home() {
  const { approved: approvedUserListings } = useListingsStore()
  const communityListings = approvedUserListings.slice(0, 8).map((l) => ({
    ...l,
    categoryLabel: CATEGORY_LABELS[l.category] || l.category,
    detailPath: `/listing/${l.id}`,
    location: `${l.location}, ${l.city}`,
  }))

  return (
    <>
      <Hero />
      <CategoryGrid />
      <VehicleServices />

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

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Featured"
          title="Hand-picked cars for you"
          description="Top-rated, verified used & new cars from trusted dealers near you."
          action="View All Cars"
          actionTo="/cars"
        />
        <Carousel>
          {featuredCars.map((car, i) => (
            <VehicleCard key={car.id} car={car} index={i} />
          ))}
        </Carousel>
      </section>

      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Latest Tech"
            title="Trending electronics"
            description="Mobiles, laptops, gaming consoles and more from authorized resellers."
            action="View All Electronics"
            actionTo="/electronics"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredElectronics.map((item, i) => (
              <ElectronicsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

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

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Link
                to="/properties"
                className="flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3.5 py-2 text-xs font-semibold text-white"
              >
                All Properties
              </Link>
              {propertyTypeFilters.map((f) => (
                <Link
                  key={f.type}
                  to={`/properties?type=${encodeURIComponent(f.type)}`}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <f.icon size={13} aria-hidden="true" />
                  {f.label}
                </Link>
              ))}
            </div>
            <div className="hidden items-center gap-5 sm:flex">
              {propertyTrustPoints.map((point) => (
                <span key={point.label} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                  <point.icon size={14} className="text-success" aria-hidden="true" />
                  {point.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
            <PropertySpotlight property={featuredProperties[0]} />
            <div className="flex flex-col gap-4">
              {featuredProperties.slice(1, 5).map((property, i) => (
                <PropertyRowCard key={property.id} property={property} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Genuine Parts"
            title="Trending spare parts"
            description="Batteries, tyres, engine kits & accessories at wholesale prices."
            action="Shop Spare Parts"
            actionTo="/spare-parts"
          />
          <Carousel itemClassName="w-[240px] sm:w-[260px]">
            {trendingParts.map((part, i) => (
              <SparePartCard key={part.id} part={part} index={i} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Fleet & Industrial"
          title="Commercial vehicles"
          description="Trucks, buses, tractors and construction equipment for your business."
          action="View All Commercial"
          actionTo="/commercial-vehicles"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {commercialFeatured.map((vehicle, i) => (
            <CommercialVehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      </section>

      <BrandsMarquee />

      <section className="container-page py-16 sm:py-20">
        <SectionHeader eyebrow="Fresh Off the Market" title="Latest listings" description="Newly added across every category — updated daily." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestListings.map((item, i) => (
            <MixedListingCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

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
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {premiumListings.map((item, i) => (
              <MixedListingCard key={item.id} item={item} index={i} />
            ))}
          </div>
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
