import { Outlet } from 'react-router-dom'
import TopBar from '../navigation/TopBar'
import Navbar from '../navigation/Navbar'
import SubBar from '../navigation/SubBar'
import Footer from '../footer/Footer'
import FloatingActionButton from '../buttons/FloatingActionButton'
import CompareBar from '../common/CompareBar'
import ScrollToTop from './ScrollToTop'
import MobileBottomNav from '../navigation/MobileBottomNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <TopBar />
      <Navbar />
      <SubBar />
      <main className="flex-1 pb-16 xl:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButton />
      <CompareBar />
      <MobileBottomNav />
    </div>
  )
}
