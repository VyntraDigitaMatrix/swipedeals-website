import axios from 'axios'

// Points at the same SwipeDeals backend the admin console talks to.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://swipedealsbackend.swipedeals.in'

const ACCESS_TOKEN_KEY = 'swipedeals_access_token'
const REFRESH_TOKEN_KEY = 'swipedeals_refresh_token'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Kept in sync with authService's token storage keys.
export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// Attaches the signed-in user's access token, when present. Public browse
// endpoints (/api/public/**) and the OTP auth endpoints work fine with no
// token at all — this is a courtesy for the authenticated endpoints only.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// On a 401 from an authenticated request, tries a silent token refresh once
// before giving up and clearing the session. Auth endpoints themselves are
// excluded to avoid a refresh loop around login/registration.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint =
      originalRequest?.url?.includes('/api/user/auth/login') ||
      originalRequest?.url?.includes('/api/user/auth/register') ||
      originalRequest?.url?.includes('/api/user/auth/refresh-token')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (!refreshToken) {
        clearAuthTokens()
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/user/auth/refresh-token`, { refreshToken })
        const authData = response.data?.data
        const newAccessToken = authData?.accessToken
        const newRefreshToken = authData?.refreshToken || refreshToken

        if (!newAccessToken) throw new Error('Refresh response did not include an access token.')

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearAuthTokens()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
