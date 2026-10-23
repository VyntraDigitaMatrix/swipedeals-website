import { X, AlertCircle } from 'lucide-react'
import Button from '../buttons/Button'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  variant = 'danger',
  isLoading = false 
}) {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger': return 'bg-danger text-white hover:bg-danger/90'
      case 'success': return 'bg-success text-white hover:bg-success/90'
      case 'warning': return 'bg-warning text-white hover:bg-warning/90'
      case 'primary': return 'bg-primary text-white hover:bg-primary/90'
      default: return 'bg-primary text-white hover:bg-primary/90'
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'danger': return 'text-danger bg-danger/10'
      case 'success': return 'text-success bg-success/10'
      case 'warning': return 'text-warning bg-warning/10'
      case 'primary': return 'text-primary bg-primary/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md animate-scale-up rounded-2xl bg-surface p-6 shadow-xl">
        <button
          onClick={!isLoading ? onClose : undefined}
          className="absolute right-4 top-4 rounded-full p-1 text-text-light transition-colors hover:bg-surface-alt hover:text-text"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${getIconStyles()}`}>
            <AlertCircle size={28} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-text">{title}</h3>
          <p className="text-sm text-text-secondary">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold shadow-soft transition-all ${getVariantStyles()} disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
