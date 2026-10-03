import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'

const ACCENT = {
  primary: { bar: 'bg-primary', chip: 'bg-primary/10 text-primary' },
  success: { bar: 'bg-success', chip: 'bg-success/10 text-success' },
  warning: { bar: 'bg-warning', chip: 'bg-warning/10 text-warning' },
  danger: { bar: 'bg-danger', chip: 'bg-danger/10 text-danger' },
}

// Ledger-style tile: tabular mono figure reads like an entry in a manifest,
// top accent bar ties each stat to its tab color-coding elsewhere on the page.
export default function StatCard({ label, value, change, icon: Icon, index = 0, accent = 'primary' }) {
  const positive = change >= 0
  const a = ACCENT[accent] || ACCENT.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <span className={cn('absolute inset-x-0 top-0 h-1', a.bar)} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', a.chip)}>
          <Icon size={20} aria-hidden="true" />
        </span>
        {change !== undefined && (
          <span className={cn('flex items-center gap-0.5 font-mono text-xs font-bold tabular-nums', positive ? 'text-success' : 'text-danger')}>
            {positive ? <ArrowUpRight size={13} aria-hidden="true" /> : <ArrowDownRight size={13} aria-hidden="true" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-3xl font-extrabold tabular-nums tracking-tight text-text">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-text-secondary">{label}</p>
    </motion.div>
  )
}