import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-gradient-primary text-white shadow-lift hover:brightness-110 active:scale-[0.98]',
  secondary: 'bg-surface text-primary border border-primary/20 hover:bg-primary/5 active:scale-[0.98]',
  outline: 'bg-transparent text-text border border-border hover:border-primary hover:text-primary active:scale-[0.98]',
  ghost: 'bg-transparent text-text hover:bg-surface-alt active:scale-[0.98]',
  glass: 'glass text-white hover:bg-white/20 active:scale-[0.98]',
  danger: 'bg-danger text-white hover:brightness-110 active:scale-[0.98]',
}

const SIZES = {
  sm: 'text-sm px-3.5 py-2 gap-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-xl',
  icon: 'p-2.5 rounded-full',
}

/**
 * Reusable Button. Renders a <Link> when `to` is passed, an <a> when `href`
 * is passed, otherwise a <button>. Supports variants, sizes, icons & loading.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    to,
    href,
    fullWidth = false,
    ...props
  },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out whitespace-nowrap select-none',
    'disabled:opacity-50 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {!loading && Icon && <Icon size={size === 'lg' ? 20 : 17} aria-hidden="true" />}
      {children}
      {!loading && IconRight && <IconRight size={size === 'lg' ? 20 : 17} aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
})

export default Button
