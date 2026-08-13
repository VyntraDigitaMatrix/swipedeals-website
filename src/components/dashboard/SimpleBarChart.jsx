import { motion } from 'framer-motion'

// Lightweight CSS-only bar chart — avoids pulling in a charting library.
export default function SimpleBarChart({ data, title }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      {title && <h3 className="mb-6 text-sm font-bold text-text">{title}</h3>}
      <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
              className="flex w-full max-w-9 items-end justify-center rounded-t-lg bg-gradient-primary"
              style={{ minHeight: 4 }}
            >
              <span className="mb-1 hidden text-[10px] font-bold text-white sm:block">{d.value}</span>
            </motion.div>
            <span className="text-[10px] font-medium text-text-secondary">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
