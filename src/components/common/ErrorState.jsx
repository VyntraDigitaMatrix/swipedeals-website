import { AlertTriangle } from 'lucide-react'
import Button from '../buttons/Button'

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <AlertTriangle size={28} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  )
}
