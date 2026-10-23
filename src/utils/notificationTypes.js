import {
  Bell,
  CarFront,
  Home,
  Laptop,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Store,
  MessageSquare,
  Star,
  Sparkles,
  UserCheck,
  UserX,
  FileCheck,
  AlertTriangle,
  Info,
} from 'lucide-react'

export const NOTIFICATION_ROLES = ['USER', 'ADMIN', 'INSPECTOR', 'DEALER']

export const NOTIFICATION_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW']

export const NOTIFICATION_REFERENCE_TYPES = [
  'VEHICLE',
  'ELECTRONICS',
  'PROPERTY',
  'SPARE_PART',
  'LEAD',
  'DEALER_KYC',
  'DEALER_KYC_DOCUMENT',
  'DEALER_STORE',
  'DEALER_STORE_INSPECTION',
  'USER_KYC',
  'USER_KYC_DOCUMENT',
  'INQUIRY',
  'OFFER',
  'BOOKING',
  'NONE',
]

export const NOTIFICATION_TYPES = [
  // User auth/lifecycle
  'USER_REGISTERED',
  'USER_REGISTRATION_SUCCESS',
  'USER_VERIFICATION_SUCCESS',
  'USER_VERIFICATION_FAILED',
  'USER_ACTIVATED',
  'USER_DEACTIVATED',
  'USER_REACTIVATED',

  // Dealer lifecycle
  'DEALER_REGISTERED',
  'DEALER_REGISTRATION_SUCCESS',
  'DEALER_VERIFICATION_SUCCESS',
  'DEALER_VERIFICATION_FAILED',
  'DEALER_ACTIVATED',
  'DEALER_DEACTIVATED',
  'DEALER_REACTIVATED',

  // Admin lifecycle
  'ADMIN_REGISTERED',
  'ADMIN_REGISTRATION_SUCCESS',
  'ADMIN_VERIFICATION_SUCCESS',
  'ADMIN_VERIFICATION_FAILED',
  'ADMIN_ACTIVATED',
  'ADMIN_DEACTIVATED',
  'ADMIN_REACTIVATED',

  // Vehicles
  'VEHICLE_LISTING_CREATED',
  'VEHICLE_LISTING_UPDATED',
  'VEHICLE_LISTING_SUBMITTED',
  'VEHICLE_LISTING_APPROVED',
  'VEHICLE_LISTING_REJECTED',
  'VEHICLE_LISTING_PUBLISHED',
  'VEHICLE_LISTING_UNPUBLISHED',
  'VEHICLE_LISTING_ARCHIVED',
  'VEHICLE_LISTING_RESTORED',

  // Electronics
  'ELECTRONICS_LISTING_CREATED',
  'ELECTRONICS_LISTING_UPDATED',
  'ELECTRONICS_LISTING_SUBMITTED',
  'ELECTRONICS_LISTING_APPROVED',
  'ELECTRONICS_LISTING_REJECTED',
  'ELECTRONICS_LISTING_PUBLISHED',
  'ELECTRONICS_LISTING_UNPUBLISHED',
  'ELECTRONICS_LISTING_ARCHIVED',
  'ELECTRONICS_LISTING_RESTORED',

  // Properties
  'PROPERTY_LISTING_CREATED',
  'PROPERTY_LISTING_UPDATED',
  'PROPERTY_LISTING_SUBMITTED',
  'PROPERTY_LISTING_APPROVED',
  'PROPERTY_LISTING_REJECTED',
  'PROPERTY_LISTING_PUBLISHED',
  'PROPERTY_LISTING_UNPUBLISHED',
  'PROPERTY_LISTING_ARCHIVED',
  'PROPERTY_LISTING_RESTORED',

  // Spare Parts
  'SPARE_PART_LISTING_CREATED',
  'SPARE_PART_LISTING_UPDATED',
  'SPARE_PART_LISTING_SUBMITTED',
  'SPARE_PART_LISTING_APPROVED',
  'SPARE_PART_LISTING_REJECTED',
  'SPARE_PART_LISTING_PUBLISHED',
  'SPARE_PART_LISTING_UNPUBLISHED',
  'SPARE_PART_LISTING_ARCHIVED',
  'SPARE_PART_LISTING_RESTORED',

  // User KYC
  'USER_KYC_CREATED',
  'USER_KYC_IN_PROGRESS',
  'USER_KYC_VERIFIED',
  'USER_KYC_FAILED',

  // Dealer KYC
  'DEALER_KYC_CREATED',
  'DEALER_KYC_SUBMITTED',
  'DEALER_KYC_UNDER_REVIEW',
  'DEALER_KYC_VERIFIED',
  'DEALER_KYC_REJECTED',
  'DEALER_KYC_ADDITIONAL_INFORMATION_REQUIRED',
  'DEALER_KYC_DOCUMENT_SUBMITTED',
  'DEALER_KYC_DOCUMENT_VERIFIED',
  'DEALER_KYC_DOCUMENT_REJECTED',

  // Dealer Store
  'STORE_CREATED',
  'STORE_UPDATED',
  'STORE_SUBMITTED',
  'STORE_APPROVED',
  'STORE_REJECTED',
  'STORE_ADDITIONAL_INFORMATION_REQUIRED',
  'STORE_INSPECTION_STARTED',
  'STORE_INSPECTION_REPORT_SUBMITTED',

  // Leads & Inquiries
  'LEAD_CREATED',
  'LEAD_RECEIVED',

  // Seller Reviews
  'SELLER_REVIEW_CREATED',
  'SELLER_REVIEW_RECEIVED',

  // System
  'SYSTEM_ANNOUNCEMENT',
]

