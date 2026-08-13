import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle2 } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="container-page py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero px-6 py-14 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Mail className="text-white" size={26} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Never miss a great deal</h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Get curated listings, price drops and dealer offers delivered straight to your inbox — weekly, not daily.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-white">
              <CheckCircle2 size={18} aria-hidden="true" />
              <span className="text-sm font-medium">You&rsquo;re subscribed! Check your inbox to confirm.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/50"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Subscribe
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
