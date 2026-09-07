import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { formatCurrencyFull } from '../../utils/format'

/** Interactive EMI / loan calculator for the car details page. */
export default function LoanCalculator({ price }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2))
  const [tenure, setTenure] = useState(60)
  const [rate, setRate] = useState(9.5)

  const loanAmount = Math.max(price - downPayment, 0)

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const monthlyRate = rate / 12 / 100
    if (loanAmount <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 }
    const emiVal =
      monthlyRate === 0
        ? loanAmount / tenure
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    const total = emiVal * tenure
    return { emi: Math.round(emiVal), totalInterest: Math.round(total - loanAmount), totalPayment: Math.round(total) }
  }, [loanAmount, tenure, rate])

  const downPct = Math.round((downPayment / price) * 100)
  const minDown = Math.round(price * 0.1)
  const maxDown = Math.round(price * 0.8)

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-text">
        <Calculator size={18} className="text-primary" aria-hidden="true" />
        EMI Calculator
      </h2>
      <p className="mb-5 text-xs text-text-secondary">Estimate your monthly installment for this car</p>

      <div className="grid gap-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Down Payment</span>
            <span className="font-bold text-text">
              {formatCurrencyFull(downPayment)} <span className="text-text-light">({downPct}%)</span>
            </span>
          </div>
          <input
            type="range"
            min={minDown}
            max={maxDown}
            step={5000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-[#6E0D25]"
            aria-label="Down payment"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Loan Tenure</span>
            <span className="font-bold text-text">{tenure} months</span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-[#6E0D25]"
            aria-label="Loan tenure in months"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Interest Rate (p.a.)</span>
            <span className="font-bold text-text">{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={7}
            max={16}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#6E0D25]"
            aria-label="Interest rate"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-alt/60 text-center">
        <div className="px-2 py-3.5">
          <p className="text-[11px] text-text-secondary">Monthly EMI</p>
          <p className="mt-1 text-base font-extrabold text-primary">{formatCurrencyFull(emi)}</p>
        </div>
        <div className="px-2 py-3.5">
          <p className="text-[11px] text-text-secondary">Total Interest</p>
          <p className="mt-1 text-base font-extrabold text-text">{formatCurrencyFull(totalInterest)}</p>
        </div>
        <div className="px-2 py-3.5">
          <p className="text-[11px] text-text-secondary">Total Payment</p>
          <p className="mt-1 text-base font-extrabold text-text">{formatCurrencyFull(totalPayment)}</p>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-text-light">
        Indicative estimate only. Actual EMI depends on lender, credit profile and processing fees.
      </p>
    </div>
  )
}
