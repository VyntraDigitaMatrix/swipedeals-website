import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'

import carsImg from '../../assets/categories/cars.png'
import propertiesImg from '../../assets/categories/properties.png'
import electronicsImg from '../../assets/categories/electronics.png'
import sparePartsImg from '../../assets/categories/spare-parts.png'

const CATEGORIES = [
  {
    id: 'cars',
    title: 'Cars',
    subtitle: 'Buy & sell new and used cars',
    to: '/cars',
    image: carsImg,
    alt: 'Cars marketplace',
    highlight: true,
    cardBg: 'bg-[#FFF0F2]',
    borderColor: 'border-[#FECDD3]',
  },
  {
    id: 'properties',
    title: 'Properties',
    subtitle: 'Find your dream property',
    to: '/properties',
    image: propertiesImg,
    alt: 'Properties marketplace',
    cardBg: 'bg-[#FFFFFF]',
    borderColor: 'border-[#E5E7EB]',
  },
  {
    id: 'electronics',
    title: 'Electronics',
    subtitle: 'Mobiles, laptops, TVs and more',
    to: '/electronics',
    image: electronicsImg,
    alt: 'Electronics marketplace',
    cardBg: 'bg-[#FFFFFF]',
    borderColor: 'border-[#E5E7EB]',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    subtitle: 'Genuine parts at great prices',
    to: '/spare-parts',
    image: sparePartsImg,
    alt: 'Spare parts marketplace',
    cardBg: 'bg-[#FFFFFF]',
    borderColor: 'border-[#E5E7EB]',
  },
]

export default function CategoryGrid() {
  const [favorites, setFavorites] = useState({})

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="container-page py-8 sm:py-10 bg-[#FFFFFF]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2
          className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight"
          style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#0F1624' }}
        >
          Shop by Category
        </h2>
        <Link
          to="/cars"
          className="text-xs sm:text-sm font-semibold text-[#1A6FE0] hover:text-[#1E40AF] transition"
        >
          View all
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const isFav = !!favorites[cat.id]

          return (
            <Link
              key={cat.id}
              to={cat.to}
              className={`group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] border transition-all duration-300 overflow-hidden ${cat.borderColor} ${cat.cardBg} hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Image preview with heart icon */}
              <div className="relative w-full aspect-[16/11] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Heart / Wishlist button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(cat.id, e)}
                  aria-label={`Favorite ${cat.title}`}
                  className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2937] hover:text-[#DC2626] transition-transform hover:scale-110 cursor-pointer z-10"
                >
                  <Heart
                    size={16}
                    className={
                      isFav
                        ? 'fill-[#DC2626] text-[#DC2626]'
                        : 'text-[#1F2937]'
                    }
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Floating inner white box for title & subtitle with padding from outer card */}
              <div className="p-2 sm:p-2.5 -mt-1 relative z-10">
                <div className="rounded-2xl bg-white p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] sm:text-base leading-tight group-hover:text-[#D5112A] transition-colors" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#0F1624' }}>
                      {cat.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs mt-1 leading-normal truncate" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#5B6474' }}>
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Circular Action Button */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D0101F] group-hover:bg-[#DC2626] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.2} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
