import { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAuth } from './useAuth'
import { kycService } from '../services/kycService'

/**
 * User KYC & DigiLocker hook.
 * Integrates backend /api/user/kyc/** endpoints (status, digilocker initiate, complete, callback)
 * with a fallback for local offline records.
 */
export function useKyc() {
  const { user, isAuthenticated } = useAuth()
  const [localRecords, setLocalRecords] = useLocalStorage('swipedeals_kyc', {})
  const [kycData, setKycData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const localRecord = user?.phone ? localRecords[user.phone] : undefined

  const fetchKycStatus = useCallback(async () => {
    if (!isAuthenticated) return null
    setLoading(true)
    setError(null)
    try {
      const response = await kycService.getKycStatus()
      const data = response?.data
      if (data) {
        setKycData(data)
        return data
      }
    } catch (err) {
      console.warn('Backend KYC status fetch warning:', err)
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
    return null
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchKycStatus()
    } else {
      setKycData(null)
    }
  }, [isAuthenticated, fetchKycStatus])

  const mergedKyc = kycData || localRecord

  const isVerifiedStatus = (status) => {
    if (!status) return false
    const s = String(status).toUpperCase()
    return s === 'VERIFIED' || s === 'COMPLETED' || s === 'APPROVED' || s === 'SUCCESS'
  }

  const isKycVerified =
    isVerifiedStatus(mergedKyc?.status) ||
    Boolean(mergedKyc?.aadhaarVerified && mergedKyc?.panVerified) ||
    mergedKyc?.status === 'verified'

  const initiateDigilocker = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await kycService.initiateDigilocker()
      const data = res?.data || res
      if (data?.sessionId) {
        localStorage.setItem('swipedeals_digilocker_session', data.sessionId)
      }
      return data
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to initiate DigiLocker verification.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const completeDigilocker = useCallback(async (sessionId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await kycService.completeDigilocker(sessionId)
      const data = res?.data
      if (data) {
        setKycData(data)
        localStorage.removeItem('swipedeals_digilocker_session')
        return data
      }
      return null
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to complete DigiLocker verification.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const submitKycFallback = useCallback(
    (data) => {
      if (!user?.phone) return
      const record = {
        fullName: data.fullName,
        verifiedName: data.fullName,
        verifiedMobileNumber: user.phone,
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber,
        status: 'VERIFIED',
        aadhaarVerified: true,
        panVerified: true,
        submittedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
      }
      setLocalRecords((prev) => ({
        ...prev,
        [user.phone]: record,
      }))
      setKycData(record)
    },
    [user?.phone, setLocalRecords]
  )

  return {
    kyc: mergedKyc,
    isKycVerified,
    loading,
    error,
    fetchKycStatus,
    initiateDigilocker,
    completeDigilocker,
    submitKyc: submitKycFallback,
  }
}

export default useKyc
