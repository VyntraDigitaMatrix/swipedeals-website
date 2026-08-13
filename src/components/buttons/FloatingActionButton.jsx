import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrollPosition } from '../../hooks/useScrollPosition'

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrollPosition(400)

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            className="flex flex-col items-end gap-3"
          >
            {scrolled && (
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text shadow-card transition-transform hover:scale-105"
              >
                <ArrowUp size={20} aria-hidden="true" />
              </button>
            )}
            <Link
              to="/contact"
              aria-label="Chat with support"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white shadow-lift transition-transform hover:scale-105"
            >
              <MessageCircle size={20} aria-hidden="true" />
            </Link>
            <Link
              to="/sell"
              aria-label="Sell a product"
              className="flex items-center gap-2 rounded-full bg-text px-4 py-3 text-xs font-bold text-white shadow-lift transition-transform hover:scale-105"
            >
              + Sell Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-lift"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} aria-hidden="true" />
        </motion.span>
      </motion.button>
    </div>
  )
}
