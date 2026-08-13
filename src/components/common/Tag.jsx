import { cn } from '../../utils/cn'

export default function Tag({ children, active = false, onClick, className }) {
  const isInteractive = typeof onClick === 'function'
  const Component = isInteractive ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
      className={cn(
        'inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary',
        isInteractive && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  )
}
