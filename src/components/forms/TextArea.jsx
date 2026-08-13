import { forwardRef, useId } from 'react'
import { cn } from '../../utils/cn'

const TextArea = forwardRef(function TextArea({ label, error, hint, className, containerClassName, id, rows = 4, ...props }, ref) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-light transition-colors',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
    </div>
  )
})

export default TextArea
