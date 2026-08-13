import { motion } from 'framer-motion'
import { Apple, PlayCircle, Star } from 'lucide-react'

export default function AppBanner() {
  return (
    <section className="container-page py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-text px-6 py-14 sm:px-14"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
              <Star size={13} className="text-warning" fill="currentColor" aria-hidden="true" /> Rated 4.8 by 90,000+ users
            </span>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Get the SwipeDeals app for a faster experience
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Instant alerts on price drops, in-app chat with dealers, and one-tap listing uploads — all from your pocket.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#"
                className="flex items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-text transition-transform hover:scale-[1.03]"
              >
                <Apple size={20} aria-hidden="true" />
                App Store
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                <PlayCircle size={20} aria-hidden="true" />
                Google Play
              </a>
            </div>
          </div>

          <div className="relative mx-auto hidden w-56 sm:block">
            <div className="aspect-[9/18] w-full rounded-[2.2rem] border-8 border-white/10 bg-gradient-hero p-3 shadow-lift">
              <div className="h-full w-full overflow-hidden rounded-[1.4rem] bg-surface">
                <img
                  src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=400&q=80"
                  alt="SwipeDeals mobile app preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
