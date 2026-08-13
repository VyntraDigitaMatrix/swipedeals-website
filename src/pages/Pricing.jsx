import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Check, HelpCircle, Sparkles, Store, Users2 } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import SectionHeader from '../components/common/SectionHeader'
import Button from '../components/buttons/Button'
import FAQ from '../components/common/FAQ'
import { plans } from '../data/plans'
import { formatCurrencyFull } from '../utils/format'
import { cn } from '../utils/cn'

const PRICING_FAQS = [
  { id: 'pf1', question: 'Do individual sellers need to pay?', answer: 'No. If you’re listing a single item as an individual seller, posting is always free — your listing just goes through a quick admin review before it goes live.' },
  { id: 'pf2', question: 'Who needs a paid plan?', answer: 'Dealers and bulk sellers who want to list multiple products, get a public storefront page, and receive qualified leads at scale need to choose a plan.' },
  { id: 'pf3', question: 'What do I get with a storefront page?', answer: 'Growth and Enterprise plans include a branded public page at swipedeals.com/yourdealername showcasing your full catalog across every category you sell in.' },
  { id: 'pf4', question: 'How fast is approval after payment?', answer: 'Our admin team verifies your business details and reviews your plan payment within 24 hours. You’ll get a confirmation once your dealer account is live.' },
  { id: 'pf5', question: 'Can I upgrade my plan later?', answer: 'Yes, you can upgrade or downgrade your plan at any time from your dealer dashboard as your inventory grows.' },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-hero py-16 sm:py-24">
        <div className="container-page relative text-center">
          <Breadcrumb items={[{ label: 'Pricing' }]} />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-5xl"
          >
            Simple pricing for dealers &amp; bulk sellers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-sm text-white/80 sm:text-base"
          >
            Selling a single item? That&rsquo;s always free. These plans are for dealers who want bulk listings, a
            branded storefront, and qualified leads delivered straight to them.
          </motion.p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-surface p-7 shadow-soft',
                plan.popular ? 'border-2 border-primary shadow-lift lg:-translate-y-2' : 'border-border'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-primary px-3.5 py-1 text-[11px] font-bold text-white shadow-lift">
                  <Sparkles size={12} aria-hidden="true" /> Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-text">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-text">{formatCurrencyFull(plan.price)}</span>
                <span className="text-sm text-text-secondary">/month</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                {typeof plan.listingCap === 'number' ? `Up to ${plan.listingCap} active listings` : `${plan.listingCap} active listings`}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate(`/sell/car/dealer?plan=${plan.id}`)}
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
                className="mt-7"
              >
                Choose {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-text-secondary">
          <HelpCircle size={13} aria-hidden="true" /> Selling just one item? <a href="/sell/car" className="font-semibold text-primary hover:underline">List it free as an individual seller</a> instead.
        </p>
      </section>

      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Why go Dealer" title="Built for sellers who move volume" align="center" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Store, title: 'Public Storefront', description: 'A branded page at swipedeals.com/yourname showcasing every listing you publish, across all categories.' },
              { icon: Users2, title: 'Qualified Leads', description: 'Buyers who view your listings get routed straight to your contact details — no middlemen.' },
              { icon: Building2, title: 'Bulk-Ready', description: 'List across cars, commercial vehicles, electronics, spare parts and properties from one dealer account.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-text">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={PRICING_FAQS} />
    </div>
  )
}
