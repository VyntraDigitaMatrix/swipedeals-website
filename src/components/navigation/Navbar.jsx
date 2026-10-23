import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  CarFront,
  Check,
  ChevronDown,
  CreditCard,
  FileSearch,
  FileText,
  Gavel,
  Heart,
  Home,
  Laptop,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  PlusCircle,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Settings,
  Truck,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useWishlist } from '../../hooks/useWishlist'
import { useNotifications } from '../../hooks/useNotifications'
import { useAuth } from '../../hooks/useAuth'
import { useKyc } from '../../hooks/useKyc'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import NotificationDropdown from '../notifications/NotificationDropdown'
import navLinks from './navLinks'
import { cn } from '../../utils/cn'

const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata']

// Category icon map for dropdown items
const ITEM_ICONS = {
  'Buy Cars': CarFront,
  'Buy New Cars': Sparkles,
  'Buy Used Cars': ShieldCheck,
  'Sell Your Car': PlusCircle,
  'Buy Commercial Vehicles': Truck,
  'Sell Commercial Vehicle': PlusCircle,
  'Buy Electronics': Laptop,
  'Sell Electronics': PlusCircle,
  'Buy Spare Parts': Wrench,
  'Sell Spare Parts': PlusCircle,
  'Buy Properties': Home,
  'Sell Property': PlusCircle,
  'Challan Payment': FileText,
  'RC / Vehicle Details': FileSearch,
  'RC Status': FileSearch,
  'Car Finance': CreditCard,
  'Car Insurance': ShieldCheck,
  'Electronics': Laptop,
  'Spare Parts': Wrench,
  'Services': Settings,
}

