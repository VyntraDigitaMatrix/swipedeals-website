import { PackageSearch } from 'lucide-react'
import Button from '../buttons/Button'

export default function EmptyState({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or search terms.',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/60 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={28} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {(actionLabel && (actionTo || onAction)) && (
        <Button to={actionTo} onClick={onAction} variant="primary" size="sm" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
