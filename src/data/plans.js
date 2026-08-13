// Paid plans for dealers / bulk sellers. Individual sellers listing a single
// item never need a plan — posting stays free for them (still admin-approved).
export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    listingCap: 10,
    features: ['10 active listings', 'Standard search placement', 'Email support', 'Basic lead notifications'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2999,
    listingCap: 50,
    popular: true,
    features: ['50 active listings', 'Priority search placement', 'Verified dealer badge', 'Instant lead notifications', 'Public storefront page'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 7999,
    listingCap: 'Unlimited',
    features: ['Unlimited active listings', 'Featured homepage placement', 'Dedicated account manager', 'Priority admin review', 'Public storefront page', 'Bulk upload tools'],
  },
]

export const getPlanById = (id) => plans.find((p) => p.id === id)

export default plans
