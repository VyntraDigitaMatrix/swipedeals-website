import { AnimatePresence, motion } from 'framer-motion'
import { X, GitCompare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../../hooks/useCompare'
import { findItemsByIds } from '../../utils/findItem'
import { formatCurrency } from '../../utils/format'
import Button from '../buttons/Button'

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const navigate = useNavigate()
  const items = findItemsByIds(compareList)

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 shadow-lift backdrop-blur"
        >
          <div className="container-page flex flex-wrap items-center gap-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <GitCompare size={18} className="text-primary" aria-hidden="true" />
              Compare ({items.length}/4)
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-3 overflow-x-auto">
              {items.map((item) => (
                <div key={item.id} className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface-alt px-2.5 py-1.5">
                  <img src={item.images?.[0]} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  <div className="max-w-[120px]">
                    <p className="truncate text-xs font-semibold text-text">{item.title}</p>
                    <p className="text-[11px] text-text-secondary">{formatCurrency(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(item.id)}
                    aria-label={`Remove ${item.title} from compare`}
                    className="ml-1 text-text-light hover:text-danger"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                Clear
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={items.length < 2}
                onClick={() => navigate(`/compare?ids=${compareList.join(',')}`)}
              >
                Compare Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
