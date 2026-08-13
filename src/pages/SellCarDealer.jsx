import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BarChart3, Briefcase, Building2, Check, Globe, Mail, MapPin, Phone, Star, Users } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Dropdown from '../components/forms/Dropdown'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'
import { useDealerApplications } from '../hooks/useDealerApplications'
import { plans } from '../data/plans'
import { slugify, isSlugTaken } from '../utils/dealerListings'
import { formatCurrencyFull } from '../utils/format'
import { cn } from '../utils/cn'

const PERKS = [
  { icon: Briefcase, title: 'Bulk Listings', description: 'List as many cars as your plan allows, no per-item fees.' },
  { icon: BarChart3, title: 'Dealer Analytics', description: 'Track views, leads and conversion performance in real time.' },
  { icon: Users, title: 'Qualified Leads', description: 'Get matched with serious buyers actively searching in your city.' },
  { icon: Star, title: 'Priority Placement', description: 'Featured badge and higher visibility across search & category pages.' },
]

const VOLUME_OPTIONS = [
  { value: '1-5', label: '1 – 5 cars / month' },
  { value: '6-15', label: '6 – 15 cars / month' },
  { value: '16-50', label: '16 – 50 cars / month' },
  { value: '50+', label: '50+ cars / month' },
]

export default function SellCarDealer() {
  const [searchParams] = useSearchParams()
  const preselectedPlan = plans.some((p) => p.id === searchParams.get('plan')) ? searchParams.get('plan') : 'growth'

  const [submitted, setSubmitted] = useState(false)
  const [slug, setSlug] = useState('')
  const { applications, addApplication } = useDealerApplications()
  const [form, setForm] = useState({ business: '', owner: '', email: '', phone: '', city: '', volume: '', plan: preselectedPlan })
  const [error, setError] = useState('')

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const selectedPlan = plans.find((p) => p.id === form.plan)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.plan) {
      setError('Please choose a plan to continue.')
      return
    }
    setError('')

    let candidateSlug = slugify(form.business)
    let suffix = 2
    while (isSlugTaken(candidateSlug, applications)) {
      candidateSlug = `${slugify(form.business)}-${suffix}`
      suffix += 1
    }

    addApplication({
      businessName: form.business,
      ownerName: form.owner,
      email: form.email,
      phone: form.phone,
      city: form.city,
      volume: form.volume,
      plan: form.plan,
      slug: candidateSlug,
    })
    setSlug(candidateSlug)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-page py-8">
        <SuccessScreen
          title="Application Submitted!"
          description={`Thanks, ${form.owner || 'partner'}! Our team will verify ${form.business || 'your business'} and review your ${selectedPlan?.name || ''} plan payment within 24 hours. You'll get a confirmation on ${form.email || 'your email'} once approved.`}
          actions={[{ label: 'Back to Home', to: '/' }, { label: 'Explore Other Options', to: '/sell/car', variant: 'outline' }]}
        >
          <div className="rounded-xl border border-border bg-surface-alt/60 p-4 text-left text-sm">
            <p className="flex items-center gap-2 font-semibold text-text">
              <Globe size={15} className="text-primary" aria-hidden="true" /> Your storefront (goes live on approval)
            </p>
            <p className="mt-1 font-mono text-xs text-text-secondary">swipedeals.com/{slug}</p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
              <span>{selectedPlan?.name} Plan</span>
              <span className="font-bold text-text">{formatCurrencyFull(selectedPlan?.price)}/mo (mock payment collected)</span>
            </div>
          </div>
        </SuccessScreen>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Sell', to: '/sell' }, { label: 'Sell Your Car', to: '/sell/car' }, { label: 'Become a Dealer' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-info/10 px-4 py-1.5 text-xs font-bold text-info">
          <Briefcase size={13} aria-hidden="true" /> For Businesses & Bulk Sellers
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Join SwipeDeals as a dealer</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Register your dealership to unlock bulk listings, a public storefront page and a steady stream of
          qualified leads. Every application is reviewed by our team before your account goes live.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((perk) => (
          <div key={perk.title} className="rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <perk.icon size={20} aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-text">{perk.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{perk.description}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mb-10 max-w-4xl">
        <h2 className="mb-5 text-center text-lg font-bold text-text">Choose a plan</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => update('plan', plan.id)}
              className={cn(
                'relative flex flex-col rounded-2xl border p-5 text-left transition-colors',
                form.plan === plan.id ? 'border-primary bg-primary/5 shadow-lift' : 'border-border bg-surface hover:border-primary/30'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-text">{plan.name}</p>
                {form.plan === plan.id && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={12} aria-hidden="true" />
                  </span>
                )}
              </div>
              <p className="mt-2 text-xl font-extrabold text-text">
                {formatCurrencyFull(plan.price)}<span className="text-xs font-medium text-text-secondary">/mo</span>
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">{plan.listingCap} listings</p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-text-secondary">
                    <Check size={12} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-center text-xs font-medium text-danger">{error}</p>}
        <p className="mt-4 text-center text-xs text-text-secondary">
          Want the full comparison?{' '}
          <Link to="/pricing" className="font-semibold text-primary hover:underline">
            View all plan details
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-text">Business details</h2>
        <div className="space-y-5">
          <Input label="Business / Dealership Name" icon={Building2} placeholder="e.g. Prestige Motors" value={form.business} onChange={(e) => update('business', e.target.value)} required />
          <Input label="Owner / Contact Person" placeholder="Full name" value={form.owner} onChange={(e) => update('owner', e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email Address" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <Input label="Phone Number" type="tel" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </div>
          <Input label="City" icon={MapPin} placeholder="e.g. Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} required />
          <Dropdown
            label="Estimated Monthly Volume"
            value={form.volume}
            onChange={(v) => update('volume', v)}
            placeholder="Select a range"
            options={VOLUME_OPTIONS}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth icon={Briefcase} className="mt-7">
          Submit Application &amp; Pay {selectedPlan ? formatCurrencyFull(selectedPlan.price) : ''}
        </Button>
        <p className="mt-4 text-center text-xs text-text-secondary">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in to your dealer account
          </Link>
        </p>
      </form>
    </div>
  )
}
