import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { faqs as defaultFaqs } from '../../data/faqs'
import { cn } from '../../utils/cn'

export default function FAQ({ items = defaultFaqs, showHeader = true }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null)

  return (
    <section className="container-page py-16 sm:py-20">
      {showHeader && (
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about buying, selling and dealing on SwipeDeals."
          align="center"
        />
      )}

      <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className="px-5 sm:px-6">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm font-semibold text-text sm:text-base">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={cn('shrink-0 text-text-secondary transition-transform duration-300', isOpen && 'rotate-180 text-primary')}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-text-secondary">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
