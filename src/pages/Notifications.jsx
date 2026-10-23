import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  AlertTriangle,
  ArrowLeft,
  Filter,
  CheckCircle2,
  LogIn,
} from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { useAuth } from '../hooks/useAuth'
import { getNotificationVisuals, getPriorityBadge } from '../utils/notificationTypes'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import { cn } from '../utils/cn'

function formatFullDateTime(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function Notifications() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  } = useNotifications()

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'unread'
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const filteredList = useMemo(() => {
    let list = notifications
    if (activeTab === 'unread') {
      list = list.filter((n) => !n.isRead)
    }
    if (selectedCategory !== 'ALL') {
      list = list.filter((n) => {
        const visuals = getNotificationVisuals(n)
        return visuals.category === selectedCategory
      })
    }
    return list
  }, [notifications, activeTab, selectedCategory])

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }

    const visuals = getNotificationVisuals(notification)
    if (visuals.actionPath) {
      navigate(visuals.actionPath)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container-page py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <LogIn size={28} />
          </div>
          <h1 className="text-xl font-black text-text mb-2">Sign in to View Notifications</h1>
          <p className="text-sm text-text-secondary mb-6">
            Stay on top of updates, leads, price movements, and transaction milestones by logging in to your account.
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lift hover:bg-primary-dark transition-all"
          >
            <LogIn size={16} />
            <span>Login to Your Account</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-6 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Notifications' },
        ]}
      />

      {/* Page Header */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lift">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-text">Notifications</h1>
              <p className="text-xs text-text-secondary">
                View and manage activity alerts, direct inquiries, and verified deal milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-text-secondary hover:bg-surface-alt hover:text-text transition-all"
          >
            <RefreshCw size={14} className={cn(isRefreshing && 'animate-spin text-primary')} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:bg-primary-dark transition-all"
            >
              <CheckCheck size={14} />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Content */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Left Filter Sidebar / Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          {/* Main Status Filter */}
          <div className="rounded-2xl border border-border bg-surface p-2 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all',
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text hover:bg-surface-alt font-medium'
              )}
            >
              <span className="flex items-center gap-2">
                <Bell size={15} />
                <span>All Notifications</span>
              </span>
              <span className={cn('text-[11px] rounded-full px-2 py-0.5', activeTab === 'all' ? 'bg-white/20' : 'bg-surface-alt text-text-secondary')}>
                {notifications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all',
                activeTab === 'unread'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text hover:bg-surface-alt font-medium'
              )}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>Unread</span>
              </span>
              {unreadCount > 0 && (
                <span className={cn('text-[11px] font-black rounded-full px-2 py-0.5', activeTab === 'unread' ? 'bg-white/20' : 'bg-danger text-white')}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Quick Selector */}
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Filter size={13} />
              <span>Category Filter</span>
            </h3>
            <div className="space-y-1">
              {[
                'ALL',
                'Vehicles',
                'Properties',
                'Electronics',
                'Spare Parts',
                'Leads & Inquiries',
                'KYC & Verification',
                'Dealer Store',
                'Account',
                'Announcement',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'w-full text-left rounded-xl px-3 py-2 text-xs transition-colors flex items-center justify-between',
                    selectedCategory === cat
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                  )}
                >
                  <span>{cat === 'ALL' ? 'All Categories' : cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Notifications List */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="mb-4 rounded-2xl border border-danger/30 bg-danger/5 p-4 text-xs font-semibold text-danger">
              {error}
            </div>
          )}

          {loading && notifications.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-border bg-surface p-4 animate-pulse">
                  <div className="h-10 w-10 rounded-xl bg-surface-alt shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-surface-alt" />
                    <div className="h-3 w-3/4 rounded bg-surface-alt" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-12 text-center shadow-card">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-alt text-text-light mb-4">
                {activeTab === 'unread' ? <CheckCheck size={32} className="text-emerald-500" /> : <BellOff size={32} />}
              </div>
              <h2 className="text-base font-bold text-text">
                {activeTab === 'unread' ? "You're all caught up!" : 'No notifications found'}
              </h2>
              <p className="mt-1 text-xs text-text-secondary max-w-sm">
                {activeTab === 'unread'
                  ? 'There are no pending unread notifications in this category.'
                  : 'When you receive listing inquiries, price alerts, or system updates, they will appear here.'}
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-surface shadow-card overflow-hidden divide-y divide-border/60">
              {filteredList.map((notification) => {
                const visuals = getNotificationVisuals(notification)
                const IconComponent = visuals.icon

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'group flex items-start gap-4 p-4 sm:p-5 transition-colors cursor-pointer',
                      !notification.isRead
                        ? 'bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-surface-alt/60'
                    )}
                  >
                    {/* Visual Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border mt-0.5',
                        visuals.badgeClass
                      )}
                    >
                      <IconComponent size={20} />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-text">
                            {notification.title || 'Notification'}
                          </h3>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>

                        <span className="text-[11px] font-medium text-text-light">
                          {formatFullDateTime(notification.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed mb-2.5">
                        {notification.message || 'No additional details provided.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        {/* Priority Badge */}
                        {notification.priority && (
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 font-bold uppercase tracking-wider',
                              getPriorityBadge(notification.priority).className
                            )}
                          >
                            {getPriorityBadge(notification.priority).label}
                          </span>
                        )}

                        {/* Category */}
                        <span className="rounded-md bg-surface-alt px-2 py-0.5 font-bold uppercase tracking-wider text-text-secondary">
                          {visuals.category}
                        </span>

                        {/* Reference Type if not NONE */}
                        {notification.referenceType && notification.referenceType !== 'NONE' && (
                          <span className="text-text-light font-medium">
                            Ref: {notification.referenceType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Row Actions */}
                    <div className="flex items-center gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          title="Mark as read"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-primary hover:border-primary/40 transition-colors shadow-2xs"
                        >
                          <Check size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        title="Delete notification"
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-danger hover:border-danger/40 transition-colors shadow-2xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
