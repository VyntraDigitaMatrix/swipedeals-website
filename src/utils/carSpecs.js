// Deterministically derives Spinny/Cars24-style extended specs, features and
// inspection-report data from a car's core fields. Same car always produces
// the same output (seeded by id) — no randomness, no per-car authoring needed.

const BODY_SPECS = {
  Sedan: { seating: 5, groundClearance: 165, bootSpace: 480, fuelTank: 45 },
  SUV: { seating: 5, groundClearance: 200, bootSpace: 400, fuelTank: 50 },
  Hatchback: { seating: 5, groundClearance: 165, bootSpace: 280, fuelTank: 37 },
  Electric: { seating: 5, groundClearance: 180, bootSpace: 350, fuelTank: null },
  Luxury: { seating: 5, groundClearance: 160, bootSpace: 530, fuelTank: 60 },
}

const FUEL_SPECS = {
  Petrol: { engineCC: '1497 cc', mileage: '17.4 kmpl', mileageLabel: 'Mileage' },
  Diesel: { engineCC: '1998 cc', mileage: '20.8 kmpl', mileageLabel: 'Mileage' },
  Electric: { engineCC: '—', mileage: '450 km', mileageLabel: 'Range', battery: '50.3 kWh' },
}

const INSPECTION_CATEGORIES = [
  'Engine & Transmission',
  'Suspension & Steering',
  'Electricals',
  'AC & Interior',
  'Tyres & Brakes',
  'Body & Paint',
]

const FEATURE_POOL = [
  'Sunroof', 'Alloy Wheels', 'Rear Parking Camera', 'Touchscreen Infotainment', 'Cruise Control',
  'Keyless Entry', 'Push Button Start', 'Automatic Climate Control', 'Rain-Sensing Wipers',
  'Wireless Charging', 'Ventilated Seats', 'Android Auto & CarPlay', 'ABS with EBD', 'Multiple Airbags',
  'Hill Assist Control', 'Rear Defogger', 'LED Headlamps', 'Steering Mounted Controls',
]

const COLORS = ['Pearl White', 'Meteor Grey', 'Midnight Black', 'Silky Silver', 'Deep Blue', 'Royal Maroon']

const RTO_BY_CITY = { Mumbai: 'MH-02', Bengaluru: 'KA-05', Chennai: 'TN-09', Delhi: 'DL-08', Pune: 'MH-14' }

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function deriveCarSpecs(car) {
  const seed = hashSeed(car.id)
  const body = BODY_SPECS[car.bodyType] || BODY_SPECS.Sedan
  const fuel = FUEL_SPECS[car.fuel] || FUEL_SPECS.Petrol
  const power = 110 + (seed % 90)
  const seating = car.bodyType === 'SUV' && seed % 3 === 0 ? 7 : body.seating

  const featureCount = 6 + (seed % 5)
  const features = Array.from({ length: featureCount }, (_, i) => FEATURE_POOL[(seed + i * 7) % FEATURE_POOL.length])
    .filter((f, i, arr) => arr.indexOf(f) === i)

  const statuses = ['Excellent', 'Good', 'Fair']
  const inspectionReport = INSPECTION_CATEGORIES.map((category, i) => {
    if (car.condition === 'new') return { category, status: 'Excellent' }
    const bias = car.rating >= 4.7 ? 0 : car.rating >= 4.4 ? 1 : 2
    const idx = Math.min(statuses.length - 1, ((seed + i * 13) % 2) + (bias > 0 ? 1 : 0))
    return { category, status: statuses[idx] }
  })
  const passedCount = inspectionReport.filter((r) => r.status !== 'Fair').length

  const cityKey = Object.keys(RTO_BY_CITY).find((c) => car.location.includes(c))

  return {
    engineCC: fuel.engineCC,
    power: fuel.engineCC === '—' ? `${power} bhp (motor)` : `${power} bhp`,
    mileage: fuel.mileage,
    mileageLabel: fuel.mileageLabel,
    battery: fuel.battery || null,
    seating: `${seating} Seater`,
    groundClearance: `${body.groundClearance} mm`,
    bootSpace: `${body.bootSpace} L`,
    fuelTank: body.fuelTank ? `${body.fuelTank} L` : 'N/A',
    color: COLORS[seed % COLORS.length],
    rto: RTO_BY_CITY[cityKey] || 'MH-01',
    insuranceValidTill: `Aug ${car.year + 5}`,
    features,
    inspectionReport,
    inspectionScore: `${passedCount}/${inspectionReport.length}`,
  }
}

export default deriveCarSpecs
