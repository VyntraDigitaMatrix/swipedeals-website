import api from '../api/axios'

/**
 * User Authentication service matching UserAuthController endpoints exactly (/api/user/auth/**).
 */
const BASE_URL = '/api/user/auth'

const ACCESS_TOKEN_KEY = 'swipedeals_access_token'
const REFRESH_TOKEN_KEY = 'swipedeals_refresh_token'

export const authService = {
  /**
   * POST /api/user/auth/register
   * Body: { fullName: string, mobileNumber: string }
   */
  requestRegistrationOtp: async (fullName, mobileNumber) => {
    const response = await api.post(`${BASE_URL}/register`, { fullName, mobileNumber })
    return response.data
  },

  /**
   * POST /api/user/auth/register/verify-otp
   * Body: { mobileNumber: string, otp: string }
   * Returns data: { accessToken, refreshToken, tokenType }
   */
  verifyRegistrationOtp: async (mobileNumber, otp) => {
    const response = await api.post(`${BASE_URL}/register/verify-otp`, { mobileNumber, otp })
    return response.data
  },

  /**
   * POST /api/user/auth/register/resend-otp
   * Body: { mobileNumber: string }
   */
  resendRegistrationOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/register/resend-otp`, { mobileNumber })
    return response.data
  },

  /**
   * POST /api/user/auth/login
   * Body: { mobileNumber: string }
   */
  requestLoginOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/login`, { mobileNumber })
    return response.data
  },

  /**
   * POST /api/user/auth/login/verify-otp
   * Body: { mobileNumber: string, otp: string }
   * Returns data: { accessToken, refreshToken, tokenType }
   */
  verifyLoginOtp: async (mobileNumber, otp) => {
    const response = await api.post(`${BASE_URL}/login/verify-otp`, { mobileNumber, otp })
    return response.data
  },

  /**
   * POST /api/user/auth/login/resend-otp
   * Body: { mobileNumber: string }
   */
  resendLoginOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/login/resend-otp`, { mobileNumber })
    return response.data
  },

  /**
   * POST /api/user/auth/refresh-token
   * Body: { refreshToken: string }
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post(`${BASE_URL}/refresh-token`, { refreshToken })
    return response.data
  },

  /**
   * POST /api/user/auth/logout
   * Body: { refreshToken: string }
   */
  logout: async (refreshToken) => {
    const response = await api.post(`${BASE_URL}/logout`, { refreshToken })
    return response.data
  },

  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
}

export default authService
