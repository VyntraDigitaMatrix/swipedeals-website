import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Button from '../buttons/Button'

/**
 * Shared "submitted successfully" state used by the various sell/apply forms.
 * `actions` = [{ label, to, variant }]
 */
export default function SuccessScreen({ title, description, actions = [], children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-lg flex-col items-center py-16 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 size={40} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-extrabold text-text sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
      {children && <div className="mt-6 w-full">{children}</div>}
      {actions.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {actions.map((a) => (
            <Button key={a.label} to={a.to} variant={a.variant || 'primary'}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
