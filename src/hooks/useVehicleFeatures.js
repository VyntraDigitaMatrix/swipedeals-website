import { useState, useCallback } from 'react'
import { vehicleFeatureService, featureMasterService } from '../services/vehicleListingService'

/**
 * Fetches:
 *   1. GET /api/admin/vehicle-feature-masters  — full master catalog (filtered by vehicleType if provided)
 *   2. GET /api/user/vehicles/:slug/features    — features already saved for this vehicle
 *
 * Merges them: every master feature appears as a checkbox, pre-checked if the
 * vehicle already has it marked as available.
 *
 * On save, only features with available=true are sent (backend rejects features
 * that don't belong to the vehicle type even when sent as available=false).
 */
export function useVehicleFeatures(slug, vehicleType) {
  const [featureCategories, setFeatureCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFeatures = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      // Fetch master catalog + vehicle's saved features in parallel
      const [mastersRaw, vehicleFeaturesRaw] = await Promise.all([
        featureMasterService.getFeaturesByVehicleType(vehicleType).catch(() => []),
        vehicleFeatureService.getFeatures(slug).catch(() => []),
      ])

      // Normalise master list
      const masters = Array.isArray(mastersRaw)
        ? mastersRaw
        : mastersRaw?.data ?? mastersRaw?.content ?? []

      // Normalise vehicle features
      const vehicleFeatureList = Array.isArray(vehicleFeaturesRaw)
        ? vehicleFeaturesRaw
        : vehicleFeaturesRaw?.data ?? vehicleFeaturesRaw?.content ?? []

      // Build lookup: featureMasterId → available boolean
      const availableMap = {}
      const extractFeatures = (list) => {
        list.forEach((item) => {
          if (item.featureMasterId !== undefined) {
            availableMap[item.featureMasterId] = Boolean(item.available)
          } else if (Array.isArray(item.features)) {
            item.features.forEach((f) => {
              if (f.featureMasterId !== undefined) {
                availableMap[f.featureMasterId] = Boolean(f.available)
              }
            })
          }
        })
      }
      extractFeatures(vehicleFeatureList)

      if (masters.length > 0) {
        // Group by category
        const categoryMap = {}
        masters.forEach((master) => {
          const cat = master.category || 'OTHER'
          if (!categoryMap[cat]) categoryMap[cat] = []
          const id = master.id ?? master.featureMasterId
          categoryMap[cat].push({
            featureMasterId: id,
            featureName: master.featureName ?? master.name,
            description: master.description ?? '',
            available: availableMap[id] ?? false,
          })
        })
        setFeatureCategories(
          Object.entries(categoryMap).map(([category, features]) => ({ category, features }))
        )
      } else {
        // Fallback: use vehicle features API response directly
        const data = vehicleFeaturesRaw?.data ?? vehicleFeaturesRaw ?? []
        setFeatureCategories(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicle features.')
    } finally {
      setLoading(false)
    }
  }, [slug, vehicleType])

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
