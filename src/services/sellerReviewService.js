import api from '../api/axios'
import { toUuid } from '../utils/uuid'

/**
 * Service for Seller Reviews controller endpoints (/api/reviews/**)
 */
export const sellerReviewService = {
  /**
   * GET /api/reviews/my-reviews
   * Retrieves paginated reviews received by the currently authenticated seller.
   */
  getMyReviews: async (params = {}) => {
    try {
      const res = await api.get('/api/reviews/my-reviews', { params })
      return res.data
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        return { success: true, data: { content: [], totalElements: 0, totalPages: 0 } }
      }
      throw err
    }
  },

  /**
   * POST /api/reviews
   * Submits a new review for a seller.
   * Body: { sellerId: string, rating: number, review: string }
   */
  postReview: async ({ sellerId, rating, review }) => {
    const validUuid = toUuid(sellerId)
    const res = await api.post('/api/reviews', { sellerId: validUuid, rating: Number(rating), review })
    return res.data
  },

  /**
   * GET /api/reviews/seller/{sellerId}
   * Fetches paginated reviews for a specific seller. Returns empty result on 404/400.
   */
  getSellerReviews: async (sellerId, params = {}) => {
    const validUuid = toUuid(sellerId)
    try {
      const res = await api.get(`/api/reviews/seller/${encodeURIComponent(validUuid)}`, { params })
      return res.data
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        return { success: true, data: { content: [], totalElements: 0, totalPages: 0 } }
      }
      throw err
    }
  },

  /**
   * GET /api/reviews/seller/{sellerId}/my-review
   * Fetches the current authenticated user's review for a specific seller. Returns null on 404/400.
   */
  getMyReview: async (sellerId) => {
    const validUuid = toUuid(sellerId)
    try {
      const res = await api.get(`/api/reviews/seller/${encodeURIComponent(validUuid)}/my-review`)
      return res.data
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        return { success: true, data: null }
      }
      throw err
    }
  },

  /**
   * PATCH /api/reviews/{reviewId}
   * Updates an existing review by review ID.
   * Body: { rating: number, review: string }
   */
  updateReview: async (reviewId, { rating, review }) => {
    const res = await api.patch(`/api/reviews/${encodeURIComponent(reviewId)}`, {
      rating: Number(rating),
      review,
    })
    return res.data
  },

  /**
   * DELETE /api/reviews/{reviewId}
   * Deletes a review by review ID.
   */
  deleteReview: async (reviewId) => {
    const res = await api.delete(`/api/reviews/${encodeURIComponent(reviewId)}`)
    return res.data
  },
}

export default sellerReviewService
