// Formats a number as Indian Rupee currency, condensing large values (Lakh / Crore)
// e.g. 2450000 -> "₹24.5 L", 52000000 -> "₹5.2 Cr"
export function formatCurrency(value) {
  if (value === 0) return '₹0'
  if (!value) return '—'
  const abs = Math.abs(value)
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
  if (abs >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, '')} L`
  if (abs >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, '')} K`
  return `₹${value.toLocaleString('en-IN')}`
}

// Full precision Rupee amount with Indian digit grouping, e.g. ₹24,50,000
export function formatCurrencyFull(value) {
  if (value === undefined || value === null) return '—'
  return `₹${Number(value).toLocaleString('en-IN')}`
}

export function formatNumber(value) {
  if (value === undefined || value === null) return '—'
  return Number(value).toLocaleString('en-IN')
}

export function formatCompactNumber(value) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`
  if (value >= 100000) return `${(value / 100000).toFixed(1).replace(/\.0$/, '')}L`
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${value}`
}

export function formatKm(value) {
  return `${formatNumber(value)} km`
}

export function timeAgo(daysAgo) {
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return `${daysAgo} days ago`
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`
}

export function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

