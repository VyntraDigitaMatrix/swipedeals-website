import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAuth } from './useAuth'

/**
 * Mock Aadhaar/PAN KYC store — every seller must complete this before they
 * can publish a listing in any category. There's no real backend (or UIDAI/
 * NSDL integration) here, so a correctly-formatted submission is verified
 * instantly and persisted to localStorage, keyed by the signed-in user's
 * phone number (same identity key `useAuth` and the login flow use).
 */
export function useKyc() {
  const { user } = useAuth()
  const [records, setRecords] = useLocalStorage('swipedeals_kyc', {})

  const kyc = user?.phone ? records[user.phone] : undefined

  const submitKyc = useCallback(
    (data) => {
      if (!user?.phone) return
      setRecords((prev) => ({
        ...prev,
        [user.phone]: {
          fullName: data.fullName,
          aadharNumber: data.aadharNumber,
          panNumber: data.panNumber,
          status: 'verified',
          submittedAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        },
      }))
    },
    [user?.phone, setRecords]
  )

  return {
    kyc,
    isKycVerified: kyc?.status === 'verified',
    submitKyc,
  }
}

export default useKyc
