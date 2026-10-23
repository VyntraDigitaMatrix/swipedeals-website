import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Receipt,
  ShieldCheck,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import RegNumberInput from '../components/services/RegNumberInput'
import { isValidRegNumber, normalizeRegNumber } from '../data/vehicleServices'

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Receipt, label: 'Instant Digital Receipt' },
  { icon: CheckCircle2, label: 'Official Challan Records' },
]

export default function ChallanPayment() {
  const navigate = useNavigate()
  const [regNumber, setRegNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLookup = (e) => {
    e?.preventDefault()
    if (!regNumber.trim()) {
      setError('Enter a vehicle registration number, e.g. AP16BK1000.')
      return
    }
    if (!isValidRegNumber(regNumber)) {
      setError('Enter a valid registration number format, e.g. AP16BK1000 or MH12AB1234.')
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      const cleanReg = normalizeRegNumber(regNumber)
      setIsLoading(false)
      navigate(`/challan-payment/${cleanReg}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 350)
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white py-8 sm:py-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container-page">
        <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'Challan Payment' }]} />

        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-4 py-1.5 text-xs font-bold text-danger">
            <AlertTriangle size={13} aria-hidden="true" /> Check &amp; Pay in Seconds
          </span>
          <h1 className="text-2xl font-bold text-text sm:text-4xl">Check &amp; pay traffic challans</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-[14px]">
            Enter your vehicle&rsquo;s registration number to instantly check for pending e-challans and clear them
            online — no queues, no paperwork.
          </p>
        </div>

        <form
          onSubmit={handleLookup}
          className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
        >
          <RegNumberInput
            value={regNumber}
            onChange={setRegNumber}
            error={error}
            label="Vehicle Registration Number"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-xl bg-[#E11D27] hover:bg-[#C8101E] active:scale-[0.99] text-white py-3.5 px-6 font-bold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Check Challans</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Quick Sample Helper Chip */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
            <span>Try sample vehicle:</span>
            <button
              type="button"
              onClick={() => {
                setRegNumber('AP16BK1000')
                setError('')
              }}
              className="font-bold text-[#E11D27] hover:underline cursor-pointer"
            >
              AP 16 BK 1000
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border pt-5">
            {TRUST_POINTS.map((point) => (
              <span key={point.label} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                <point.icon size={14} className="text-success" aria-hidden="true" />
                {point.label}
              </span>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}
