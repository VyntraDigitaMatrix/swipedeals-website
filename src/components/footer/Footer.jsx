import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Used Cars', to: '/cars/used' },
      { label: 'New Cars', to: '/cars/new' },
      { label: 'Commercial Vehicles', to: '/commercial-vehicles' },
      { label: 'Electronics', to: '/electronics' },
      { label: 'Spare Parts', to: '/spare-parts' },
      { label: 'Properties', to: '/properties' },
    ],
  },
  {
    title: 'For Sellers',
    links: [
      { label: 'Start Selling', to: '/sell' },
      { label: 'Sell a Car', to: '/sell/car' },
      { label: 'Join as a Dealer', to: '/sell/car/dealer' },
      { label: 'List a Property', to: '/sell?category=properties' },
      { label: 'Dealer Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Vehicle Services',
    links: [
      { label: 'Challan Payment', to: '/challan-payment' },
      { label: 'RC / Vehicle Details', to: '/vehicle-info' },
      { label: 'Car Finance', to: '/finance' },
      { label: 'Car Insurance', to: '/insurance' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-text text-white">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-lg font-black text-white">S</span>
              <span className="text-lg font-extrabold">SwipeDeals</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Buy • Sell • Discover Everything. India&rsquo;s premium marketplace for cars, properties, electronics and more — all verified, all in one place.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-secondary" aria-hidden="true" /> Bandra Kurla Complex, Mumbai, India
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-secondary" aria-hidden="true" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-secondary" aria-hidden="true" /> support@swipedeals.in
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} SwipeDeals Technologies Pvt. Ltd. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {[FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
