import api from '../api/axios'

/**
 * Service for Notification API endpoints (/api/v1/notifications/**)
 * Provides methods for viewing and managing user/dealer/admin notifications.
 */
export const notificationService = {
  /**
   * GET /api/v1/notifications
   * Supports pagination parameters: { page: 0, size: 20, sort: 'createdAt,desc' }
   */
  getNotifications: async (params = {}) => {
    const response = await api.get('/api/v1/notifications', { params })
    return response.data
  },

  /**
   * GET /api/v1/notifications/unread-count
   * Returns: { success: true, data: { count: number } }
   */
  getUnreadCount: async () => {
    const response = await api.get('/api/v1/notifications/unread-count')
    return response.data
  },

  /**
   * PATCH /api/v1/notifications/{notificationId}/read
   * Marks a single notification as read.
   */
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/api/v1/notifications/${notificationId}/read`)
    return response.data
  },

  /**
   * PATCH /api/v1/notifications/read-all
   * Marks all notifications as read for current authenticated user.
   */
  markAllAsRead: async () => {
    const response = await api.patch('/api/v1/notifications/read-all')
    return response.data
  },

  /**
   * DELETE /api/v1/notifications/{notificationId}
   * Permanently deletes a single notification.
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/api/v1/notifications/${notificationId}`)
    return response.data
  },
}

export default notificationService
