import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, createElement } from 'react'
import { notificationService } from '../services/notificationService'

const NotificationContext = createContext(null)

const ACCESS_TOKEN_KEY = 'swipedeals_access_token'

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [unreadLoading, setUnreadLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    last: true,
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY)
  })

  const isFetchingRef = useRef(false)

  // Track authentication state changes (across tabs and in-app login/logout)
  useEffect(() => {
    const checkAuth = () => {
      const authed = !!localStorage.getItem(ACCESS_TOKEN_KEY)
      setIsAuthenticated(authed)
    }
    window.addEventListener('storage', checkAuth)
    const interval = setInterval(checkAuth, 1000)
    return () => {
      window.removeEventListener('storage', checkAuth)
      clearInterval(interval)
    }
  }, [])

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      setUnreadCount(0)
      return 0
    }
    try {
      setUnreadLoading(true)
      const res = await notificationService.getUnreadCount()
      const count = Number(res?.data?.count ?? res?.count ?? 0)
      setUnreadCount(Number.isFinite(count) ? Math.max(0, count) : 0)
      return count
    } catch (err) {
      // Avoid noisy logs on 401
      if (err?.response?.status !== 401) {
        console.warn('[Notifications] Failed to fetch unread count:', err?.message)
      }
      return 0
    } finally {
      setUnreadLoading(false)
    }
  }, [])

  // Fetch paginated notification list
  const fetchNotifications = useCallback(async ({ page = 0, size = 20, isLoadMore = false } = {}) => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const res = await notificationService.getNotifications({
        page,
        size,
        sort: 'createdAt,desc',
      })

      const pageData = res?.data
      const content = Array.isArray(pageData?.content)
        ? pageData.content
        : Array.isArray(pageData)
        ? pageData
        : []

      setNotifications((prev) => (isLoadMore ? [...prev, ...content] : content))

      if (pageData && typeof pageData === 'object' && 'totalPages' in pageData) {
        setPageInfo({
          pageNumber: pageData.number ?? pageData.pageable?.pageNumber ?? page,
          pageSize: pageData.size ?? pageData.pageable?.pageSize ?? size,
          totalElements: pageData.totalElements ?? content.length,
          totalPages: pageData.totalPages ?? 1,
          first: pageData.first ?? (page === 0),
          last: pageData.last ?? true,
          empty: pageData.empty ?? (content.length === 0),
          numberOfElements: pageData.numberOfElements ?? content.length,
        })
      } else {
        setPageInfo({
          pageNumber: page,
          pageSize: size,
          totalElements: content.length,
          totalPages: 1,
          first: true,
          last: true,
          empty: content.length === 0,
          numberOfElements: content.length,
        })
      }
    } catch (err) {
      if (err?.response?.status !== 401) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load notifications'
        setError(msg)
      }
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [])

  // Mark single notification as read with optimistic UI update
  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return

    // Optimistic update
    let wasUnread = false
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id === notificationId) {
          if (!item.isRead) wasUnread = true
          return { ...item, isRead: true, readAt: new Date().toISOString() }
        }
        return item
      })
    )

    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    try {
      await notificationService.markAsRead(notificationId)
    } catch (err) {
      console.error('[Notifications] markAsRead failed:', err)
      // Re-sync on failure
      fetchUnreadCount()
    }
  }, [fetchUnreadCount])

  // Mark all notifications as read with optimistic UI update
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true, readAt: new Date().toISOString() }))
    )
    setUnreadCount(0)

    try {
      await notificationService.markAllAsRead()
    } catch (err) {
      console.error('[Notifications] markAllAsRead failed:', err)
      // Re-sync on failure
      fetchUnreadCount()
      fetchNotifications({ page: 0 })
    }
  }, [fetchUnreadCount, fetchNotifications])

  // Delete notification with optimistic UI update
  const deleteNotification = useCallback(async (notificationId) => {
    if (!notificationId) return

    // Optimistic removal
    let wasUnread = false
    setNotifications((prev) => {
      const target = prev.find((item) => item.id === notificationId)
      if (target && !target.isRead) wasUnread = true
      return prev.filter((item) => item.id !== notificationId)
    })

    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
    setPageInfo((prev) => ({
      ...prev,
      totalElements: Math.max(0, prev.totalElements - 1),
    }))

    try {
      await notificationService.deleteNotification(notificationId)
    } catch (err) {
      console.error('[Notifications] deleteNotification failed:', err)
      // Re-sync on failure
      fetchNotifications({ page: 0 })
      fetchUnreadCount()
    }
  }, [fetchNotifications, fetchUnreadCount])

  // Initial load & Auth lifecycle
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([])
      setUnreadCount(0)
      setError(null)
      return
    }

    fetchUnreadCount()
    fetchNotifications({ page: 0, size: 20 })

    // Periodic polling for real-time unread badges (every 45s)
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchUnreadCount()
      }
    }, 45000)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUnreadCount()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [isAuthenticated, fetchUnreadCount, fetchNotifications])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      unreadLoading,
      error,
      pageInfo,
      isAuthenticated,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refetch: () => {
        fetchUnreadCount()
        fetchNotifications({ page: 0 })
      },
    }),
    [
      notifications,
      unreadCount,
      loading,
      unreadLoading,
      error,
      pageInfo,
      isAuthenticated,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    ]
  )

  return createElement(NotificationContext.Provider, { value }, children)
}

/** Hook to consume notification context */
export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotifications must be used inside a <NotificationProvider>')
  }
  return ctx
}

export default useNotifications
