import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../buttons/Button'
import { cn } from '../../utils/cn'

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  actionTo,
  className,
}) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        {eyebrow && (
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{description}</p>}
      </motion.div>

      {action && actionTo && (
        <Button to={actionTo} variant="outline" iconRight={ArrowRight} className="shrink-0">
          {action}
        </Button>
      )}
    </div>
  )
}
