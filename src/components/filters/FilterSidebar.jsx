import { useState } from 'react'
import { ChevronDown, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'

function FilterGroup({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-bold text-text"
      >
        {title}
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  )
}

function CheckboxRow({ label, checked, onChange, count }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-text-secondary transition-colors hover:text-text">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 shrink-0 rounded border-border text-primary accent-[#6E0D25] focus:ring-primary/30"
        />
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-text-light">{count}</span>}
    </label>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 py-1">
      <span>
        <span className="block text-sm font-medium text-text">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-text-secondary">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-border transition-colors peer-checked:bg-primary" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  )
}

/**
 * Generic filter sidebar.
 * `groups` = [{ key, title, options: [{value,label,count}] }]
 * `priceRange` = { min, max, value:[min,max], onChange, presets?: [{label,value:[min,max]}] }
 * `toggles` = [{ key, label, description?, checked, onChange }]
 */
export default function FilterSidebar({ groups = [], values, onToggle, priceRange, toggles = [], onClear, resultCount }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeChips = [
    ...groups.flatMap((g) => (values[g.key] || []).map((v) => ({ key: g.key, value: v, label: g.options.find((o) => o.value === v)?.label || v }))),
    ...(priceRange && (priceRange.value[0] !== priceRange.min || priceRange.value[1] !== priceRange.max)
      ? [{ key: '__price', value: '__price', label: `${formatCurrency(priceRange.value[0])} – ${formatCurrency(priceRange.value[1])}` }]
      : []),
    ...toggles.filter((t) => t.checked).map((t) => ({ key: t.key, value: t.key, label: t.label })),
  ]
  const activeCount = activeChips.length

  const content = (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-text">
          <SlidersHorizontal size={16} className="text-primary" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </h3>
        <button type="button" onClick={onClear} className="flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-primary">
          <RotateCcw size={12} aria-hidden="true" />
          Reset
        </button>
      </div>

      {activeCount > 0 && (
        <div className="mb-1 flex flex-wrap gap-1.5 border-b border-border pb-4">
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => {
                if (chip.key === '__price') priceRange.onChange([priceRange.min, priceRange.max])
                else if (toggles.some((t) => t.key === chip.key)) toggles.find((t) => t.key === chip.key).onChange()
                else onToggle(chip.key, chip.value)
              }}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              {chip.label}
              <X size={11} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {toggles.length > 0 && (
        <FilterGroup title="Quick Filters">
          {toggles.map((t) => (
            <ToggleRow key={t.key} label={t.label} description={t.description} checked={t.checked} onChange={t.onChange} />
          ))}
        </FilterGroup>
      )}

      {priceRange && (
        <FilterGroup title="Price Range">
          {priceRange.presets && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {priceRange.presets.map((preset) => {
                const active = priceRange.value[0] === preset.value[0] && priceRange.value[1] === preset.value[1]
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => priceRange.onChange(preset.value)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                      active ? 'border-primary bg-primary text-white' : 'border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange.value[0]}
              onChange={(e) => priceRange.onChange([Number(e.target.value), priceRange.value[1]])}
              className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs"
              aria-label="Minimum price"
            />
            <span className="text-text-light">&mdash;</span>
            <input
              type="number"
              value={priceRange.value[1]}
              onChange={(e) => priceRange.onChange([priceRange.value[0], Number(e.target.value)])}
              className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs"
              aria-label="Maximum price"
            />
          </div>
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={priceRange.value[1]}
            onChange={(e) => priceRange.onChange([priceRange.value[0], Number(e.target.value)])}
            className="mt-3 w-full accent-[#6E0D25]"
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-text-light">
            <span>{formatCurrency(priceRange.min)}</span>
            <span>{formatCurrency(priceRange.max)}+</span>
          </div>
        </FilterGroup>
      )}

      {groups.map((group) => (
        <FilterGroup key={group.key} title={group.title}>
          {group.options.map((opt) => (
            <CheckboxRow
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={values[group.key]?.includes(opt.value) || false}
              onChange={() => onToggle(group.key, opt.value)}
            />
          ))}
        </FilterGroup>
      ))}
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text lg:hidden"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        Filters {activeCount > 0 && `(${activeCount})`}
      </button>

      <aside className="hidden lg:block lg:w-72 lg:shrink-0">{content}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-background p-5 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-text">Filters</h3>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters">
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              {content}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-5 w-full rounded-xl bg-gradient-primary py-3 text-sm font-bold text-white"
              >
                Show {resultCount ?? ''} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
