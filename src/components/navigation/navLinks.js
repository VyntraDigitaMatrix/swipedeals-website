// Simple links render as a single NavLink. Links with a `dropdown` array
// render as a hover/click dropdown (desktop) or an accordion (mobile).
export const navLinks = [
  { label: 'Home', to: '/' },
  {
    label: 'Cars',
    dropdown: [
      { label: 'Buy Cars', description: 'Browse used & new cars, all in one place', to: '/cars' },
      { label: 'Buy New Cars', description: 'Brand new cars at on-road prices', to: '/cars/new' },
      { label: 'Buy Used Cars', description: 'Certified, 200-point inspected pre-owned cars', to: '/cars/used' },
      { label: 'Sell Your Car', description: 'Verify, list, auction or go dealer', to: '/sell/car' },
    ],
  },
  {
    label: 'Commercial',
    dropdown: [
      { label: 'Buy Commercial Vehicles', description: 'Trucks, buses, tractors & construction equipment', to: '/commercial-vehicles' },
      { label: 'Sell Commercial Vehicle', description: 'List your fleet vehicle for free', to: '/sell?category=commercial' },
    ],
  },
  {
    label: 'Electronics',
    dropdown: [
      { label: 'Buy Electronics', description: 'Mobiles, laptops, TVs, cameras & more', to: '/electronics' },
      { label: 'Sell Electronics', description: 'List your gadget in a few steps', to: '/sell/electronics' },
    ],
  },
  {
    label: 'Spare Parts',
    dropdown: [
      { label: 'Buy Spare Parts', description: 'Genuine & aftermarket parts for every vehicle', to: '/spare-parts' },
      { label: 'Sell Spare Parts', description: 'Reach thousands of buyers instantly', to: '/sell/spare-parts' },
    ],
  },
  {
    label: 'Properties',
    dropdown: [
      { label: 'Buy Properties', description: 'Apartments, villas, plots & commercial spaces', to: '/properties' },
      { label: 'Sell Property', description: 'List your property with zero brokerage', to: '/sell/properties' },
    ],
  },
  {
    label: 'Services',
    alignRight: true,
    dropdown: [
      { label: 'Challan Payment', description: 'Check & pay traffic challans instantly', to: '/challan-payment' },
      { label: 'RC / Vehicle Details', description: 'Look up any vehicle by registration number', to: '/vehicle-info' },
      { label: 'Car Finance', description: 'Compare loan offers & calculate EMI', to: '/finance' },
      { label: 'Car Insurance', description: 'Compare plans & get an instant quote', to: '/insurance' },
    ],
  },
]

export default navLinks
