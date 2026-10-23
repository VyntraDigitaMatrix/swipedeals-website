import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/routing/PrivateRoute'

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
import UserVerified from './pages/UserVerified'
import UserActivation from './pages/UserActivation'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import ListingDetails from './pages/ListingDetails'
import DealerStorefront from './pages/DealerStorefront'
import ChallanPayment from './pages/ChallanPayment'
import ChallanDetails from './pages/ChallanDetails'
import VehicleInfo from './pages/VehicleInfo'
import RcDetails from './pages/RcDetails'
import Finance from './pages/Finance'
import Insurance from './pages/Insurance'
import Compare from './pages/Compare'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
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
        <Route path="/sell/cars" element={<SellProduct />} />
        <Route path="/sell/cars/add-vehicle" element={<SellProduct />} />
        <Route path="/sell/cars/:slug" element={<SellProduct />} />
        <Route path="/sell/car" element={<SellCarOptions />} />
        <Route path="/sell/car/verify" element={<SellCarVerification />} />
        <Route path="/sell/car/dealer" element={<SellCarDealer />} />
        <Route path="/sell/car/auction" element={<SellCarAuction />} />
        <Route path="/sell/spare-parts" element={<SellSparePart />} />
        <Route path="/sell/spare-parts/add-part" element={<SellSparePart />} />
        <Route path="/sell/spare-parts/:slug" element={<SellSparePart />} />
        <Route path="/sell/electronics" element={<SellElectronics />} />
        <Route path="/sell/electronics/add-item" element={<SellElectronics />} />
        <Route path="/sell/electronics/:slug" element={<SellElectronics />} />
        <Route path="/sell/properties" element={<SellProperty />} />
        <Route path="/sell/properties/add-property" element={<SellProperty />} />
        <Route path="/sell/properties/:slug" element={<SellProperty />} />
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/kyc/callback" element={<Kyc />} />
        <Route path="/user-verified" element={<UserVerified />} />
        <Route path="/user-activation" element={<UserActivation />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
        </Route>
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />

        <Route path="/challan-payment" element={<ChallanPayment />} />
        <Route path="/challan-payment/:rcNumber" element={<ChallanDetails />} />
        <Route path="/challan" element={<ChallanPayment />} />
        <Route path="/challan/:rcNumber" element={<ChallanDetails />} />
        <Route path="/vehicle-info" element={<VehicleInfo />} />
        <Route path="/vehicle-info/:rcNumber" element={<RcDetails />} />
        <Route path="/rc-status" element={<VehicleInfo />} />
        <Route path="/rc-status/:rcNumber" element={<RcDetails />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/:dealerSlug" element={<DealerStorefront />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App
