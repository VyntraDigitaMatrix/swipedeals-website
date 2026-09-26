import { useState, useCallback } from 'react'
import { vehicleDocumentService } from '../services/vehicleListingService'

export function useVehicleDocuments(slug) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDocuments = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleDocumentService.getDocuments(slug)
      const list = res?.data ?? res ?? []
      setDocuments(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicle documents.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const uploadDocument = useCallback(async (documentType, file) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleDocumentService.uploadDocument(slug, documentType, file)
      await fetchDocuments()
      return res?.data ?? res
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to upload document.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchDocuments])

  const replaceDocument = useCallback(async (documentType, file) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const res = await vehicleDocumentService.replaceDocument(slug, documentType, file)
      await fetchDocuments()
      return res?.data ?? res
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to replace document.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug, fetchDocuments])

  const deleteDocument = useCallback(async (documentId) => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      await vehicleDocumentService.deleteDocument(slug, documentId)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete document.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [slug])

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    replaceDocument,
    deleteDocument,
  }
}

export default useVehicleDocuments
