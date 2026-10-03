import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Gavel, Megaphone, ShieldCheck } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Badge from '../components/common/Badge'

const OPTIONS = [
  {
    id: 'post',
    icon: Megaphone,
    badge: 'Most Popular',
    badgeVariant: 'primary',
    title: 'Post Details & Sell It Yourself',
    description: 'List your car in minutes and connect directly with thousands of verified buyers — full control, your price, your timeline. Just like OLX.',
    features: ['Upload photos & set your own price', 'Chat directly with interested buyers', 'No commission on direct sales'],
    cta: 'Create Your Listing',
    to: '/sell?category=cars',
  },
  {
    id: 'dealer',
    icon: Briefcase,
    badge: 'For Businesses',
    badgeVariant: 'info',
    title: 'Join as a Dealer & Sell in Bulk',
    description: 'Register your dealership to list unlimited inventory, access analytics, receive qualified leads and promote your listings.',
    features: ['Unlimited car listings', 'Dealer dashboard & analytics', 'Priority placement & leads'],
    cta: 'Register as Dealer',
    to: '/sell/car/dealer',
  },
  {
    id: 'auction',
    icon: Gavel,
    badge: 'Best Price Discovery',
    badgeVariant: 'warning',
    title: 'Add Your Car to Auctions',
    description: 'List your car in a live auction and let verified dealers compete with bids — a fast way to discover the best possible price.',
    features: ['Verified dealers bid in real time', 'Set your own reserve price', 'Sale closes within 24–72 hours'],
    cta: 'Add to Auction',
    to: '/sell/car/auction',
  },
]

export default function SellCarOptions() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Your Car' }]} />

      <div className="mb-10 text-center">
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">How would you like to sell your car?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Choose the path that works best for you — from a fully assisted, verified sale to listing it yourself or
          reaching dealers directly through an auction.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {OPTIONS.map((option, i) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift sm:p-8"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <option.icon size={24} aria-hidden="true" />
              </span>
              <Badge variant={option.badgeVariant}>{option.badge}</Badge>
            </div>

            <h2 className="text-lg font-bold text-text sm:text-xl">{option.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{option.description}</p>

            <ul className="mt-5 space-y-2">
              {option.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <Button to={option.to} variant="primary" iconRight={ArrowRight} className="mt-6 self-start">
              {option.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
