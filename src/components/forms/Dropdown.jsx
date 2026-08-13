import { useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { cn } from '../../utils/cn'

/**
 * Custom-styled select dropdown (not a native <select>) — used for filters
 * and sort controls where we want full visual control.
 */
export default function Dropdown({ label, value, options, onChange, placeholder = 'Select', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={cn('relative', className)}>
      {label && <label className="mb-1.5 block text-sm font-semibold text-text">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-primary/40"
      >
        <span className={selected ? 'text-text' : 'text-text-light'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={cn('text-text-secondary transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-card"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-alt',
                  opt.value === value ? 'font-semibold text-primary' : 'text-text'
                )}
              >
                {opt.label}
                {opt.value === value && <Check size={14} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