/**
 * Returns visual presentation properties strictly mapped from Swagger schema fields:
 * { id, recipientRole, type, referenceType, referenceId, priority, isRead, createdAt, readAt }
 */
export function getNotificationVisuals(notification = {}) {
  const type = notification.type || ''
  const refType = notification.referenceType || 'NONE'
  const priority = notification.priority || 'LOW'

  // Vehicles
  if (refType === 'VEHICLE' || type.startsWith('VEHICLE_LISTING_')) {
    return {
      category: 'Vehicles',
      icon: CarFront,
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      pillClass: 'bg-blue-500/10 text-blue-600',
      actionPath: notification.referenceId ? `/cars/${notification.referenceId}` : '/cars',
    }
  }

  // Electronics
  if (refType === 'ELECTRONICS' || type.startsWith('ELECTRONICS_LISTING_')) {
    return {
      category: 'Electronics',
      icon: Laptop,
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      pillClass: 'bg-purple-500/10 text-purple-600',
      actionPath: notification.referenceId ? `/electronics/${notification.referenceId}` : '/electronics',
    }
  }

  // Properties
  if (refType === 'PROPERTY' || type.startsWith('PROPERTY_LISTING_')) {
    return {
      category: 'Properties',
      icon: Home,
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      pillClass: 'bg-emerald-500/10 text-emerald-600',
      actionPath: notification.referenceId ? `/properties/${notification.referenceId}` : '/properties',
    }
  }

  // Spare Parts
  if (refType === 'SPARE_PART' || type.startsWith('SPARE_PART_LISTING_')) {
    return {
      category: 'Spare Parts',
      icon: Wrench,
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      pillClass: 'bg-amber-500/10 text-amber-600',
      actionPath: notification.referenceId ? `/spare-parts/${notification.referenceId}` : '/spare-parts',
    }
  }

  // Leads & Inquiries
  if (
    refType === 'LEAD' ||
    refType === 'INQUIRY' ||
    refType === 'OFFER' ||
    refType === 'BOOKING' ||
    type === 'LEAD_CREATED' ||
    type === 'LEAD_RECEIVED'
  ) {
    return {
      category: 'Leads & Inquiries',
      icon: MessageSquare,
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      pillClass: 'bg-cyan-500/10 text-cyan-600',
      actionPath: '/dashboard',
    }
  }

  // User & Dealer KYC
  if (
    refType === 'USER_KYC' ||
    refType === 'USER_KYC_DOCUMENT' ||
    refType === 'DEALER_KYC' ||
    refType === 'DEALER_KYC_DOCUMENT' ||
    type.startsWith('USER_KYC_') ||
    type.startsWith('DEALER_KYC_')
  ) {
    const isFailed = type.includes('FAILED') || type.includes('REJECTED')
    return {
      category: 'KYC & Verification',
      icon: isFailed ? ShieldAlert : ShieldCheck,
      badgeClass: isFailed
        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      pillClass: isFailed ? 'bg-rose-500/10 text-rose-600' : 'bg-teal-500/10 text-teal-600',
      actionPath: '/kyc',
    }
  }

  // Dealer Store
  if (
    refType === 'DEALER_STORE' ||
    refType === 'DEALER_STORE_INSPECTION' ||
    type.startsWith('STORE_')
  ) {
    return {
      category: 'Dealer Store',
      icon: Store,
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      pillClass: 'bg-indigo-500/10 text-indigo-600',
      actionPath: '/dashboard',
    }
  }

  // Reviews
  if (type === 'SELLER_REVIEW_CREATED' || type === 'SELLER_REVIEW_RECEIVED') {
    return {
      category: 'Seller Review',
      icon: Star,
      badgeClass: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      pillClass: 'bg-yellow-500/10 text-yellow-600',
      actionPath: '/dashboard',
    }
  }

  // User / Dealer / Admin Account Lifecycle
  if (
    type.startsWith('USER_') ||
    type.startsWith('DEALER_') ||
    type.startsWith('ADMIN_')
  ) {
    const isDeactivated = type.includes('DEACTIVATED') || type.includes('FAILED')
    return {
      category: 'Account',
      icon: isDeactivated ? UserX : UserCheck,
      badgeClass: isDeactivated
        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
        : 'bg-sky-500/10 text-sky-600 border-sky-500/20',
      pillClass: isDeactivated ? 'bg-rose-500/10 text-rose-600' : 'bg-sky-500/10 text-sky-600',
      actionPath: '/profile',
    }
  }

  // System Announcement
  if (type === 'SYSTEM_ANNOUNCEMENT') {
    return {
      category: 'Announcement',
      icon: Sparkles,
      badgeClass: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      pillClass: 'bg-violet-500/10 text-violet-600',
      actionPath: null,
    }
  }

  // Fallback based on Priority
  if (priority === 'HIGH') {
    return {
      category: 'Urgent',
      icon: AlertTriangle,
      badgeClass: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      pillClass: 'bg-rose-500/10 text-rose-600',
      actionPath: null,
    }
  }

  return {
    category: 'General',
    icon: Bell,
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    pillClass: 'bg-primary/10 text-primary',
    actionPath: null,
  }
}

/**
 * Returns priority badge styles for HIGH, MEDIUM, LOW
 */
export function getPriorityBadge(priority) {
  switch (priority) {
    case 'HIGH':
      return {
        label: 'High',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      }
    case 'MEDIUM':
      return {
        label: 'Medium',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      }
    case 'LOW':
    default:
      return {
        label: 'Low',
        className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
      }
  }
}
