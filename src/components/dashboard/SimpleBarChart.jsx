import { motion } from 'framer-motion'

// Value chips sit above every bar (not just on desktop) so the chart reads
// on its own without hovering — closer to a printed ledger than a live dashboard widget.
export default function SimpleBarChart({ data, title, subtitle }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          {subtitle && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">{subtitle}</p>}
          {title && <h3 className="text-sm font-bold text-text">{title}</h3>}
        </div>
        <p className="font-mono text-lg font-extrabold tabular-nums text-primary">{total}</p>
      </div>
      <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-mono text-[11px] font-bold tabular-nums text-text-secondary">{d.value}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
              className="w-full max-w-9 rounded-t-lg bg-gradient-primary transition-opacity hover:opacity-80"
              style={{ minHeight: 4 }}
            />
            <span className="text-[10px] font-medium text-text-secondary">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}