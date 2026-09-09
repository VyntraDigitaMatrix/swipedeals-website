import api from '../api/axios'

/**
 * Backend-backed User KYC and DigiLocker service (/api/user/kyc/**).
 */
const BASE_URL = '/api/user/kyc'

export const kycService = {
  /**
   * GET /api/user/kyc/status
   * Fetches current KYC status and verified user details.
   */
  getKycStatus: async () => {
    const response = await api.get(`${BASE_URL}/status`)
    return response.data
  },

  /**
   * POST /api/user/kyc/digilocker/initiate
   * Initiates a DigiLocker authentication session.
   * Passes redirect_url and callback_url to configure Sandbox callback destination.
   * Returns { sessionId, authorizationUrl, success, message }.
   */
  initiateDigilocker: async (options = {}) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://swipedeals.in'
    const defaultUrl = `${origin}/user-verified`
    const payload = {
      redirect_url: options.redirect_url || options.redirectUrl || defaultUrl,
      redirectUrl: options.redirectUrl || options.redirect_url || defaultUrl,
      callback_url: options.callback_url || options.callbackUrl || defaultUrl,
      callbackUrl: options.callbackUrl || options.callback_url || defaultUrl,
      target_url: defaultUrl,
      targetUrl: defaultUrl,
      success_url: defaultUrl,
      successUrl: defaultUrl,
      failure_url: defaultUrl,
      failureUrl: defaultUrl,
      ...options,
    }
    const response = await api.post(`${BASE_URL}/digilocker/initiate`, payload, {
      params: payload,
    })
    return response.data
  },

  /**
   * POST /api/user/kyc/digilocker/complete?sessionId=...
   * Completes DigiLocker KYC process for the given sessionId.
   */
  completeDigilocker: async (sessionId) => {
    const response = await api.post(`${BASE_URL}/digilocker/complete`, null, {
      params: { sessionId },
    })
    return response.data
  },

  /**
   * GET /api/user/kyc/digilocker/callback?sessionId=...
   * Processes callback after DigiLocker OAuth redirect.
   */
  digilockerCallback: async (sessionId) => {
    const response = await api.get(`${BASE_URL}/digilocker/callback`, {
      params: { sessionId },
    })
    return response.data
  },
}

export default kycService
