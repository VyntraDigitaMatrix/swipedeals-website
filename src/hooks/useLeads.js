import { useState, useCallback } from 'react'
import { leadService } from '../services/leadService'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
    empty: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await leadService.getLeads(params)
      const page = res?.data ?? res
      const content = page?.content ?? (Array.isArray(page) ? page : [])

      setLeads(Array.isArray(content) ? content : [])
      setPagination({
        totalElements: page?.totalElements ?? (Array.isArray(content) ? content.length : 0),
        totalPages: page?.totalPages ?? 1,
        number: page?.number ?? page?.pageable?.pageNumber ?? 0,
        size: page?.size ?? page?.pageable?.pageSize ?? 10,
        first: page?.first ?? true,
        last: page?.last ?? true,
        empty: page?.empty ?? (Array.isArray(content) ? content.length === 0 : true),
      })
      return res
    } catch (err) {
      if (err?.response?.status !== 401) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch leads.'
        setError(errMsg)
      }
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createLead = useCallback(async (leadData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await leadService.createLead(leadData)
      const newLead = res?.data ?? res
      if (newLead && typeof newLead === 'object') {
        setLeads((prev) => [newLead, ...prev])
      }
      return newLead
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit lead request.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    leads,
    pagination,
    loading,
    error,
    fetchLeads,
    createLead,
  }
}

export default useLeads
