import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react'
import { vehicleService, mapVehicleToCarCard } from '../../services/publicListingService'
import { useWishlist } from '../../hooks/useWishlist'

import swiftImg from '../../assets/featured-cars/swift.png'
import cretaImg from '../../assets/featured-cars/creta.png'
import nexonImg from '../../assets/featured-cars/nexon.png'
import hectorImg from '../../assets/featured-cars/hector.png'

const DEFAULT_FEATURED_CARS = [
  {
    id: 'demo-1',
    slug: 'maruti-suzuki-swift-2020',
    title: 'Maruti Suzuki Swift 2020',
    price: 580000,
    km: 45000,
    fuel: 'Petrol',
    location: 'Hyderabad',
    image: swiftImg,
  },
  {
    id: 'demo-2',
    slug: 'hyundai-creta-2022',
    title: 'Hyundai Creta 2022',
    price: 920000,
    km: 32000,
    fuel: 'Diesel',
    location: 'Hyderabad',
    image: cretaImg,
  },
  {
    id: 'demo-3',
    slug: 'tata-nexon-2023',
    title: 'Tata Nexon 2023',
    price: 1275000,
    km: 18000,
    fuel: 'Petrol',
    location: 'Hyderabad',
    image: nexonImg,
  },
  {
    id: 'demo-4',
    slug: 'mg-hector-2022',
    title: 'MG Hector 2022',
    price: 1650000,
    km: 22000,
    fuel: 'Diesel',
    location: 'Hyderabad',
    image: hectorImg,
  },
]

function formatPriceINR(val) {
  if (!val && val !== 0) return '₹ 0'
  const num = Number(val)
  if (isNaN(num)) return `₹ ${val}`
  return `₹ ${num.toLocaleString('en-IN')}`
}

export default function FeaturedCars() {
  const [activeTab, setActiveTab] = useState('buy')
  const [cars, setCars] = useState(DEFAULT_FEATURED_CARS)
  const [loading, setLoading] = useState(true)
  const [localWishlist, setLocalWishlist] = useState({})
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    let cancelled = false

    vehicleService
      .getAll({ vehicleType: 'CARS', size: 12, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content = res?.data?.content || res?.content || (Array.isArray(res?.data) ? res.data : [])
        if (Array.isArray(content) && content.length > 0) {
          const mapped = content.map(mapVehicleToCarCard).filter(Boolean)
          if (mapped.length > 0) {
            // Fill with default cars if less than 4 for a complete grid
            const combined = [...mapped]
            if (combined.length < 4) {
              const remaining = DEFAULT_FEATURED_CARS.slice(combined.length)
              combined.push(...remaining)
            }
            setCars(combined)
          }
        }
      })
      .catch(() => {
        // Fallback to default cars
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleHeartClick = (car, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleWishlist && car.slug && !car.id.startsWith('demo-')) {
      toggleWishlist({ slug: car.slug, productType: 'vehicles' })
    }
    setLocalWishlist((prev) => ({
      ...prev,
      [car.id || car.slug]: !prev[car.id || car.slug],
    }))
  }

  return (
    <section className="container-page py-8 sm:py-10 bg-[#FFFFFF]">
      {/* ───── Section Header ───── */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2
          className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight"
          style={{ fontFamily: 'Inter' }}
        >
          Featured Cars
        </h2>

        {/* Right controls: View all & Navigation arrows */}
        <div className="flex items-center gap-3">
          <Link
            to="/cars"
            className="text-xs sm:text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition"
          >
            View all
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous cars"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next cars"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ───── Tabs: Buy Cars / Sell Your Car ───── */}
      <div className="flex items-center gap-6 border-b border-[#F1F3F7] mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('buy')}
          className={`pb-2.5 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'buy'
              ? 'text-[#D5112A]'
              : 'text-[#6B7280] hover:text-[#0F172A]'
            }`}
        >
          Buy Cars
          {activeTab === 'buy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D5112A] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sell')
            navigate('/sell/car')
          }}
          className={`pb-2.5 text-sm font-medium transition-all relative cursor-pointer ${activeTab === 'sell'
              ? 'text-[#D5112A] font-bold'
              : 'text-[#6B7280] hover:text-[#0F172A]'
            }`}
        >
          Sell Your Car
          {activeTab === 'sell' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D5112A] rounded-full" />
          )}
        </button>
      </div>

      {/* ───── Cars Slider / Grid ───── */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[82%] sm:auto-cols-[46%] lg:auto-cols-[calc(25%-15px)] gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {cars.map((car) => {
          const isWish =
            localWishlist[car.id || car.slug] ??
            (isInWishlist ? isInWishlist(car.slug) : false)

          const displayPrice = formatPriceINR(car.price)
          const displayKm = car.km || car.mileage
            ? `${Number(car.km || car.mileage).toLocaleString('en-IN')} km`
            : '45,000 km'
          const displayFuel = car.fuel || car.fuelType || 'Petrol'
          const displayLocation = car.location || car.city || 'Hyderabad'
          const carLink = car.slug ? `/cars/${car.slug}` : `/cars`

          return (
            <Link
              key={car.id || car.slug}
              to={carLink}
              className="group block rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D1D5DB] transition-all duration-300"
            >
              {/* Image Preview with Heart Wishlist button */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={car.image || car.images?.[0] || swiftImg}
                  alt={car.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <button
                  type="button"
                  onClick={(e) => handleHeartClick(car, e)}
                  aria-label="Add to wishlist"
                  className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2937] hover:text-[#DC2626] transition hover:scale-110 cursor-pointer z-10"
                >
                  <Heart
                    size={16}
                    className={
                      isWish
                        ? 'fill-[#DC2626] text-[#DC2626]'
                        : 'text-[#1F2937]'
                    }
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-4 bg-white">
                {/* Price */}
                <p className="text-[17px] sm:text-[19px] font-bold text-[#0F172A] tracking-tight">
                  {displayPrice}
                </p>

                {/* Car Title / Model */}
                <h3 className="text-sm font-semibold text-[#1F2937] mt-1 truncate group-hover:text-[#D5112A] transition-colors">
                  {car.title}
                </h3>

                {/* Specs */}
                <p className="text-xs text-[#6B7280] mt-1 font-medium">
                  {displayKm} • {displayFuel}
                </p>

                {/* Location */}
                <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <MapPin size={14} className="shrink-0 text-[#858D9D]" />
                  <span className="truncate">{displayLocation}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
