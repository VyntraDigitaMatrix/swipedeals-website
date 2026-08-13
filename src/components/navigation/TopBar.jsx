import { Link } from 'react-router-dom'
import { CarFront, Home, Laptop, Mail, Phone, Settings, Sparkles, Truck } from 'lucide-react'

const contactDetails = [
  { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'support@swipedeals.in', href: 'mailto:support@swipedeals.in' },
]

const quickCategories = [
  { icon: CarFront, label: 'Cars', to: '/cars' },
  { icon: Truck, label: 'Commercial', to: '/commercial-vehicles' },
  { icon: Laptop, label: 'Electronics', to: '/electronics' },
  { icon: Settings, label: 'Spare Parts', to: '/spare-parts' },
  { icon: Home, label: 'Properties', to: '/properties' },
]

// Sleek, refined utility bar with support helpline, trust badge, and category quick links
export default function TopBar() {
  return (
    <div className="hidden bg-slate-950 text-slate-300 border-b border-slate-800/80 sm:block select-none">
      <div className="container-page flex h-9 items-center justify-between gap-4 text-xs font-medium">
        {/* Left Side: Trust Ticker Tag */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={11} className="shrink-0 text-emerald-400" aria-hidden="true" />
            200-Point Inspected Cars • Verified Direct Deals
          </span>
        </div>

        {/* Right Side: Support & Quick Category Navigation */}
        <div className="flex items-center gap-5">
          {/* Quick Categories */}
          <div className="hidden md:flex items-center gap-1">
            {quickCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors text-[11px]"
              >
                <cat.icon size={12} className="shrink-0 text-slate-400" aria-hidden="true" />
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-3 border-l border-slate-800/80 pl-4">
            {contactDetails.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <item.icon size={12} className="text-slate-400 shrink-0" aria-hidden="true" />
                <span className="text-[11px]">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
