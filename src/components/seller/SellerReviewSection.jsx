import { useEffect, useState } from 'react'
import { AlertCircle, Check, MessageSquare, Star, Trash2, User } from 'lucide-react'
import Button from '../buttons/Button'
import TextArea from '../forms/TextArea'
import { useAuth } from '../../hooks/useAuth'
import { useSellerReviews } from '../../hooks/useSellerReviews'
import { cn } from '../../utils/cn'

export default function SellerReviewSection({ sellerId, sellerName = 'Seller' }) {
  const { isAuthenticated } = useAuth()
  const {
    reviews,
    myReview,
    totalElements,
    loading,
    submitting,
    error,
    fetchReviews,
    fetchMyReview,
    submitReview,
    removeReview,
  } = useSellerReviews(sellerId)

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (sellerId) {
      fetchReviews()
      if (isAuthenticated) {
        fetchMyReview()
      }
    }
  }, [sellerId, isAuthenticated, fetchReviews, fetchMyReview])

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 5)
      setReviewText(myReview.review || '')
    }
  }, [myReview])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    setSuccessMsg('')
    try {
      await submitReview({ rating, review: reviewText.trim() })
      setSuccessMsg(myReview ? 'Your review was updated successfully!' : 'Thank you! Your review has been published.')
      setIsEditing(false)
    } catch (err) {
      // Error state handled in hook
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return
    setSuccessMsg('')
    try {
      await removeReview()
      setReviewText('')
      setRating(5)
      setIsEditing(false)
      setSuccessMsg('Your review has been removed.')
    } catch (err) {
      // Error state handled in hook
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0'

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-extrabold text-text">Customer Reviews &amp; Ratings</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Verified ratings and feedback for {sellerName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono text-2xl font-black text-text">
            <Star className="fill-warning text-warning" size={24} />
            <span>{avgRating}</span>
          </div>
          <div className="text-xs text-text-secondary">
            <p className="font-bold text-text">{totalElements} Review{totalElements === 1 ? '' : 's'}</p>
            <p className="text-text-light">Overall Rating</p>
          </div>
        </div>
      </div>

      {/* User Review Form / Management Box */}
      {isAuthenticated ? (
        <div className="mb-8 rounded-xl border border-border bg-surface-alt/50 p-5">
          {myReview && !isEditing ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success">
                  <Check size={14} /> Your Review
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit Review
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={cn(
                      star <= myReview.rating ? 'fill-warning text-warning' : 'text-border'
                    )}
                  />
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-text">{myReview.rating}/5</span>
              </div>
              <p className="mt-2 text-sm text-text">{myReview.review}</p>
              {myReview.createdAt && (
                <p className="mt-2 font-mono text-[11px] text-text-light">
                  Posted on {new Date(myReview.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-text">
                {myReview ? 'Update Your Review' : `Write a Review for ${sellerName}`}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-secondary">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 text-warning transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={cn(
                          star <= (hoverRating || rating) ? 'fill-warning text-warning' : 'text-border'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-text">{rating} / 5</span>
              </div>

              <TextArea
                label="Your Review / Feedback"
                placeholder="Share your experience dealing with this seller..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />

              {error && (
                <p className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              {successMsg && (
                <p className="flex items-center gap-1.5 text-xs text-success">
                  <Check size={14} /> {successMsg}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {isEditing && (
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
                <Button variant="primary" size="sm" type="submit" loading={submitting} disabled={!reviewText.trim()}>
                  {myReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-dashed border-border bg-surface-alt/40 p-4 text-center">
          <p className="text-xs text-text-secondary">
            Sign in to post a verified review for {sellerName}.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && <p className="text-center text-xs text-text-light py-4">Loading reviews...</p>}

        {!loading && reviews.length === 0 && (
          <div className="py-8 text-center">
            <MessageSquare size={28} className="mx-auto mb-2 text-text-light" />
            <p className="text-sm font-semibold text-text">No reviews yet</p>
            <p className="mt-1 text-xs text-text-secondary">Be the first to review {sellerName}!</p>
          </div>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">Verified Buyer</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={cn(star <= (r.rating || 0) ? 'fill-warning text-warning' : 'text-border')}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {r.createdAt && (
                <span className="font-mono text-[11px] text-text-light">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-text-secondary">{r.review}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
