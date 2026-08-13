import { motion } from 'framer-motion'
import { BadgeCheck, ChevronRight, HandCoins, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import Button from '../buttons/Button'
import heroImage from '../../assets/heroimage.png'

const trustPoints = [
  { icon: ShieldCheck, label: 'Verified Dealers Only' },
  { icon: BadgeCheck, label: '200-Point Inspection' },
  { icon: TrendingUp, label: 'Best Market Price' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-20 lg:py-24">
      {/* Light maroon accent shapes — diagonal wedge + soft glows, no dark overlay */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 top-0 h-full w-[55%] -skew-x-12 bg-gradient-to-b from-primary/[0.06] via-primary/[0.03] to-transparent" />
        <div className="absolute right-[8%] top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[28%] bottom-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles size={13} aria-hidden="true" />
            India&rsquo;s Fastest Growing Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="leading-[1.1] tracking-tight text-text"
          >
            <span className="block text-xl font-semibold text-text-secondary sm:text-2xl">Your Next Big Deal Is Just A</span>
            <span className="block text-5xl font-extrabold text-primary sm:text-6xl lg:text-[4rem]">Swipe Away.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base"
          >
            From cars and commercial vehicles to properties, electronics and spare parts — swipe through
            thousands of verified listings from trusted dealers across India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col"
          >
            {trustPoints.map((point, i) => (
              <div key={point.label} className={i > 0 ? 'mt-4 border-t border-border pt-4' : ''}>
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary">
                    <point.icon size={19} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-text sm:text-[15px]">{point.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button to="/cars" variant="primary" size="lg" iconRight={ChevronRight}>
              Buy a Car
            </Button>
            <Button to="/sell" variant="secondary" size="lg" icon={HandCoins}>
              Sell a Car
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <img
            src={heroImage}
            alt="SwipeDeals — cars, electronics, spare parts & properties"
            className="mx-auto w-full max-w-2xl origin-right scale-125 drop-shadow-2xl"
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  )
}
