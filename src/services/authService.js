import api from '../api/axios'

/**
 * Real backend-backed user authentication — mobile + OTP, matching
 * UserAuthController exactly (/api/user/auth/**). All of these endpoints
 * are public/unauthenticated on the backend; only /logout requires the
 * bearer token this service already attaches via api/axios.js.
 *
 * Registration is two steps: request() sends an OTP to a brand-new mobile
 * number (fullName + mobileNumber), verify() creates the account and
 * returns tokens. Login is the same two-step shape for an existing number.
 */

const BASE_URL = '/api/user/auth'

const ACCESS_TOKEN_KEY = 'swipedeals_access_token'
const REFRESH_TOKEN_KEY = 'swipedeals_refresh_token'

export const authService = {
  // Step 1 of registration: sends an OTP to a new mobile number.
  requestRegistrationOtp: async (fullName, mobileNumber) => {
    const response = await api.post(`${BASE_URL}/register`, { fullName, mobileNumber })
    return response.data
  },

  // Step 2 of registration: verifies the OTP and creates the account.
  // Returns { accessToken, refreshToken, tokenType }.
  verifyRegistrationOtp: async (mobileNumber, otp) => {
    const response = await api.post(`${BASE_URL}/register/verify-otp`, { mobileNumber, otp })
    return response.data
  },

  resendRegistrationOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/register/resend-otp`, { mobileNumber })
    return response.data
  },

  // Step 1 of login: sends an OTP to an existing mobile number. Rejects
  // with a 404 if no account exists for that number.
  requestLoginOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/login`, { mobileNumber })
    return response.data
  },

  // Step 2 of login: verifies the OTP. Returns { accessToken, refreshToken, tokenType }.
  verifyLoginOtp: async (mobileNumber, otp) => {
    const response = await api.post(`${BASE_URL}/login/verify-otp`, { mobileNumber, otp })
    return response.data
  },

  resendLoginOtp: async (mobileNumber) => {
    const response = await api.post(`${BASE_URL}/login/resend-otp`, { mobileNumber })
    return response.data
  },

  // Best-effort server-side token revocation. Callers should clear local
  // session state regardless of whether this succeeds.
  logout: async (refreshToken) => {
    const response = await api.post(`${BASE_URL}/logout`, { refreshToken })
    return response.data
  },

  setTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
}

export default authService
