// Top-level marketplace categories shown on the Home page category grid.
// `color` maps to a semantic theme token (see src/theme/colors.js) used to
// tint each category's icon so the grid reads as distinct at a glance.
export const categories = [
  {
    id: 'used-cars',
    title: 'Used Cars',
    description: 'Certified pre-owned cars, inspected & verified',
    icon: 'CarFront',
    color: 'primary',
    listings: '48,200+',
    link: '/cars/used',
  },
  {
    id: 'new-cars',
    title: 'New Cars',
    description: 'Brand new cars at the best on-road prices',
    icon: 'Sparkles',
    color: 'success',
    listings: '2,100+',
    link: '/cars/new',
  },
  {
    id: 'commercial',
    title: 'Commercial Vehicles',
    description: 'Trucks, buses, tractors & construction equipment',
    icon: 'Truck',
    color: 'danger',
    listings: '9,600+',
    link: '/commercial-vehicles',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    description: 'Genuine & aftermarket parts for every vehicle',
    icon: 'Settings',
    color: 'warning',
    listings: '61,000+',
    link: '/spare-parts',
  },
  {
    id: 'electronics',
    title: 'Electronics',
    description: 'Mobiles, laptops, TVs, cameras & appliances',
    icon: 'Laptop',
    color: 'info',
    listings: '33,400+',
    link: '/electronics',
  },
  {
    id: 'properties',
    title: 'Properties',
    description: 'Apartments, villas, plots & commercial spaces',
    icon: 'Home',
    color: 'secondary',
    listings: '14,800+',
    link: '/properties',
  },
]

export default categories
