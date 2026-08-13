import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import SectionHeader from './SectionHeader'
import { howItWorks } from '../../data/stats'

export default function HowItWorks() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Simple Process"
        title="How SwipeDeals works"
        description="From discovery to doorstep — buying and selling has never been this smooth."
        align="center"
      />

      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-border lg:block" aria-hidden="true" />
        {howItWorks.map((step, i) => {
          const Icon = Icons[step.icon] || Icons.Sparkles
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-lift">
                <Icon size={26} aria-hidden="true" />
              </div>
              <span className="mb-2 text-xs font-bold text-secondary">STEP {step.step}</span>
              <h3 className="text-base font-bold text-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
