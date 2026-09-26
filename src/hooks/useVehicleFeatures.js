import { useState, useCallback } from 'react'
import { vehicleFeatureService } from '../services/vehicleListingService'

export function useVehicleFeatures(slug) {
  const [featureCategories, setFeatureCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFeatures = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleFeatureService.getFeatures(slug)
      const data = res?.data ?? res ?? []
      setFeatureCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicle features.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const updateFeatures = useCallback(async (featuresPayload) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleFeatureService.updateFeatures(slug, featuresPayload)
      await fetchFeatures()
      return res?.data ?? res
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update vehicle features.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchFeatures])

  return {
    featureCategories,
    loading,
    error,
    fetchFeatures,
    updateFeatures,
  }
}

export default useVehicleFeatures
