import { useState } from 'react'
import {
  AlertTriangle, Banknote, CheckCircle2, MapPin, Receipt, ShieldCheck, Sparkles,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Badge from '../components/common/Badge'
import Button from '../components/buttons/Button'
import RegNumberInput from '../components/services/RegNumberInput'
import { deriveChallans, isValidRegNumber, normalizeRegNumber } from '../data/vehicleServices'
import { formatCurrencyFull } from '../utils/format'

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Receipt, label: 'Instant Digital Receipt' },
  { icon: CheckCircle2, label: 'Official Challan Records' },
]

export default function ChallanPayment() {
  const [regNumber, setRegNumber] = useState('')
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [challans, setChallans] = useState([])
  const [payingId, setPayingId] = useState(null)
  const [receipts, setReceipts] = useState({})

  const handleCheck = (e) => {
    e.preventDefault()
    if (!isValidRegNumber(regNumber)) {
      setError('Enter a valid registration number, e.g. MH12AB1234.')
      return
    }
    setError('')
    setChallans(deriveChallans(regNumber))
    setSearched(true)
  }

  const payChallan = (id) => {
    setPayingId(id)
    setTimeout(() => {
      setChallans((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Paid' } : c)))
      setReceipts((prev) => ({ ...prev, [id]: `CHLPAY-${Date.now().toString(36).toUpperCase().slice(-8)}` }))
      setPayingId(null)
    }, 900)
  }

  const payAll = () => {
    const pending = challans.filter((c) => c.status === 'Pending')
    setPayingId('all')
    setTimeout(() => {
      const newReceipts = {}
      pending.forEach((c) => { newReceipts[c.id] = `CHLPAY-${Date.now().toString(36).toUpperCase().slice(-8)}` })
      setChallans((prev) => prev.map((c) => (c.status === 'Pending' ? { ...c, status: 'Paid' } : c)))
      setReceipts((prev) => ({ ...prev, ...newReceipts }))
      setPayingId(null)
    }, 1100)
  }

  const pending = challans.filter((c) => c.status === 'Pending')
  const pendingTotal = pending.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Vehicle Services', to: '/' }, { label: 'Challan Payment' }]} />

      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-4 py-1.5 text-xs font-bold text-danger">
          <AlertTriangle size={13} aria-hidden="true" /> Check &amp; Pay in Seconds
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">Check &amp; pay traffic challans</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Enter your vehicle&rsquo;s registration number to instantly check for pending e-challans and clear them
          online — no queues, no paperwork.
        </p>
      </div>

      <form onSubmit={handleCheck} className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <RegNumberInput value={regNumber} onChange={setRegNumber} error={error} />
        <Button type="submit" variant="primary" size="lg" fullWidth className="mt-5">
          Check Challans
        </Button>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border pt-5">
          {TRUST_POINTS.map((point) => (
            <span key={point.label} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <point.icon size={14} className="text-success" aria-hidden="true" />
              {point.label}
            </span>
          ))}
        </div>
      </form>

      {searched && (
        <div className="mx-auto mt-10 max-w-2xl">
          {challans.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-success/30 bg-success/5 p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <ShieldCheck size={30} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-text">No pending challans found</h2>
              <p className="mt-1.5 max-w-sm text-sm text-text-secondary">
                Great news! <span className="font-semibold text-text">{normalizeRegNumber(regNumber)}</span> has a
                clean challan record as of today.
              </p>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-danger/25 bg-danger/5 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-text">
                      {pending.length} pending challan{pending.length > 1 ? 's' : ''} &middot; {formatCurrencyFull(pendingTotal)} due
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">Pay all at once and get a consolidated receipt.</p>
                  </div>
                  <Button variant="primary" icon={Banknote} loading={payingId === 'all'} onClick={payAll} disabled={payingId !== null}>
                    Pay All ({formatCurrencyFull(pendingTotal)})
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {challans.map((challan) => (
                  <div key={challan.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text">{challan.offense}</p>
                          <Badge variant={challan.status === 'Paid' ? 'success' : 'danger'}>{challan.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">Challan No. {challan.challanNumber} &middot; {challan.date}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-text-light">
                          <MapPin size={12} aria-hidden="true" /> {challan.location}
                        </p>
                        {receipts[challan.id] && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                            <CheckCircle2 size={13} aria-hidden="true" /> Receipt #{receipts[challan.id]}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="mb-2 text-lg font-extrabold text-text">{formatCurrencyFull(challan.amount)}</p>
                        {challan.status === 'Pending' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => payChallan(challan.id)}
                            disabled={payingId !== null}
                            loading={payingId === challan.id}
                            icon={Banknote}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!searched && (
        <div className="mx-auto mt-10 flex max-w-xl items-start gap-3 rounded-xl border border-info/25 bg-info/5 p-4 text-xs text-text-secondary">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          This is a demo lookup — results are simulated for illustration and no real government or payment
          systems are contacted.
        </div>
      )}
    </div>
  )
}
