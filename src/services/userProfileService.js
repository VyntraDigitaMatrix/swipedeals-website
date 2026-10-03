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

  /**
   * GET /api/user/dashboard
   * Returns: { totalProducts, totalAvailableProducts, totalArchivedProducts, totalLeads, ... }
   */
  getDashboardStats: async () => {
    const response = await api.get('/api/user/dashboard')
    return response.data
  },
}

export default userProfileService
