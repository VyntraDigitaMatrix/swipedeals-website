import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Rating from './Rating'
import SectionHeader from './SectionHeader'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Testimonials"
        title="Loved by buyers & sellers alike"
        description="Real stories from people who found their next car, home or gadget on SwipeDeals."
        align="center"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="relative flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <Quote className="mb-3 text-accent" size={28} aria-hidden="true" />
            <blockquote className="flex-1 text-sm leading-relaxed text-text-secondary">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" loading="lazy" />
              <div>
                <p className="text-sm font-bold text-text">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
              <Rating value={t.rating} showValue={false} size={12} className="ml-auto" />
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