// Promo feature cards for desktop mega-dropdowns
const DROPDOWN_PROMOS = {
  Cars: {
    badge: 'Certified Quality',
    title: '200-Point Inspected Pre-Owned Cars',
    description: '1-Year warranty, free roadside assistance & 7-day money back guarantee.',
    cta: 'Browse Certified',
    link: '/cars/used',
    bgGradient: 'from-primary-dark/95 via-primary to-secondary',
  },
  Commercial: {
    badge: 'Fleet Verified',
    title: 'Commercial Trucks & Vans',
    description: 'Heavy vehicles, mini trucks, and buses at unbeatable prices.',
    cta: 'Explore Fleet',
    link: '/commercial-vehicles',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
  },
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const [locationOpen, setLocationOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const locationRef = useRef(null)
  const moreRef = useRef(null)

  useOnClickOutside(locationRef, () => setLocationOpen(false))
  useOnClickOutside(moreRef, () => setMoreOpen(false))

  const navigate = useNavigate()
  const scrolled = useScrollPosition(20)
  const { count } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()

  const [query, setQuery] = useState('')
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/cars?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-[#ECEEF2] bg-white transition-all duration-300',
        scrolled ? 'shadow-sm' : ''
      )}
    >
      {/* Top Tier */}
      <div className="container-page flex items-center justify-between gap-3 lg:gap-6 py-2.5 sm:py-3">
        {/* Brand Logo & Location Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none" aria-label="SwipeDeals home">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#E8182F] text-white shadow-sm font-black text-xl italic tracking-tighter">
              S
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] sm:text-[20px]" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Regular', fontStyle: 'Bold', color: '#0F172A' }}>
                Swipe<span className="text-[#E11D27]">Deals</span>
              </span>
              <span className="text-[10px] sm:text-[11px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#64748B' }}>
                Buy · Sell · Anything
              </span>
            </div>
          </Link>

          {/* Location Selector Button on Navbar */}
          <div ref={locationRef} className="relative hidden md:block select-none">
            <button
              type="button"
              onClick={() => setLocationOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-xs font-semibold text-[#0F172A] hover:border-[#CF1430] hover:bg-gray-50/50 transition cursor-pointer shadow-2xs"
              aria-haspopup="true"
              aria-expanded={locationOpen}
            >
              <MapPin size={15} className="text-[#3E4654] shrink-0" aria-hidden="true" />
              <span>{selectedCity}</span>
              <ChevronDown
                size={14}
                className={`text-[#5B6474] transition-transform duration-200 ${locationOpen ? 'rotate-180 text-[#E11D27]' : ''
                  }`}
                aria-hidden="true"
              />
            </button>

            {locationOpen && (
              <div className="absolute left-0 top-full z-[60] mt-1.5 w-48 rounded-xl border border-[#ECEEF2] bg-white p-1.5 shadow-xl">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A92A0]">
                  Select City
                </div>
                <div className="space-y-0.5 max-h-56 overflow-y-auto no-scrollbar">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city)
                        setLocationOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition cursor-pointer ${selectedCity === city
                        ? 'bg-[#FDECEE] font-bold text-[#D4111F]'
                        : 'text-[#1F2633] hover:bg-gray-100 font-medium'
                        }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check size={13} className="text-[#D4111F]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar with Red Action Button */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-[540px] xl:max-w-[620px] 2xl:max-w-[700px] flex items-center min-w-0"
        >
          <div className="relative flex-1 flex items-center h-10 sm:h-10.5 rounded-xl border border-[#E2E5EB] bg-white overflow-hidden focus-within:border-[#CF1430] focus-within:ring-1 focus-within:ring-[#CF1430] transition shadow-2xs">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for cars, properties, electronics..."
              className="w-full h-full pl-3.5 pr-2 text-xs sm:text-[13px] text-[#0B1B2E] placeholder:text-[#8A92A0] bg-transparent outline-none"
            />
            <button
              type="submit"
              className="h-full px-4 sm:px-4.5 bg-[#E11D27] hover:bg-[#D4111F] text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={2.4} />
            </button>
          </div>
        </form>

        {/* Right Side: Wishlist, Auctions, More, Chats, Login/UserMenu, Sell */}
        <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-6 shrink-0">
          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="flex flex-col items-center justify-center text-[#334155] hover:text-[#E11D27] transition group"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart size={20} className="group-hover:scale-105 transition-transform" />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 h-3.5 min-w-3.5 px-0.5 rounded-full bg-[#E11D27] text-[9px] font-bold text-white flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#334155] group-hover:text-[#E11D27] mt-0.5">
              Wishlist
            </span>
          </Link>

          {/* Auctions */}
          <Link
            to="/auctions"
            className="hidden sm:flex flex-col items-center justify-center text-[#334155] hover:text-[#E11D27] transition group"
            aria-label="Auctions"
          >
            <div className="relative">
              <Gavel size={20} className="group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-[11px] font-medium text-[#334155] group-hover:text-[#E11D27] mt-0.5">
              Auctions
            </span>
          </Link>

          {/* More Dropdown */}
          <div ref={moreRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex flex-col items-center justify-center transition cursor-pointer ${moreOpen ? 'text-[#E11D27]' : 'text-[#E11D27] hover:text-[#E11D27]'}`}
            >
              <div className="flex items-center gap-0.5">
                <LayoutGrid size={18} strokeWidth={2.2} />
                <ChevronDown size={12} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[11px] font-medium text-[#E11D27] group-hover:text-[#E11D27] mt-0.5">More</span>
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-[60] mt-2 w-64 rounded-2xl border border-[#ECEEF2] bg-white p-2 shadow-2xl">
                {/* SwipeAuctions */}
                <Link
                  to="/auctions"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FDF5F5] transition group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEE9EA]">
                    <Gavel size={18} className="text-[#D4111F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0B1B2E]">SwipeAuctions</span>
                      <span className="inline-flex items-center rounded-full bg-[#E8182F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">SOON</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Bid on cars &amp; bikes</p>
                  </div>
                </Link>

                {/* Challan */}
                <Link
                  to="/challan-payment"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FDF5F5] transition group mt-1"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEE9EA]">
                    <Receipt size={18} className="text-[#D4111F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#0B1B2E]">Challan</span>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Check &amp; pay traffic challans</p>
                  </div>
                </Link>

                {/* RC Status */}
                <Link
                  to="/rc-status"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#FDF5F5] transition group mt-1"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEE9EA]">
                    <FileSearch size={18} className="text-[#D4111F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#0B1B2E]">RC Status</span>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Check vehicle RC &amp; ownership</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Chats */}
          <Link
            to="/dashboard"
            className="hidden sm:flex flex-col items-center justify-center text-[#3E4654] hover:text-[#E8182F] transition group"
            aria-label="Chats"
          >
            <MessageSquare size={19} className="group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-medium text-[#334155] group-hover:text-[#E11D27] mt-0.5">
              Chats
            </span>
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center justify-center text-[#3E4654] hover:text-[#E8182F] transition group"
              aria-label="Login"
            >
              <User size={19} className="group-hover:scale-105 transition-transform" />
              <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#E8182F] mt-0.5">
                Login
              </span>
            </Link>
          )}

          {/* Sell Button */}
          <Link
            to="/sell"
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E11D27] hover:bg-[#D4111F] text-white text-xs sm:text-[13px] font-bold shadow-sm transition-transform active:scale-98 cursor-pointer shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Sell</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-alt text-text transition-colors hover:bg-surface-alt/80 xl:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom Category Row: Cars, Properties, Electronics, Spare Parts, Mobiles */}
      <div className="container-page border-t border-[#F0F2F5] py-2">
        <nav
          className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar text-xs sm:text-[13px] font-semibold text-[#1F2633]"
          aria-label="Category Navigation"
        >
          <Link
            to="/cars"
            className="flex items-center gap-1.5 text-[#2C3444] hover:text-[#E8182F] transition whitespace-nowrap shrink-0 group"
          >
            <CarFront size={15} className="text-[#334155] group-hover:text-[#E8182F] transition-colors" />
            <span>Cars</span>
          </Link>
          <Link
            to="/properties"
            className="flex items-center gap-1.5 text-[#2C3444] hover:text-[#E8182F] transition whitespace-nowrap shrink-0 group"
          >
            <Home size={15} className="text-[#334155] group-hover:text-[#E8182F] transition-colors" />
            <span>Properties</span>
          </Link>
          <Link
            to="/electronics"
            className="flex items-center gap-1.5 text-[#2C3444] hover:text-[#E8182F] transition whitespace-nowrap shrink-0 group"
          >
            <Laptop size={15} className="text-[#334155] group-hover:text-[#E8182F] transition-colors" />
            <span>Electronics</span>
          </Link>
          <Link
            to="/spare-parts"
            className="flex items-center gap-1.5 text-[#2C3444] hover:text-[#E8182F] transition whitespace-nowrap shrink-0 group"
          >
            <Settings size={15} className="text-[#334155] group-hover:text-[#E8182F] transition-colors" />
            <span>Spare Parts</span>
          </Link>
        </nav>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
    </header>
  )
}

function NavDropdown({ link }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))

  const promo = DROPDOWN_PROMOS[link.label]
  const alignRight = link.alignRight || link.label === 'More'

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
          open ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-surface-alt hover:text-text'
        )}
      >
        {link.label}
        <ChevronDown
          size={13}
          className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180 text-primary')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full z-50 mt-1 rounded-2xl border border-border bg-surface shadow-2xl p-3',
              alignRight ? 'right-0 left-auto origin-top-right' : 'left-0 origin-top-left',
              promo ? 'w-[520px] grid grid-cols-12 gap-3' : 'w-72'
            )}
          >
            {/* Options List */}
            <div className={cn('space-y-1', promo ? 'col-span-7' : 'w-full')}>
              {link.dropdown.map((item) => {
                if (item.dropdown) {
                  return <NavSubDropdown key={item.label} item={item} setOpen={setOpen} />
                }

                const IconComponent = ITEM_ICONS[item.label] || Sparkles
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 text-[11px] leading-tight text-text-secondary line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Featured Mega Promo Card */}
            {promo && (
              <div
                className={cn(
                  'col-span-5 rounded-xl p-4 text-white flex flex-col justify-between bg-gradient-to-br',
                  promo.bgGradient
                )}
              >
                <div>
                  <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md mb-2">
                    {promo.badge}
                  </span>
                  <h4 className="text-xs font-bold leading-snug">{promo.title}</h4>
                  <p className="mt-1 text-[11px] text-white/80 leading-relaxed">{promo.description}</p>
                </div>
                <Link
                  to={promo.link}
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-between rounded-lg bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/25 transition-colors"
                >
                  <span>{promo.cta}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * NavSubDropdown — renders a top-level "More" category item (e.g. Electronics,
 * Spare Parts, Services) that has its own nested dropdown of sub-links.
 * Shows the parent row with icon + description, and a fly-out panel on hover.
 */
function NavSubDropdown({ item, setOpen: setParentOpen }) {
  const [subOpen, setSubOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setSubOpen(false))
  const IconComponent = ITEM_ICONS[item.label] || Sparkles

  // Description for the parent row based on its children
  const parentDescriptions = {
    'Electronics': 'Mobiles, laptops, TVs & more',
    'Spare Parts': 'Genuine & aftermarket parts',
    'Services': 'Finance, insurance & vehicle info',
  }
  const parentDesc = parentDescriptions[item.label] || ''

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
    >
      {/* Parent row — looks like a normal dropdown item but has a chevron */}
      <button
        type="button"
        onClick={() => setSubOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt group text-left"
      >
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5',
          subOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
        )}>
          <IconComponent size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-bold transition-colors', subOpen ? 'text-primary' : 'text-text group-hover:text-primary')}>
            {item.label}
          </p>
          {parentDesc && (
            <p className="mt-0.5 text-[11px] leading-tight text-text-secondary line-clamp-1">
              {parentDesc}
            </p>
          )}
        </div>
        <ChevronDown
          size={12}
          className={cn('shrink-0 text-text-secondary transition-transform duration-200 -rotate-90', subOpen && 'rotate-0 text-primary')}
          aria-hidden="true"
        />
      </button>

      {/* Sub-items fly-out panel */}
      <AnimatePresence>
        {subOpen && (
          <motion.div
            initial={{ opacity: 0, x: -4, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className="absolute left-full top-0 z-50 ml-1 w-64 rounded-2xl border border-border bg-surface p-3 shadow-2xl"
          >
            <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border/60 pb-1.5">
              {item.label}
            </div>
            <div className="space-y-1">
              {item.dropdown.map((sub) => {
                const SubIcon = ITEM_ICONS[sub.label] || Sparkles
                return (
                  <Link
                    key={sub.label}
                    to={sub.to}
                    onClick={() => {
                      setSubOpen(false)
                      setParentOpen(false)
                    }}
                    className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt group"
                  >
                    <div className=" shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                      <SubIcon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                        {sub.label}
                      </p>
                      {sub.description && (
                        <p className="mt-0.5 text-[11px] leading-tight text-text-secondary line-clamp-2">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  useOnClickOutside(ref, () => setOpen(false))
  const { isKycVerified } = useKyc()
  const { profile } = useUserProfile()

  // Priority: real API profile name > auth store name > phone > fallback
  const displayName =
    profile?.fullName ||
    user?.name ||
    (user?.phone ? `+91 ${user.phone}` : 'Account')
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U'

  const menuItems = [
    { label: 'Profile', to: '/profile', icon: User },
    { label: 'Wishlist', to: '/wishlist', icon: Heart },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'My Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', to: '/dashboard/listings', icon: ShoppingBag },
    { label: isKycVerified ? 'KYC Verified' : 'Complete KYC', to: '/kyc', icon: BadgeCheck },
  ]

  const handleLogout = () => {
    setOpen(false)
    onLogout()
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          'flex items-center gap-2 rounded-xl p-1 pr-2.5 transition-colors'
        )}
      >
        {/* Avatar: first letter of the user's name */}
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E11D27] text-xs font-bold text-white shadow-lift">
          {initial}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-2xl"
          >
            <div className="border-b border-border p-3 bg-surface-alt/50 rounded-xl mb-1">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-text">{displayName}</p>
                  <p className="truncate text-[11px] text-text-secondary">{user?.email || (user?.phone ? `+91 ${user.phone}` : '')}</p>
                </div>
              </div>
              <div
                className={cn(
                  'mt-2 flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit',
                  isKycVerified ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                )}
              >
                {isKycVerified ? (
                  <>
                    <ShieldCheck size={11} /> KYC Verified
                  </>
                ) : (
                  <>
                    <AlertTriangle size={11} /> KYC Pending
                  </>
                )}
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text transition-colors hover:bg-surface-alt hover:text-primary"
                >
                  <item.icon size={15} className="text-text-secondary" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-1 mt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut size={15} aria-hidden="true" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function IconLink({ to, label, children, badge }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-alt text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/30 sm:flex"
    >
      {children}
      {!!badge && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-extrabold text-white ring-2 ring-surface">
          {badge}
        </span>
      )}
    </Link>
  )
}

function MobileMenu({ open, onClose, selectedCity, setSelectedCity }) {
  const [openDropdown, setOpenDropdown] = useState('Cars')
  const { user, isAuthenticated, logout } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCityPicker, setShowCityPicker] = useState(false)

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const handleMobileSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onClose()
      navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex w-full h-full min-h-screen flex-col overflow-y-auto bg-surface p-4 sm:p-6 xl:hidden"
        >
          {/* Header Bar inside Full Screen Mobile View */}
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary-light to-secondary text-white font-bold shadow-md">
                <CarFront size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-text leading-none">
                  Swipe<span className="text-primary">Deals</span>
                </span>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Marketplace
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* City selector inside mobile full screen menu */}
              <button
                type="button"
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold text-text hover:bg-surface"
              >
                <MapPin size={13} className="text-primary" />
                <span>{selectedCity || 'Mumbai'}</span>
                <ChevronDown size={12} className={cn('transition-transform', showCityPicker && 'rotate-180')} />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-alt text-text hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* City Selection Dropdown (Expanded) */}
          {showCityPicker && (
            <div className="mb-4 rounded-2xl border border-border bg-surface-alt p-3 shadow-inner">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">Select Your City</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      if (setSelectedCity) setSelectedCity(city)
                      setShowCityPicker(false)
                    }}
                    className={cn(
                      'rounded-xl px-3 py-2 text-xs font-semibold text-center transition-colors',
                      selectedCity === city
                        ? 'bg-primary text-white font-bold shadow-xs'
                        : 'bg-surface text-text hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full Screen Mobile Search */}
          <form onSubmit={handleMobileSearch} className="relative mb-5">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cars, brands, properties, electronics..."
              className="w-full rounded-2xl border border-border bg-surface-alt py-3 pl-10 pr-4 text-xs font-medium text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark"
            >
              Search
            </button>
          </form>

          {/* Categorized Full-Width Navigation */}
          <div className="mb-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary px-1">
              Explore Marketplace Categories
            </p>
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown((v) => (v === link.label ? null : link.label))}
                      aria-expanded={openDropdown === link.label}
                      className={cn(
                        'flex w-full items-center justify-between p-3.5 text-xs font-bold transition-colors',
                        openDropdown === link.label ? 'bg-primary/10 text-primary' : 'bg-surface-alt/70 text-text hover:bg-surface-alt'
                      )}
                    >
                      <span className="text-sm font-extrabold">{link.label}</span>
                      <ChevronDown
                        size={16}
                        className={cn('transition-transform duration-200', openDropdown === link.label && 'rotate-180 text-primary')}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden p-2 space-y-1.5 bg-surface"
                        >
                          {link.dropdown.map((item) => (
                            item.dropdown ? (
                              <MobileNestedDropdown key={item.label} item={item} onClose={onClose} />
                            ) : (
                              <Link
                                key={item.label}
                                to={item.to}
                                onClick={onClose}
                                className="block rounded-lg px-3.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt hover:text-primary"
                              >
                                {item.label}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-2xl border border-border p-3.5 text-sm font-extrabold transition-colors shadow-xs',
                        isActive ? 'bg-primary text-white border-primary' : 'bg-surface-alt/70 text-text hover:bg-surface-alt'
                      )
                    }
                    end={link.to === '/'}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} />
                  </NavLink>
                )
              )}
            </nav>
          </div>

          {/* Quick Sell Action Grid */}
          <div className="mb-5 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/10 p-3.5">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-primary">Quick Sell Options</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/sell/car"
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl bg-surface p-2.5 text-xs font-bold text-text border border-border shadow-2xs hover:border-primary/50"
              >
                <PlusCircle size={15} className="text-primary" />
                <span>Sell Car</span>
              </Link>
              <Link
                to="/sell/properties"
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl bg-surface p-2.5 text-xs font-bold text-text border border-border shadow-2xs hover:border-primary/50"
              >
                <PlusCircle size={15} className="text-primary" />
                <span>Sell Property</span>
              </Link>
              <Link
                to="/sell/electronics"
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl bg-surface p-2.5 text-xs font-bold text-text border border-border shadow-2xs hover:border-primary/50"
              >
                <PlusCircle size={15} className="text-primary" />
                <span>Sell Gadget</span>
              </Link>
              <Link
                to="/sell/spare-parts"
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl bg-surface p-2.5 text-xs font-bold text-text border border-border shadow-2xs hover:border-primary/50"
              >
                <PlusCircle size={15} className="text-primary" />
                <span>Sell Spare Parts</span>
              </Link>
            </div>
          </div>

          {/* Footer CTAs / Account Section */}
          <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-border">
            {/* Quick user shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-alt p-2.5 text-xs font-bold text-text hover:bg-surface transition-colors"
              >
                <Heart size={15} className="text-primary" />
                <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
              </Link>
              <Link
                to="/notifications"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-alt p-2.5 text-xs font-bold text-text hover:bg-surface transition-colors"
              >
                <Bell size={15} className="text-primary" />
                <span>Alerts {unreadCount > 0 && `(${unreadCount})`}</span>
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-alt p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shadow-xs">
                    {(user?.name || user?.phone || 'U').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-text">{user?.name || (user?.phone ? `+91 ${user.phone}` : 'Account')}</p>
                    <p className="truncate text-[11px] text-text-secondary">{user?.email || user?.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-danger/30 bg-danger/5 py-3 text-xs font-bold text-danger hover:bg-danger/10"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-extrabold text-white shadow-lift hover:bg-primary-dark"
              >
                <User size={18} />
                <span>Login to Your Account</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


function MobileNestedDropdown({ item, onClose }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt hover:text-primary"
      >
        <span>{item.label}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4 border-l border-border/50 ml-3.5 mt-1 flex flex-col gap-1"
          >
            {item.dropdown.map((subItem) => (
              <Link
                key={subItem.label}
                to={subItem.to}
                onClick={onClose}
                className="block rounded-lg py-1.5 px-2 text-[11px] font-medium text-text-secondary hover:text-primary hover:bg-surface-alt"
              >
                {subItem.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
