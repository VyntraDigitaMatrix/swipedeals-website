// Mock data layer for the Vehicle Services suite (Challan Payment, RC / Vehicle
// Details lookup, Finance and Insurance). There is no real government (VAHAN),
// payment gateway or insurer backend here — every lookup is derived
// deterministically from the entered registration number so the same input
// always produces the same, realistic-looking result.

const STATE_CODES = {
  MH: 'Maharashtra', DL: 'Delhi', KA: 'Karnataka', TN: 'Tamil Nadu', UP: 'Uttar Pradesh',
  GJ: 'Gujarat', RJ: 'Rajasthan', WB: 'West Bengal', TS: 'Telangana', AP: 'Andhra Pradesh',
  PB: 'Punjab', HR: 'Haryana', KL: 'Kerala', MP: 'Madhya Pradesh', BR: 'Bihar',
}

const RTO_CITY = {
  MH: ['Mumbai Central', 'Pune', 'Nashik', 'Nagpur'],
  DL: ['Delhi Central', 'Dwarka', 'Rohini'],
  KA: ['Bengaluru Central', 'Mysuru', 'Mangaluru'],
  TN: ['Chennai Central', 'Coimbatore', 'Madurai'],
  UP: ['Lucknow', 'Noida', 'Kanpur'],
  GJ: ['Ahmedabad', 'Surat', 'Vadodara'],
  RJ: ['Jaipur', 'Jodhpur', 'Udaipur'],
  WB: ['Kolkata Central', 'Howrah', 'Siliguri'],
  TS: ['Hyderabad Central', 'Warangal'],
  AP: ['Vijayawada', 'Visakhapatnam'],
  PB: ['Ludhiana', 'Amritsar', 'Chandigarh'],
  HR: ['Gurugram', 'Faridabad', 'Panipat'],
  KL: ['Kochi', 'Thiruvananthapuram'],
  MP: ['Bhopal', 'Indore'],
  BR: ['Patna', 'Gaya'],
}

const OWNER_NAMES = [
  'Rohan Mehta', 'Ananya Sharma', 'Vikram Singh', 'Priya Nair', 'Arjun Reddy', 'Sneha Iyer',
  'Karan Malhotra', 'Divya Kapoor', 'Aditya Verma', 'Meera Pillai', 'Rahul Gupta', 'Kavya Menon',
]

const MODELS = [
  { make: 'Maruti Suzuki', model: 'Swift VXI', fuel: 'Petrol' },
  { make: 'Hyundai', model: 'Creta SX', fuel: 'Petrol' },
  { make: 'Tata', model: 'Nexon XZ+', fuel: 'Diesel' },
  { make: 'Honda', model: 'City ZX', fuel: 'Petrol' },
  { make: 'Toyota', model: 'Innova Crysta', fuel: 'Diesel' },
  { make: 'Kia', model: 'Seltos HTX', fuel: 'Diesel' },
  { make: 'Mahindra', model: 'XUV700 AX7', fuel: 'Diesel' },
  { make: 'Volkswagen', model: 'Virtus GT', fuel: 'Petrol' },
  { make: 'MG', model: 'ZS EV', fuel: 'Electric' },
  { make: 'Skoda', model: 'Slavia Style', fuel: 'Petrol' },
]

const COLORS = ['Pearl White', 'Midnight Black', 'Silver Metallic', 'Deep Maroon', 'Storm Grey', 'Racing Red']

const FINANCIERS = ['HDFC Bank', 'ICICI Bank', 'Bajaj Finserv', 'SBI', 'Axis Bank', null, null]

