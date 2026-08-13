import { useRef } from 'react'
import { cn } from '../../utils/cn'

/** Six-box OTP entry with auto-advance focus, backspace and paste support. */
export default function OtpInput({ length = 6, value, onChange, error }) {
  const inputsRef = useRef([])
  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const setDigit = (i, char) => {
    const next = digits.slice()
    next[i] = char
    onChange(next.join(''))
  }

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    setDigit(i, char)
    if (char && i < length - 1) inputsRef.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted.padEnd(length, '').slice(0, length).replace(/ /g, ''))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <div>
      <div className="flex gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`OTP digit ${i + 1}`}
            className={cn(
              'h-12 w-11 rounded-xl border border-border bg-surface text-center text-lg font-bold text-text transition-colors',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
              error && 'border-danger focus:border-danger focus:ring-danger/15'
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}
