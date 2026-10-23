import { useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  CarFront,
  Home,
  Laptop,
  Wrench,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Inbox,
  LogIn,
} from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useAuth } from '../../hooks/useAuth'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { getNotificationVisuals, getPriorityBadge } from '../../utils/notificationTypes'
import { cn } from '../../utils/cn'

function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 30) return 'Just now'
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useOnClickOutside(dropdownRef, () => setOpen(false))

  const { isAuthenticated } = useAuth()
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
    fetchNotifications,
  } = useNotifications()

  const handleToggle = () => {
    if (!open && isAuthenticated) {
      // Re-fetch latest when opening
      fetchNotifications({ page: 0, size: 20 })
    }
    setOpen((prev) => !prev)
  }

  const handleRefresh = async (e) => {
    e.stopPropagation()
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setTimeout(() => setIsRefreshing(false), 400)
    }
  }

  const handleMarkAllRead = async (e) => {
    e.stopPropagation()
    await markAllAsRead()
  }

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.isRead)
    }
    return notifications
  }, [notifications, filter])

  const handleItemClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }

    const visuals = getNotificationVisuals(notification)
    setOpen(false)

    if (visuals.actionPath) {
      navigate(visuals.actionPath)
    }
  }

  const handleDeleteItem = (e, id) => {
    e.stopPropagation()
    deleteNotification(id)
  }

  const handleSingleMarkRead = (e, id) => {
    e.stopPropagation()
    markAsRead(id)
  }

  return (
    <div ref={dropdownRef} className="relative select-none">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="View notifications"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-alt transition-all duration-200',
          open
            ? 'border-primary/40 bg-primary/10 text-primary ring-2 ring-primary/20'
            : 'text-text-secondary hover:border-primary/30 hover:bg-primary/10 hover:text-primary'
        )}
      >
        <Bell
          size={19}
          className={cn(
            'transition-transform duration-200',
            unreadCount > 0 && 'animate-[wiggle_1s_ease-in-out_infinite]'
          )}
          aria-hidden="true"
        />

        {/* Unread badge count */}
        {isAuthenticated && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-black text-white shadow-lift ring-2 ring-surface animate-in fade-in zoom-in">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-[340px] sm:w-[420px] rounded-2xl border border-border bg-surface shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Unauthenticated View */}
            {!isAuthenticated ? (
              <div className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                  <LogIn size={24} />
                </div>
                <h3 className="text-sm font-bold text-text mb-1">Sign in for Notifications</h3>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                  Log in to get instant alerts on deals, price drops, leads, and account verification updates.
                </p>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-lift hover:bg-primary-dark transition-all"
                >
                  <LogIn size={15} />
                  <span>Login to SwipeDeals</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-surface-alt/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bell size={15} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-text tracking-tight flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-danger/10 text-danger border border-danger/20 px-2 py-0.2 text-[10px] font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={handleRefresh}
                      title="Refresh notifications"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-alt hover:text-text transition-colors"
                    >
                      <RefreshCw size={13} className={cn(isRefreshing && 'animate-spin text-primary')} />
                    </button>

                    {/* Mark All Read */}
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        title="Mark all as read"
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        <CheckCheck size={13} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-border/60 bg-surface text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={cn(
                      'rounded-lg px-2.5 py-1 transition-colors',
                      filter === 'all'
                        ? 'bg-primary text-white font-bold shadow-2xs'
                        : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                    )}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'rounded-lg px-2.5 py-1 transition-colors flex items-center gap-1.5',
                      filter === 'unread'
                        ? 'bg-primary text-white font-bold shadow-2xs'
                        : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                    )}
                  >
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[9px] font-black',
                          filter === 'unread' ? 'bg-white/20 text-white' : 'bg-danger text-white'
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* List Container */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">
                  {loading && notifications.length === 0 ? (
                    // Skeleton Loaders
                    <div className="space-y-3 p-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex gap-3 animate-pulse">
                          <div className="h-9 w-9 rounded-xl bg-surface-alt shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 rounded bg-surface-alt" />
                            <div className="h-2.5 w-full rounded bg-surface-alt" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt text-text-light mb-2.5">
                        {filter === 'unread' ? <CheckCheck size={22} className="text-emerald-500" /> : <BellOff size={22} />}
                      </div>
                      <p className="text-xs font-bold text-text">
                        {filter === 'unread' ? "You're all caught up!" : 'No notifications yet'}
                      </p>
                      <p className="mt-1 text-[11px] text-text-secondary max-w-[220px]">
                        {filter === 'unread'
                          ? 'There are no unread notifications at the moment.'
                          : 'Important vehicle, lead, and verified listing alerts will appear here.'}
                      </p>
                    </div>
                  ) : (
                    // Notification Items
                    filteredNotifications.map((item) => {
                      const visuals = getNotificationVisuals(item)
                      const IconComponent = visuals.icon

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            'group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left',
                            !item.isRead
                              ? 'bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary'
                              : 'hover:bg-surface-alt/70'
                          )}
                        >
                          {/* Visual Category Icon */}
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border mt-0.5',
                              visuals.badgeClass
                            )}
                          >
                            <IconComponent size={17} />
                          </div>

                          {/* Content Body */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-bold text-text truncate">
                                {item.title || 'Notification'}
                              </span>
                              {!item.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </div>

                            <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                              {item.message || 'No additional details.'}
                            </p>

                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-text-light">
                              <span className="font-semibold text-text-secondary">
                                {formatRelativeTime(item.createdAt)}
                              </span>

                              {/* Priority Badge */}
                              {item.priority && (
                                <span
                                  className={cn(
                                    'rounded px-1.5 py-0.2 font-bold uppercase tracking-wider text-[9px]',
                                    getPriorityBadge(item.priority).className
                                  )}
                                >
                                  {getPriorityBadge(item.priority).label}
                                </span>
                              )}

                              {/* Category Tag */}
                              <span className="rounded bg-surface-alt px-1.5 py-0.2 font-medium text-text-secondary text-[9px]">
                                {visuals.category}
                              </span>

                              {/* Reference Type if not NONE */}
                              {item.referenceType && item.referenceType !== 'NONE' && (
                                <span className="text-text-light/80 text-[9px]">
                                  • {item.referenceType}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right Quick Actions (Show on hover or always accessible) */}
                          <div className="absolute right-2.5 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!item.isRead && (
                              <button
                                type="button"
                                onClick={(e) => handleSingleMarkRead(e, item.id)}
                                title="Mark as read"
                                className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors shadow-2xs"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(e, item.id)}
                              title="Delete notification"
                              className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface border border-border text-text-secondary hover:text-danger hover:border-danger/40 transition-colors shadow-2xs"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5 bg-surface-alt/50 text-[11px]">
                  <Link
                    to="/notifications"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1 font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    <span>View all notifications</span>
                    <ArrowRight size={13} />
                  </Link>

                  <span className="text-text-light font-medium">
                    {notifications.length} total
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
