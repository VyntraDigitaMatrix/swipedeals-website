import { useState, useEffect, useCallback } from 'react'
import { userProfileService } from '../services/userProfileService'
import { useAuth } from './useAuth'

export function useUserProfile() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await userProfileService.getProfile()
      // API typically returns wrapped response like { data: { ... } }
      const profileData = response?.data || response
      setProfile(profileData)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, fetchProfile }
}

export default useUserProfile
