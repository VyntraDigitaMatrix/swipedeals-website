import { Outlet, useLocation } from 'react-router-dom'
import TopBar from '../navigation/TopBar'
import Navbar from '../navigation/Navbar'
import SubBar from '../navigation/SubBar'
import Footer from '../footer/Footer'
import FloatingActionButton from '../buttons/FloatingActionButton'
import CompareBar from '../common/CompareBar'
import ScrollToTop from './ScrollToTop'
import MobileBottomNav from '../navigation/MobileBottomNav'

const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export default function Layout() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.some((path) => location.pathname.startsWith(path))

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <ScrollToTop />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButton />
      <CompareBar />
      <MobileBottomNav />
    </div>
  )
}
