import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'

// Literal class names so Tailwind's scanner can find them (dynamic
// `bg-${color}` strings would be invisible to the JIT compiler).
const ICON_BG = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const GLOW_BG = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const TEXT_COLOR = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

export default function CategoryCard({ category, index = 0 }) {
  const Icon = Icons[category.icon] || Icons.LayoutGrid
  const iconBg = ICON_BG[category.color] || ICON_BG.primary
  const glowBg = GLOW_BG[category.color] || GLOW_BG.primary
  const textColor = TEXT_COLOR[category.color] || TEXT_COLOR.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="h-full"
    >
      <Link
        to={category.link}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift sm:p-7"
      >
        <div
          className={cn(
            'pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full opacity-[0.08] blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-[0.16]',
            glowBg
          )}
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between">
          <span
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lift transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110',
              iconBg
            )}
          >
            <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-text-light transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>

        <div className="relative mt-6 flex-1">
          <h3 className="text-lg font-bold text-text sm:text-xl">{category.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{category.description}</p>
        </div>

        <div className="relative mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-semibold text-text-secondary">{category.listings} listings</span>
          <span className={cn('flex items-center gap-1 text-xs font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100', textColor)}>
            Explore
            <ArrowUpRight size={12} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