const OFFENSES = [
  { label: 'Overspeeding', amount: 1000 },
  { label: 'Signal Jumping', amount: 1500 },
  { label: 'No Helmet', amount: 500 },
  { label: 'Triple Riding', amount: 1000 },
  { label: 'Wrong-Side Driving', amount: 2000 },
  { label: 'No Seatbelt', amount: 1000 },
  { label: 'Illegal Parking', amount: 500 },
  { label: 'Driving Without Valid PUC', amount: 2000 },
  { label: 'Using Phone While Driving', amount: 5000 },
]

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function normalizeRegNumber(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function isValidRegNumber(value) {
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(normalizeRegNumber(value))
}

function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function maskMiddle(value) {
  if (value.length <= 6) return value
  return `${value.slice(0, 4)}${'•'.repeat(value.length - 8)}${value.slice(-4)}`
}

/** Deterministic mock RC / vehicle-details lookup, seeded by the reg number. */
export function deriveVehicleDetails(regNumberRaw) {
  const reg = normalizeRegNumber(regNumberRaw)
  const seed = hashSeed(reg)
  const stateCode = reg.slice(0, 2)
  const stateName = STATE_CODES[stateCode] || 'Maharashtra'
  const cities = RTO_CITY[stateCode] || RTO_CITY.MH
  const rtoCity = cities[seed % cities.length]
  const rtoCode = `${stateCode}-${(1 + (seed % 40)).toString().padStart(2, '0')}`

  const vehicle = MODELS[seed % MODELS.length]
  const owner = OWNER_NAMES[seed % OWNER_NAMES.length]
  const color = COLORS[seed % COLORS.length]
  const financier = FINANCIERS[seed % FINANCIERS.length]

  const regYearsAgo = 1 + (seed % 11)
  const regDate = addMonths(new Date(), -regYearsAgo * 12 - (seed % 12))

  const insuranceOffsetMonths = (seed % 15) - 3 // can be slightly negative (expired) for realism
  const insuranceValidTill = addMonths(new Date(), insuranceOffsetMonths)
  const pucValidTill = addMonths(new Date(), ((seed >> 2) % 8) - 2)
  const fitnessValidTill = addMonths(regDate, 15 * 12)

  const chassisNumber = maskMiddle(`MA3${(seed % 999999).toString().padStart(9, '0')}`)
  const engineNumber = maskMiddle(`E${(seed % 999999999).toString().padStart(10, '0')}`)

  return {
    regNumber: `${reg.slice(0, 2)} ${reg.slice(2, 4)} ${reg.slice(4, -4)} ${reg.slice(-4)}`,
    ownerName: owner,
    make: vehicle.make,
    model: vehicle.model,
    fuelType: vehicle.fuel,
    color,
    vehicleClass: 'Motor Car (LMV)',
    registrationDate: formatDate(regDate),
    rtoOffice: `${rtoCity} RTO`,
    rtoCode,
    stateName,
    chassisNumber,
    engineNumber,
    insuranceValidTill: formatDate(insuranceValidTill),
    insuranceExpired: insuranceValidTill < new Date(),
    pucValidTill: formatDate(pucValidTill),
    pucExpired: pucValidTill < new Date(),
    fitnessValidTill: formatDate(fitnessValidTill),
    financier,
    rcStatus: 'Active',
  }
}

/** Deterministic mock challan list, seeded by the reg number. 0–3 challans. */
export function deriveChallans(regNumberRaw) {
  const reg = normalizeRegNumber(regNumberRaw)
  const seed = hashSeed(reg)
  const count = seed % 4 // 0 to 3

  return Array.from({ length: count }, (_, i) => {
    const s = seed + i * 97
    const offense = OFFENSES[s % OFFENSES.length]
    const daysAgo = 5 + (s % 150)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    const cities = RTO_CITY[reg.slice(0, 2)] || RTO_CITY.MH
    return {
      id: `CHL${reg}${i}`,
      challanNumber: `TN${date.getFullYear()}${(s % 100000).toString().padStart(6, '0')}`,
      offense: offense.label,
      amount: offense.amount,
      date: formatDate(date),
      location: `${cities[s % cities.length]}, ${STATE_CODES[reg.slice(0, 2)] || 'Maharashtra'}`,
      status: s % 5 === 0 ? 'Paid' : 'Pending',
    }
  })
}

export const insurancePlans = [
  {
    id: 'third-party',
    name: 'Third-Party',
    priceFrom: 2072,
    tagline: 'Legally mandatory minimum cover',
    coverage: [
      'Covers damage to third-party vehicle & property',
      'Covers third-party injury or death',
      'No cover for your own vehicle',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    priceFrom: 5480,
    tagline: 'Most popular — covers your car too',
    popular: true,
    coverage: [
      'Everything in Third-Party, plus:',
      'Covers damage to your own vehicle',
      'Covers theft, fire & natural disasters',
      'Add-ons available (zero dep, engine protect)',
    ],
  },
  {
    id: 'zero-dep',
    name: 'Zero Depreciation',
    priceFrom: 8340,
    tagline: 'Maximum claim payout, no deductions',
    coverage: [
      'Everything in Comprehensive, plus:',
      'Full claim value — no depreciation cut',
      'Ideal for cars under 5 years old',
      'Unlimited zero-dep claims on select plans',
    ],
  },
]

export const insurancePartners = ['ICICI Lombard', 'HDFC Ergo', 'Bajaj Allianz', 'Tata AIG', 'Digit Insurance']

/** Deterministic mock premium estimate for a plan, seeded by the vehicle identifier entered. */
export function estimatePremium(seedInput, basePrice) {
  const seed = hashSeed(seedInput.toUpperCase())
  const multiplier = 0.85 + (seed % 41) / 100 // 0.85 – 1.25
  const premium = Math.round((basePrice * multiplier) / 10) * 10
  const gst = Math.round(premium * 0.18)
  return { premium, gst, total: premium + gst }
}

export const financePartners = [
  { id: 'hdfc', name: 'HDFC Bank', rateFrom: 8.5, maxTenure: 84, processingFee: '0.5%', maxFunding: '90%' },
  { id: 'icici', name: 'ICICI Bank', rateFrom: 8.75, maxTenure: 84, processingFee: '0.5% – 1%', maxFunding: '85%' },
  { id: 'sbi', name: 'SBI', rateFrom: 8.65, maxTenure: 84, processingFee: '0.4%', maxFunding: '90%' },
  { id: 'axis', name: 'Axis Bank', rateFrom: 9.0, maxTenure: 72, processingFee: '1%', maxFunding: '85%' },
  { id: 'bajaj', name: 'Bajaj Finserv', rateFrom: 9.25, maxTenure: 60, processingFee: '1% – 2%', maxFunding: '80%' },
]

export const financeEligibility = [
  'Age between 21 and 65 years at loan maturity',
  'Minimum monthly income of ₹15,000 (salaried) or ITR of ₹2L+ (self-employed)',
  'Valid KYC — PAN card & address proof',
  'CIBIL score of 700+ recommended for best rates',
]
