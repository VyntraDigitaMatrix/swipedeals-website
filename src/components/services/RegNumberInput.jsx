import { CarFront } from 'lucide-react'
import Input from '../forms/Input'
import { normalizeRegNumber } from '../../data/vehicleServices'

/** Shared Indian vehicle registration-number input — auto-uppercase, format hint. */
export default function RegNumberInput({ value, onChange, error, label = 'Vehicle Registration Number' }) {
  return (
    <Input
      label={label}
      icon={CarFront}
      placeholder="e.g. MH12AB1234"
      value={value}
      onChange={(e) => onChange(normalizeRegNumber(e.target.value).slice(0, 10))}
      error={error}
      hint={!error ? 'Enter without spaces or dashes — e.g. MH12AB1234' : undefined}
      className="uppercase tracking-wider"
      maxLength={10}
      required
    />
  )
}
