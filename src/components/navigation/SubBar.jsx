import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Zap,
  ShieldCheck,
  Calculator,
  GitCompare,
  FileText,
  ChevronDown,
  Tag,
} from 'lucide-react'

const QUICK_ACTIONS = [
  { label: 'Under ₹5 Lakhs', to: '/cars?maxPrice=500000', icon: Tag, color: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { label: 'Certified Cars', to: '/cars/used', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { label: 'Electric & EV', to: '/cars?fuel=Electric', icon: Zap, color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { label: 'Car Finance / EMI', to: '/finance', icon: Calculator, color: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100' },
  { label: 'Compare Cars', to: '/cars', icon: GitCompare, color: 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100' },
  { label: 'Check Challan', to: '/challan-payment', icon: FileText, color: 'text-cyan-700 bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
]

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Cars', value: 'cars' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Spare Parts', value: 'spare-parts' },
  { label: 'Properties', value: 'properties' },
]

// Secondary utility header bar positioned directly beneath the main Navbar
export default function SubBar() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    if (category === 'commercial') {
      navigate(`/commercial-vehicles?q=${encodeURIComponent(query.trim())}`)
    } else if (category === 'spare-parts') {
      navigate(`/spare-parts?q=${encodeURIComponent(query.trim())}`)
    } else if (category === 'properties') {
      navigate(`/properties?q=${encodeURIComponent(query.trim())}`)
    } else {
      navigate(`/cars?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-surface-alt/95 backdrop-blur-md shadow-sm select-none">
      <div className="container-page flex flex-col md:flex-row items-center justify-between gap-3 py-2">
        {/* Prominent Search Bar with Category Selector */}
        <form onSubmit={handleSearch} className="flex w-full md:w-auto items-center flex-1 max-w-2xl">
          {/* Category Dropdown Pill */}
          <div className="relative shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none rounded-l-xl border border-r-0 border-border bg-surface py-2 pl-3 pr-7 text-xs font-semibold text-text outline-none focus:border-primary cursor-pointer hover:bg-surface-alt transition-colors"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>

          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search make, model, e.g. Thar, Swift, Creta, EV..."
              className="w-full rounded-r-xl border border-border bg-surface py-2 pl-9 pr-24 text-xs font-medium text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-text-light"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Search size={12} />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Quick Utility Shortcut Action Pills */}
        <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 md:pb-0">
          <span className="hidden xl:inline text-[10px] font-extrabold text-text-secondary uppercase tracking-wider shrink-0">
            Shortcuts:
          </span>
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all hover:scale-105 shadow-2xs ${item.color}`}
            >
              <item.icon size={13} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
