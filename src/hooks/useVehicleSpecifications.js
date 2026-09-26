import { useState, useCallback } from 'react'
import { vehicleSpecificationService } from '../services/vehicleListingService'

export function useVehicleSpecifications(slug) {
  const [specifications, setSpecifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSpecifications = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleSpecificationService.getSpecifications(slug)
      const data = res?.data ?? res ?? []
      setSpecifications(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicle specifications.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const addSpecification = useCallback(async (payload) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleSpecificationService.addSpecification(slug, payload)
      await fetchSpecifications()
      return res?.data ?? res
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to add vehicle specification.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchSpecifications])

  const updateSpecification = useCallback(async (specificationId, payload) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleSpecificationService.updateSpecification(slug, specificationId, payload)
      await fetchSpecifications()
      return res?.data ?? res
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update vehicle specification.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchSpecifications])

  const deleteSpecification = useCallback(async (specificationId) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await vehicleSpecificationService.deleteSpecification(slug, specificationId)
      setSpecifications((prev) => prev.filter((spec) => spec.id !== specificationId))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete vehicle specification.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug])

  return {
    specifications,
    loading,
    error,
    fetchSpecifications,
    addSpecification,
    updateSpecification,
    deleteSpecification,
  }
}

export default useVehicleSpecifications
