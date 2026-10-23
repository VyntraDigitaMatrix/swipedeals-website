import api from '../api/axios'

export const leadService = {
  getLeads: async (params = {}) => {
    const response = await api.get('/api/leads', { params })
    return response.data
  },

  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData)
    return response.data
  },
}

