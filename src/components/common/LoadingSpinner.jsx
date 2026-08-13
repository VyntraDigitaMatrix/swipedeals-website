import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LoadingSpinner({ size = 28, label = 'Loading', className, fullPage = false }) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-primary', className)}>
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
    </div>
  )

  if (fullPage) {
    return <div className="flex min-h-[50vh] w-full items-center justify-center">{spinner}</div>
  }

  return spinner
}
