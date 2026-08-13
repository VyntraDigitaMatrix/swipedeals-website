// Mock data for the buyer-facing "My Dashboard" page.
// Dealers will get their own dedicated dashboard in a separate application.

export const browsingActivity = [
  { label: 'Feb', value: 24 },
  { label: 'Mar', value: 31 },
  { label: 'Apr', value: 28 },
  { label: 'May', value: 42 },
  { label: 'Jun', value: 38 },
  { label: 'Jul', value: 51 },
  { label: 'Aug', value: 46 },
]

export const inquiriesByWeek = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 0 },
  { label: 'Wed', value: 2 },
  { label: 'Thu', value: 1 },
  { label: 'Fri', value: 3 },
  { label: 'Sat', value: 2 },
  { label: 'Sun', value: 1 },
]

export const userOrders = [
  { id: 'ORD-2201', item: 'Bosch S4 Car Battery 65Ah', amount: 8499, status: 'Delivered', date: '2 Aug 2026' },
  { id: 'ORD-2198', item: 'Apple iPhone 15 Pro Max 256GB', amount: 139900, status: 'Shipped', date: '30 Jul 2026' },
  { id: 'ORD-2190', item: 'MRF ZLX 195/65 R15 Tyre (Set of 4)', amount: 24800, status: 'Processing', date: '27 Jul 2026' },
  { id: 'ORD-2183', item: 'Premium Leatherette Seat Cover Set', amount: 5200, status: 'Delivered', date: '22 Jul 2026' },
  { id: 'ORD-2176', item: 'Sony WH-1000XM5 Headphones', amount: 29990, status: 'Cancelled', date: '18 Jul 2026' },
]

export const userInquiries = [
  { id: 'INQ-501', dealer: 'Prestige Motors', item: 'BMW 5 Series 530i Sportline', status: 'Responded', date: '5 Aug 2026' },
  { id: 'INQ-498', dealer: 'Skyline Properties', item: 'Skyline Heights Apartment', status: 'Pending', date: '4 Aug 2026' },
  { id: 'INQ-495', dealer: 'Metro Wheels', item: 'Toyota Fortuner Legender', status: 'Responded', date: '4 Aug 2026' },
  { id: 'INQ-490', dealer: 'Prestige Motors', item: 'Hyundai Creta SX(O) Turbo', status: 'Closed', date: '2 Aug 2026' },
]

export const userMessages = [
  { id: 'M-1', name: 'Prestige Motors', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80', preview: 'Yes, the BMW is still available. Happy to schedule a test drive this weekend.', time: '10 min ago', unread: true },
  { id: 'M-2', name: 'Skyline Properties', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311b?auto=format&fit=crop&w=100&q=80', preview: 'Thanks for visiting yesterday — sending the documents shortly.', time: '2 hours ago', unread: true },
  { id: 'M-3', name: 'Metro Wheels', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311c?auto=format&fit=crop&w=100&q=80', preview: 'Best on-road price we can offer is ₹48.5L, all inclusive.', time: 'Yesterday', unread: false },
]

export default userOrders
