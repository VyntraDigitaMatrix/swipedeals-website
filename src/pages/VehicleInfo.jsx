import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import RegNumberInput from '../components/services/RegNumberInput'
import { isValidRegNumber, normalizeRegNumber } from '../data/vehicleServices'

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Official Parivahan Records' },
  { icon: CheckCircle2, label: '100% Verified Details' },
  { icon: Sparkles, label: 'Instant Digital Report' },
]

export default function VehicleInfo() {
  const navigate = useNavigate()
  const [regNumber, setRegNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLookup = (e) => {
    e?.preventDefault()
    if (!regNumber.trim()) {
      setError('Enter a vehicle registration number, e.g. TS09EK2024.')
      return
    }
    if (!isValidRegNumber(regNumber)) {
      setError('Enter a valid registration number format, e.g. TS09EK2024 or MH12AB1234.')
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      const cleanReg = normalizeRegNumber(regNumber)
      setIsLoading(false)
      navigate(`/rc-status/${cleanReg}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 350)
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white py-8 sm:py-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container-page">
        <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'RC Status' }]} />

        {/* Heading block identical to Challan style */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-4 py-1.5 text-xs font-bold text-danger">
            <FileSearch size={13} aria-hidden="true" /> Parivahan Verified RC
          </span>
          <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Check Vehicle RC Status</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
            Enter your vehicle&rsquo;s registration number to instantly check RC status, ownership history,
            fitness validity, and insurance status — no paperwork.
          </p>
        </div>

        {/* Form Card */}
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
                <span>Get RC Details</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Quick Sample Chip */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
            <span>Try sample vehicle:</span>
            <button
              type="button"
              onClick={() => {
                setRegNumber('TS09EK2024')
                setError('')
              }}
              className="font-bold text-[#E11D27] hover:underline cursor-pointer"
            >
              TS 09 EK 2024
            </button>
          </div>

          {/* Trust points */}
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
