import api from '../api/axios'

export const leadService = {
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData)
    return response.data
  },
}
