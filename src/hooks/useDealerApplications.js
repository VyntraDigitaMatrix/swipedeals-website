import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/** Mock "backend" for dealer registration applications — same pending -> approved / rejected lifecycle as listings. */
export function useDealerApplications() {
  const [applications, setApplications] = useLocalStorage('swipedeals_dealer_applications', [])

  const addApplication = useCallback(
    (data) => {
      const application = {
        id: `da-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        ...data,
      }
      setApplications((prev) => [application, ...prev])
      return application
    },
    [setApplications]
  )

  return {
    applications,
    pending: applications.filter((a) => a.status === 'pending'),
    approved: applications.filter((a) => a.status === 'approved'),
    rejected: applications.filter((a) => a.status === 'rejected'),
    addApplication,
  }
}

export default useDealerApplications
