import { BadgeCheck, LogIn, ShieldCheck } from 'lucide-react'
import Button from '../buttons/Button'

/**
 * Shown in place of a sell form when the visitor isn't logged in, or is
 * logged in but hasn't completed Aadhaar/PAN KYC yet — every category's
 * "add listing" screen renders this instead of its form until both pass.
 * `redirect` is the path to send the seller back to once they're done.
 */
export default function SellAccessGate({ isAuthenticated, redirect }) {
  const encodedRedirect = encodeURIComponent(redirect)

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LogIn size={28} aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-text">Log in to start selling</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Create a free account with just your mobile number to list an item on SwipeDeals.
        </p>
        <Button to={`/login?redirect=${encodedRedirect}`} variant="primary" className="mt-6">
          Log In / Sign Up
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <ShieldCheck size={28} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold text-text">Complete your KYC to sell</h1>
      <p className="mt-2 text-sm text-text-secondary">
        To keep SwipeDeals safe for buyers, every seller must verify their identity with Aadhaar &amp; PAN before
        listing a product &mdash; it only takes a minute.
      </p>
      <Button to={`/kyc?redirect=${encodedRedirect}`} variant="primary" icon={BadgeCheck} className="mt-6">
        Complete KYC
      </Button>
    </div>
  )
}
