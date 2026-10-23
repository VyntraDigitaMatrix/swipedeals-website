import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react'
import { propertyService, mapPropertyToCard } from '../../services/publicListingService'
import { useWishlist } from '../../hooks/useWishlist'

import apartmentImg from '../../assets/featured-properties/apartment.png'
import villaImg from '../../assets/featured-properties/villa.png'
import plotImg from '../../assets/featured-properties/plot.png'
import houseImg from '../../assets/featured-properties/house.png'

const DEFAULT_PROPERTIES = [
  {
    id: 'demo-p1',
    slug: '2-bhk-apartment-hyderabad',
    title: '2 BHK Apartment',
    type: 'Apartment',
    price: 7200000,
    area: 1020,
    areaUnit: 'Sq Ft',
    constructionStatus: 'Ready to Move',
    location: 'Hyderabad',
    image: apartmentImg,
  },
  {
    id: 'demo-p2',
    slug: '3-bhk-villa-hyderabad',
    title: '3 BHK Villa',
    type: 'Villa',
    price: 12500000,
    area: 2100,
    areaUnit: 'Sq Ft',
    constructionStatus: 'Ready to Move',
    location: 'Hyderabad',
    image: villaImg,
  },
  {
    id: 'demo-p3',
    slug: 'residential-plot-hyderabad',
    title: 'Residential Plot',
    type: 'Plot',
    price: 1800000,
    area: 200,
    areaUnit: 'Sq Yd',
    constructionStatus: 'Gated Community',
    location: 'Hyderabad',
    image: plotImg,
  },
  {
    id: 'demo-p4',
    slug: '4-bhk-independent-house-hyderabad',
    title: '4 BHK Independent House',
    type: 'Independent House',
    price: 9500000,
    area: 2400,
    areaUnit: 'Sq Ft',
    constructionStatus: 'Ready to Move',
    location: 'Hyderabad',
    image: houseImg,
  },
]

function formatPriceINR(val) {
  if (!val && val !== 0) return '₹ 0'
  const num = Number(val)
  if (isNaN(num)) return `₹ ${val}`
  return `₹ ${num.toLocaleString('en-IN')}`
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState(DEFAULT_PROPERTIES)
  const [localWishlist, setLocalWishlist] = useState({})
  const scrollRef = useRef(null)
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    let cancelled = false

    propertyService
      .getAll({ size: 12, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content =
          res?.data?.content ||
          res?.content ||
          (Array.isArray(res?.data) ? res.data : [])
        if (Array.isArray(content) && content.length > 0) {
          const mapped = content.map(mapPropertyToCard).filter(Boolean)
          if (mapped.length > 0) {
            // Enrich with fallback images if no real images
            const enriched = mapped.map((p, i) => ({
              ...p,
              image: p.images?.[0] || DEFAULT_PROPERTIES[i % DEFAULT_PROPERTIES.length]?.image,
            }))
            setProperties(enriched)
          }
        }
      })
      .catch(() => {/* fallback to defaults */ })

    return () => { cancelled = true }
  }, [])

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const handleHeart = (prop, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleWishlist && prop.slug && !prop.id?.startsWith('demo-')) {
      toggleWishlist({ slug: prop.slug, productType: 'property' })
    }
    setLocalWishlist((prev) => ({ ...prev, [prop.id || prop.slug]: !prev[prop.id || prop.slug] }))
  }

  return (
    <section className="container-page py-8 sm:py-10 bg-[#FFFFFF]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2
          className="text-xl sm:text-2xl text-[#0F1624] tracking-tight"
          style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
        >
          Featured Properties
        </h2>

        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="text-xs sm:text-sm text-[#1A6FE0] hover:text-[#1E40AF] transition"
            style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
          >
            View all
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous properties"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next properties"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Cards Slider ── */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[82%] sm:auto-cols-[46%] lg:auto-cols-[calc(25%-15px)] gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {properties.map((prop) => {
          const isWish =
            localWishlist[prop.id || prop.slug] ??
            (isInWishlist ? isInWishlist(prop.slug) : false)

          const displayPrice = formatPriceINR(prop.price)
          const displayArea = prop.area
            ? `${Number(prop.area).toLocaleString('en-IN')} ${prop.areaUnit || 'Sq Ft'}`
            : null
          const displayStatus = prop.constructionStatus || 'Ready to Move'
          const displayLocation = prop.location || prop.city || 'Hyderabad'
          const propLink = prop.slug ? `/properties/${prop.slug}` : '/properties'
          const typeLabel = prop.type || 'Property'

          return (
            <Link
              key={prop.id || prop.slug}
              to={propLink}
              className="group block rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D1D5DB] transition-all duration-300"
            >
              {/* Image with badge + heart */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={prop.image || apartmentImg}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Property type badge – bottom-left of image */}
                <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] text-[#111827] shadow-sm" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
                  {typeLabel}
                </span>

                {/* Heart button */}
                <button
                  type="button"
                  onClick={(e) => handleHeart(prop, e)}
                  aria-label="Add to wishlist"
                  className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2937] hover:text-[#DC2626] transition hover:scale-110 cursor-pointer z-10"
                >
                  <Heart
                    size={16}
                    className={isWish ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#1F2937]'}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Card details */}
              <div className="p-4 bg-white">
                {/* Price */}
                <p className="text-[17px] sm:text-[19px] text-[#0F1624] tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
                  {displayPrice}
                </p>

                {/* Title */}
                <h3 className="text-sm text-[#1F2633] mt-1 truncate group-hover:text-[#D5112A] transition-colors" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
                  {prop.title}
                </h3>

                {/* Area & Status */}
                <p className="text-xs text-[#7B8390] mt-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
                  {displayArea ? `${displayArea} • ` : ''}{displayStatus}
                </p>

                {/* Location */}
                <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#7B8390]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
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
