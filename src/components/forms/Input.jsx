import { forwardRef, useId } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, iconRight: IconRight, className, containerClassName, id, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light">
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-light transition-colors',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
            Icon && 'pl-10',
            IconRight && 'pr-10',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {IconRight && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light">
            <IconRight size={17} aria-hidden="true" />
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
