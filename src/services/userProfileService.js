import api from '../api/axios'

/**
 * Service for user-profile-controller endpoints
 */
export const userProfileService = {
  /**
   * GET /api/user/profile
   * Returns user profile details:
   * { id, fullName, mobileNumber, role, status, averageRating, totalReviews, kyc, addresses }
   */
  getProfile: async () => {
    const response = await api.get('/api/user/profile')
    return response.data
  },

  /**
   * PUT /api/user/profile/name
   * Updates user full name
   * Body: { fullName: string }
   */
  updateFullName: async (fullName) => {
    const response = await api.put('/api/user/profile/name', { fullName })
    return response.data
  },

  /**
   * POST /api/user/profile/mobile/request-otp
   * Request OTP to change registered mobile number
   * Body: { mobileNumber: string }
   */
  requestMobileOtp: async (mobileNumber) => {
    const response = await api.post('/api/user/profile/mobile/request-otp', { mobileNumber })
    return response.data
  },

  /**
   * PUT /api/user/profile/mobile/verify-otp
   * Verify OTP to complete mobile number update
   * Body: { mobileNumber: string, otp: string }
   */
  verifyMobileOtp: async ({ mobileNumber, otp }) => {
    const response = await api.put('/api/user/profile/mobile/verify-otp', { mobileNumber, otp })
    return response.data
  },

  /**
   * GET /api/user/dashboard
   */
  getDashboardStats: async () => {
    const response = await api.get('/api/user/dashboard')
    return response.data
  },
}

export default userProfileService
