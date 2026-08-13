import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StatCard({ label, value, change, icon: Icon, index = 0 }) {
  const positive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
        {change !== undefined && (
          <span className={cn('flex items-center gap-0.5 text-xs font-bold', positive ? 'text-success' : 'text-danger')}>
            {positive ? <ArrowUpRight size={13} aria-hidden="true" /> : <ArrowDownRight size={13} aria-hidden="true" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-extrabold text-text">{value}</p>
      <p className="mt-1 text-xs font-medium text-text-secondary">{label}</p>
    </motion.div>
  )
}
