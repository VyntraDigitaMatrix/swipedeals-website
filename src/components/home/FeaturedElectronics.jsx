import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react'
import { electronicsService, mapElectronicsToCard } from '../../services/publicListingService'
import { useWishlist } from '../../hooks/useWishlist'

import iphoneImg from '../../assets/featured-electronics/iphone.png'
import macbookImg from '../../assets/featured-electronics/macbook.png'
import tvImg from '../../assets/featured-electronics/tv.png'
import headphonesImg from '../../assets/featured-electronics/headphones.png'

const DEFAULT_ELECTRONICS = [
  {
    id: 'demo-e1',
    slug: 'iphone-15-128-gb',
    title: 'iPhone 15 128 GB',
    price: 62999,
    condition: 'Like new',
    location: 'Hyderabad',
    image: iphoneImg,
  },
  {
    id: 'demo-e2',
    slug: 'macbook-air-m1',
    title: 'MacBook Air M1',
    price: 32000,
    condition: 'Good condition',
    location: 'Hyderabad',
    image: macbookImg,
  },
  {
    id: 'demo-e3',
    slug: 'samsung-43-smart-tv',
    title: 'Samsung 43" Smart TV',
    price: 28500,
    condition: 'Like new',
    location: 'Hyderabad',
    image: tvImg,
  },
  {
    id: 'demo-e4',
    slug: 'sony-wh-1000xm4',
    title: 'Sony WH-1000XM4',
    price: 4999,
    condition: 'Good condition',
    location: 'Hyderabad',
    image: headphonesImg,
  },
]

function formatPriceINR(val) {
  if (!val && val !== 0) return '₹ 0'
  const num = Number(val)
  if (isNaN(num)) return `₹ ${val}`
  return `₹ ${num.toLocaleString('en-IN')}`
}

function formatCondition(cond) {
  if (!cond) return 'Good condition'
  const upper = String(cond).toUpperCase()
  if (upper === 'NEW') return 'New'
  if (upper === 'LIKE_NEW' || upper === 'LIKE NEW') return 'Like new'
  if (upper === 'GOOD' || upper === 'GOOD_CONDITION') return 'Good condition'
  if (upper === 'FAIR') return 'Fair'
  return cond
}

export default function FeaturedElectronics() {
  const [items, setItems] = useState(DEFAULT_ELECTRONICS)
  const [localWishlist, setLocalWishlist] = useState({})
  const scrollRef = useRef(null)
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    let cancelled = false

    electronicsService
      .getAll({ size: 12, sort: 'createdAt,desc' })
      .then((res) => {
        if (cancelled) return
        const content =
          res?.data?.content ||
          res?.content ||
          (Array.isArray(res?.data) ? res.data : [])
        if (Array.isArray(content) && content.length > 0) {
          const mapped = content.map(mapElectronicsToCard).filter(Boolean)
          if (mapped.length > 0) {
            const enriched = mapped.map((item, i) => ({
              ...item,
              image: item.images?.[0] || DEFAULT_ELECTRONICS[i % DEFAULT_ELECTRONICS.length]?.image,
              condition: formatCondition(item.rawCondition || item.condition),
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
      toggleWishlist({ slug: item.slug, productType: 'electronics' })
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
          Featured Electronics
        </h2>

        <div className="flex items-center gap-3">
          <Link
            to="/electronics"
            className="text-xs sm:text-sm text-[#1A6FE0] hover:text-[#1E40AF] transition"
            style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
          >
            View all
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous electronics"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next electronics"
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
          const displayCondition = item.condition || 'Like new'
          const displayLocation = item.location || 'Hyderabad'
          const itemLink = item.slug ? `/electronics/${item.slug}` : '/electronics'

          return (
            <Link
              key={item.id || item.slug}
              to={itemLink}
              className="group block rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D1D5DB] transition-all duration-300"
            >
              {/* Image with heart */}
              <div className="relative w-full aspect-[16/10.5] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={item.image || iphoneImg}
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
                <p className="text-xs text-[#7B8390] mt-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
                  {displayCondition}
                </p>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#7B8390]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
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
