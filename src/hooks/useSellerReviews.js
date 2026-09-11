import { useState, useCallback } from 'react'
import { sellerReviewService } from '../services/sellerReviewService'

export function useSellerReviews(sellerId) {
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async (params = {}) => {
    if (!sellerId) return
    setLoading(true)
    setError(null)
    try {
      const response = await sellerReviewService.getSellerReviews(sellerId, params)
      const pageData = response?.data
      const content = pageData?.content || (Array.isArray(pageData) ? pageData : [])
      setReviews(content)
      setTotalElements(pageData?.totalElements ?? content.length)
      setTotalPages(pageData?.totalPages ?? 1)
      return pageData
    } catch (err) {
      setReviews([])
      setTotalElements(0)
      setTotalPages(0)
      if (err?.response?.status !== 404 && err?.response?.status !== 400) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch reviews.'
        setError(errMsg)
      }
    } finally {
      setLoading(false)
    }
  }, [sellerId])

  const fetchMyReview = useCallback(async () => {
    if (!sellerId) return
    try {
      const response = await sellerReviewService.getMyReview(sellerId)
      const reviewData = response?.data || null
      setMyReview(reviewData)
      return reviewData
    } catch (err) {
      setMyReview(null)
    }
  }, [sellerId])

  const submitReview = useCallback(async ({ rating, review }) => {
    if (!sellerId) return
    setSubmitting(true)
    setError(null)
    try {
      let res
      if (myReview?.id) {
        res = await sellerReviewService.updateReview(myReview.id, { rating, review })
      } else {
        res = await sellerReviewService.postReview({ sellerId, rating, review })
      }
      const savedReview = res?.data || res
      setMyReview(savedReview)
      await fetchReviews()
      return savedReview
    } catch (err) {
      const rawMsg = err?.response?.data?.message || err?.message || ''
      const errMsg = rawMsg.toLowerCase().includes('seller')
        ? 'This seller account is not registered in the backend database.'
        : rawMsg || 'Failed to submit review.'
      setError(errMsg)
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [sellerId, myReview, fetchReviews])

  const removeReview = useCallback(async () => {
    if (!myReview?.id) return
    setSubmitting(true)
    setError(null)
    try {
      await sellerReviewService.deleteReview(myReview.id)
      setMyReview(null)
      await fetchReviews()
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete review.'
      setError(errMsg)
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [myReview, fetchReviews])

  return {
    reviews,
    myReview,
    totalElements,
    totalPages,
    loading,
    submitting,
    error,
    fetchReviews,
    fetchMyReview,
    submitReview,
    removeReview,
  }
}

export default useSellerReviews
