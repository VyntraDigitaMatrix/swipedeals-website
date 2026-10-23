import { Link } from 'react-router-dom'
import { Headphones } from 'lucide-react'

export default function AuthHeader() {
  return (
    <header className="w-full max-w-full mx-auto px-2 py-3 flex items-center justify-between shrink-0">
      <Link to="/" className="flex items-center gap-2.5 select-none" aria-label="SwipeDeals">
        <div
          className="flex h-[42px] w-[42px] items-center justify-center rounded-xl text-white shadow-md font-black text-xl italic tracking-tighter"
          style={{
            background: 'linear-gradient(180deg, #E8182F 0%, #C00D24 100%)',
          }}
        >
          S
        </div>
        <div className="flex flex-col leading-tight">
          <span
            className="text-lg sm:text-[22px]"
            style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E' }}
          >
            Swipe<span style={{ color: '#E8182F' }}>Deals</span>
          </span>
          <span
            className="text-[12px]"
            style={{ fontFamily: 'Inter', fontWeight: 400, color: '#5B6474' }}
          >
            Trusted Marketplace
          </span>
        </div>
      </Link>

      <Link
        to="/contact"
        className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-gray-700 hover:text-[#c0001f] transition-colors"
      >
        <Headphones size={16} className="text-gray-700" />
        <span>Need help?</span>
      </Link>
    </header>
  )
}
