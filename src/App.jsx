import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'

import Home from './pages/Home'
import CarsListing from './pages/CarsListing'
import CarDetails from './pages/CarDetails'
import CommercialVehicles from './pages/CommercialVehicles'
import CommercialVehicleDetails from './pages/CommercialVehicleDetails'
import Electronics from './pages/Electronics'
import ElectronicsDetails from './pages/ElectronicsDetails'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import SpareParts from './pages/SpareParts'
import SparePartDetails from './pages/SparePartDetails'
import SellProduct from './pages/SellProduct'
import SellCarOptions from './pages/SellCarOptions'
import SellCarVerification from './pages/SellCarVerification'
import SellCarDealer from './pages/SellCarDealer'
import SellCarAuction from './pages/SellCarAuction'
import SellSparePart from './pages/SellSparePart'
import SellElectronics from './pages/SellElectronics'
import SellProperty from './pages/SellProperty'
import Kyc from './pages/Kyc'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import ListingDetails from './pages/ListingDetails'
import DealerStorefront from './pages/DealerStorefront'
import ChallanPayment from './pages/ChallanPayment'
import VehicleInfo from './pages/VehicleInfo'
import Finance from './pages/Finance'
import Insurance from './pages/Insurance'
import Compare from './pages/Compare'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQPage from './pages/FAQPage'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/cars" element={<CarsListing />} />
        <Route path="/cars/used" element={<CarsListing />} />
        <Route path="/cars/new" element={<CarsListing />} />
        <Route path="/cars/:id" element={<CarDetails />} />

        <Route path="/commercial-vehicles" element={<CommercialVehicles />} />
        <Route path="/commercial-vehicles/:id" element={<CommercialVehicleDetails />} />

        <Route path="/electronics" element={<Electronics />} />
        <Route path="/electronics/:id" element={<ElectronicsDetails />} />

        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        <Route path="/spare-parts" element={<SpareParts />} />
        <Route path="/spare-parts/:id" element={<SparePartDetails />} />

        <Route path="/sell" element={<SellProduct />} />
        <Route path="/sell/car" element={<SellCarOptions />} />
        <Route path="/sell/car/verify" element={<SellCarVerification />} />
        <Route path="/sell/car/dealer" element={<SellCarDealer />} />
        <Route path="/sell/car/auction" element={<SellCarAuction />} />
        <Route path="/sell/spare-parts" element={<SellSparePart />} />
        <Route path="/sell/electronics" element={<SellElectronics />} />
        <Route path="/sell/properties" element={<SellProperty />} />
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />

        <Route path="/challan-payment" element={<ChallanPayment />} />
        <Route path="/vehicle-info" element={<VehicleInfo />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Root-level dealer storefronts (swipedeals.com/dealername). React Router v6 always
            ranks static segments above dynamic ones, so this cannot shadow any route above. */}
        <Route path="/:dealerSlug" element={<DealerStorefront />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
