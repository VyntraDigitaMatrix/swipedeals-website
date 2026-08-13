import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { CreditCard, IdCard, Info, ShieldCheck, User, UserCheck } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'
import SellAccessGate from '../components/common/SellAccessGate'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'

// Groups Aadhaar digits into "1234 5678 9012" as the user types.
function formatAadhar(value) {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export default function Kyc() {
  const { user, isAuthenticated } = useAuth()
  const { kyc, isKycVerified, submitKyc } = useKyc()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/sell'

  const [loading, setLoading] = useState(false)
  const [justVerified, setJustVerified] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: user?.name || '',
    aadharNumber: '',
    panNumber: '',
    consent: false,
  })

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  if (!isAuthenticated) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'KYC Verification' }]} />
        <SellAccessGate isAuthenticated={false} redirect={location.pathname + location.search} />
      </div>
    )
  }

  const nameValid = form.fullName.trim().length > 2
  const aadharDigits = form.aadharNumber.replace(/\D/g, '')
  const aadharValid = /^\d{12}$/.test(aadharDigits)
  const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber)
  const canSubmit = nameValid && aadharValid && panValid && form.consent

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) {
      setError('Please fill in every field correctly and accept the declaration to continue.')
      return
    }
    setError('')
    setLoading(true)
    // No real UIDAI/NSDL backend here — a correctly-formatted submission is
    // "verified" instantly, after a short simulated check for realism.
    setTimeout(() => {
      submitKyc({ fullName: form.fullName.trim(), aadharNumber: aadharDigits, panNumber: form.panNumber })
      setLoading(false)
      setJustVerified(true)
    }, 1000)
  }

  if (isKycVerified) {
    const maskedAadhar = kyc?.aadharNumber ? `XXXX XXXX ${kyc.aadharNumber.slice(-4)}` : ''
    const maskedPan = kyc?.panNumber ? `${kyc.panNumber.slice(0, 2)}XXXXX${kyc.panNumber.slice(-2)}` : ''

    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'KYC Verification' }]} />
        <SuccessScreen
          title={justVerified ? 'KYC Verified!' : "You're already KYC verified"}
          description={
            justVerified
              ? "Your identity has been verified. You're all set to list products in any category on SwipeDeals."
              : 'Your Aadhaar & PAN are on file and verified — you can list products in any category any time.'
          }
          actions={[{ label: 'Continue Selling', to: redirectTo }, { label: 'Go to Dashboard', to: '/dashboard', variant: 'outline' }]}
        >
          <div className="rounded-xl border border-border bg-surface-alt/60 p-4 text-left text-sm">
            <p className="flex items-center gap-2 font-semibold text-text">
              <ShieldCheck size={15} className="text-success" aria-hidden="true" /> Verified Details
            </p>
            <div className="mt-2 space-y-1 text-xs text-text-secondary">
              <p>Name: <span className="font-semibold text-text">{kyc?.fullName}</span></p>
              <p>Aadhaar: <span className="font-mono font-semibold text-text">{maskedAadhar}</span></p>
              <p>PAN: <span className="font-mono font-semibold text-text">{maskedPan}</span></p>
            </div>
          </div>
        </SuccessScreen>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'KYC Verification' }]} />

      <div className="mb-8 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-info/10 px-4 py-1.5 text-xs font-bold text-info">
          <ShieldCheck size={13} aria-hidden="true" /> Required to Sell
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Verify your identity</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
          To keep buyers safe from fraud and fake listings, every seller on SwipeDeals must complete a one-time
          Aadhaar &amp; PAN KYC check before listing a car, property, electronics or spare part.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="mb-1 text-lg font-bold text-text">Identity details</h2>
        <p className="mb-6 text-xs text-text-secondary">
          This is a demo &mdash; there's no live UIDAI/NSDL check. Any correctly formatted Aadhaar &amp; PAN is
          accepted and verified instantly.
        </p>

        <div className="space-y-5">
          <Input
            label="Full Name (as per PAN card)"
            icon={User}
            placeholder="e.g. Rohan Mehta"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
          <Input
            label="Aadhaar Number"
            icon={IdCard}
            inputMode="numeric"
            placeholder="1234 5678 9012"
            maxLength={14}
            value={form.aadharNumber}
            onChange={(e) => update('aadharNumber', formatAadhar(e.target.value))}
            hint="12-digit number, exactly as printed on your Aadhaar card."
          />
          <Input
            label="PAN Number"
            icon={CreditCard}
            placeholder="ABCDE1234F"
            maxLength={10}
            value={form.panNumber}
            onChange={(e) => update('panNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
            hint="10-character PAN, e.g. ABCDE1234F."
          />

          <label className="flex items-start gap-2.5 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update('consent', e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#6E0D25]"
            />
            I confirm the details above are correct and belong to me, and I consent to SwipeDeals using them to
            verify my identity as a seller.
          </label>

          {error && <p className="text-xs font-medium text-danger">{error}</p>}
        </div>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-info/30 bg-info/5 p-3.5 text-xs text-text-secondary">
          <Info size={15} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          <span>Your documents are used only for identity verification and are never shown publicly on your listings.</span>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth icon={UserCheck} loading={loading} disabled={!canSubmit} className="mt-7">
          Verify &amp; Continue
        </Button>
      </form>
    </div>
  )
}
