import { motion } from 'framer-motion'
import { Compass, Home, Search } from 'lucide-react'
import Button from '../components/buttons/Button'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-primary text-white shadow-lift"
      >
        <Compass size={44} aria-hidden="true" />
      </motion.div>
      <p className="text-7xl font-black text-text-light sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-text sm:text-3xl">This page took a wrong turn</h1>
      <p className="mt-3 max-w-md text-sm text-text-secondary">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved. Let&rsquo;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" variant="primary" icon={Home}>
          Back to Home
        </Button>
        <Button to="/cars" variant="outline" icon={Search}>
          Browse Listings
        </Button>
      </div>
    </div>
  )
}
