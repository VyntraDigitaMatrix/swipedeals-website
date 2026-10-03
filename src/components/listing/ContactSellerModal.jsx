import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '../buttons/Button'
import { leadService } from '../../services/leadService'

export default function ContactSellerModal({ isOpen, onClose, productSlug, productType = 'VEHICLE' }) {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await leadService.createLead({
        ...formData,
        productSlug,
        productType,
      })
      setSuccess(true)
      setFormData({ name: '', mobileNumber: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit your contact request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface p-6 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text">Contact Seller</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text"
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle size={32} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">Request Sent!</h3>
              <p className="mb-6 text-sm text-text-secondary">
                The seller has received your contact request and will get back to you shortly.
              </p>
              <Button variant="primary" fullWidth onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-danger/10 p-4 text-sm font-medium text-danger">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-sm font-semibold text-text">
                  Your Name
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="lead-mobile" className="mb-1.5 block text-sm font-semibold text-text">
                  Mobile Number
                </label>
                <input
                  id="lead-mobile"
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="e.g. 9876543210"
                  pattern="[0-9]{10}"
                  className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="lead-message" className="mb-1.5 block text-sm font-semibold text-text">
                  Message (Optional)
                </label>
                <textarea
                  id="lead-message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="I am interested in this listing..."
                  className="w-full resize-none rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth loading={loading} icon={Send}>
                  Send Request
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
