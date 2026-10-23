import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react'
import { sparePartsService, mapSparePartToCard } from '../../services/publicListingService'
import { useWishlist } from '../../hooks/useWishlist'

import tyreImg from '../../assets/featured-spare-parts/tyre.png'
import headlightImg from '../../assets/featured-spare-parts/headlight.png'
import brakediscImg from '../../assets/featured-spare-parts/brakedisc.png'
import shockabsorberImg from '../../assets/featured-spare-parts/shockabsorber.png'

const DEFAULT_SPARE_PARTS = [
  {
    id: 'demo-sp1',
    slug: 'car-tyre-mrf-205-55-r16',
    title: 'Car Tyre (MRF 205/55 R16)',
    price: 4500,
    condition: 'New',
    location: 'Hyderabad',
    image: tyreImg,
  },
  {
    id: 'demo-sp2',
    slug: 'led-headlight-original',
    title: 'LED Headlight (Original)',
    price: 2800,
    condition: 'New',
    location: 'Hyderabad',
    image: headlightImg,
  },
  {
    id: 'demo-sp3',
    slug: 'brake-disc-pads-set',
    title: 'Brake Disc & Pads Set',
    price: 3200,
    condition: 'New',
    location: 'Hyderabad',
    image: brakediscImg,
  },
  {
    id: 'demo-sp4',
    slug: 'shock-absorber-set-of-2',
    title: 'Shock Absorber (Set of 2)',
    price: 6500,
    condition: 'New',
    location: 'Hyderabad',
    image: shockabsorberImg,
  },
]

function formatPriceINR(val) {
  if (!val && val !== 0) return '₹ 0'
  const num = Number(val)
  if (isNaN(num)) return `₹ ${val}`
  return `₹ ${num.toLocaleString('en-IN')}`
}

function formatCondition(cond) {
  if (!cond) return 'New'
  const upper = String(cond).toUpperCase()
  if (upper === 'NEW') return 'New'
  if (upper === 'LIKE_NEW' || upper === 'LIKE NEW') return 'Like new'
  if (upper === 'USED') return 'Used'
  return cond
}

export default function FeaturedSpareParts() {
  const [items, setItems] = useState(DEFAULT_SPARE_PARTS)
  const [localWishlist, setLocalWishlist] = useState({})
  const scrollRef = useRef(null)
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    let cancelled = false

    sparePartsService
      .getAll({ size: 12, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content =
          res?.data?.content ||
          res?.content ||
          (Array.isArray(res?.data) ? res.data : [])
        if (Array.isArray(content) && content.length > 0) {
          const mapped = content.map(mapSparePartToCard).filter(Boolean)
          if (mapped.length > 0) {
            const enriched = mapped.map((item, i) => ({
              ...item,
              image: item.images?.[0] || DEFAULT_SPARE_PARTS[i % DEFAULT_SPARE_PARTS.length]?.image,
              condition: formatCondition(item.condition),
              location: item.location || item.city || 'Hyderabad',
            }))
            setItems(enriched)
          }
        }
      })
      .catch(() => {
        /* fallback to defaults */
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const handleHeart = (item, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleWishlist && item.slug && !item.id?.startsWith('demo-')) {
      toggleWishlist({ slug: item.slug, productType: 'spare-part' })
    }
    setLocalWishlist((prev) => ({
      ...prev,
      [item.id || item.slug]: !prev[item.id || item.slug],
    }))
  }

  return (
    <section className="container-page py-6 sm:py-8 bg-[#FFFFFF]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2
          className="text-xl sm:text-2xl text-[#0F1624] tracking-tight"
          style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
        >
          Featured Spare Parts
        </h2>

        <div className="flex items-center gap-3">
          <Link
            to="/spare-parts"
            className="text-xs sm:text-sm text-[#1A6FE0] hover:text-[#1E40AF] transition"
            style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
          >
            View all
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous spare parts"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next spare parts"
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
        {items.map((item) => {
          const isWish =
            localWishlist[item.id || item.slug] ??
            (isInWishlist ? isInWishlist(item.slug) : false)

          const displayPrice = formatPriceINR(item.price)
          const displayCondition = item.condition || 'New'
          const displayLocation = item.location || 'Hyderabad'
          const itemLink = item.slug ? `/spare-parts/${item.slug}` : '/spare-parts'

          return (
            <Link
              key={item.id || item.slug}
              to={itemLink}
              className="group block rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D1D5DB] transition-all duration-300"
            >
              {/* Image with heart */}
              <div className="relative w-full aspect-[16/9.5] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={item.image || tyreImg}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Heart button */}
                <button
                  type="button"
                  onClick={(e) => handleHeart(item, e)}
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
                  {item.title}
                </h3>

                {/* Condition */}
                <p className="text-xs text-[#6B7280] mt-1 font-medium" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
                  {displayCondition}
                </p>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#6B7280]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
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
