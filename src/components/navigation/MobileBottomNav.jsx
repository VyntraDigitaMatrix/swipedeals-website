import { NavLink, useNavigate } from 'react-router-dom'
import { CarFront, Home, Laptop, MoreHorizontal, Settings, Building2 } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home, exact: true },
  { label: 'Vehicles', to: '/cars', icon: CarFront },
  { label: 'Properties', to: '/properties', icon: Building2 },
  { label: 'Electronics', to: '/electronics', icon: Laptop },
  { label: 'Parts', to: '/spare-parts', icon: Settings },
]

const MORE_ITEMS = [
  { label: 'Commercial', to: '/commercial-vehicles' },
  { label: 'Challan Check', to: '/challan-payment' },
  { label: 'Finance', to: '/finance' },
  { label: 'Insurance', to: '/insurance' },
  { label: 'Compare', to: '/compare' },
  { label: 'Sell', to: '/sell' },
]

export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* More overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed bottom-[64px] left-0 right-0 z-[60] mx-auto max-w-sm rounded-t-3xl border border-border bg-surface shadow-2xl p-4 xl:hidden"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-secondary px-1">More Categories</p>
              <div className="grid grid-cols-3 gap-2">
                {MORE_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMoreOpen(false)
                      navigate(item.to)
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-alt px-2 py-3 text-[11px] font-semibold text-text transition-colors hover:bg-primary/10 hover:text-primary active:scale-95"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-border bg-surface/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] xl:hidden"
        aria-label="Mobile bottom navigation"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold transition-colors',
                isActive ? 'text-primary' : 'text-text-secondary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                    isActive ? 'bg-primary/10 text-primary scale-110' : 'text-text-secondary'
                  )}
                >
                  <item.icon size={19} />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* More button */}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold transition-colors',
            moreOpen ? 'text-primary' : 'text-text-secondary'
          )}
          aria-label="More categories"
        >
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
              moreOpen ? 'bg-primary/10 text-primary scale-110' : 'text-text-secondary'
            )}
          >
            <MoreHorizontal size={19} />
          </span>
          <span>More</span>
        </button>
      </nav>
    </>
  )
}
