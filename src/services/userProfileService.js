import api from '../api/axios'

/**
 * Service for fetching the logged-in user's profile information.
 */
export const userProfileService = {
  /**
   * GET /api/user/profile
   * Returns: { fullName, mobileNumber, role, status, averageRating, totalReviews, kyc, addresses }
   */
  getProfile: async () => {
    const response = await api.get('/api/user/profile')
    return response.data
  },
}

export default userProfileService
