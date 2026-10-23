import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
} from 'react-icons/fa6'

import qrCodeImg from '../../assets/categories/qr-code.png'

function AppleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.1.65-2.73 1.4-.56.64-1.04 1.72-.94 2.76 1.07.08 2.06-.57 2.66-1.29z" />
    </svg>
  )
}

function GooglePlayIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.609 1.814c-.328.348-.521.879-.521 1.554v17.264c0 .675.193 1.206.521 1.554l.081.075 9.67-9.67v-.228L3.69 2.69l-.081-.876z"
        fill="#2196F3"
      />
      <path
        d="M16.577 15.793l-3.217-3.209v-.228l3.217-3.209.073.042 3.809 2.164c1.088.618 1.088 1.628 0 2.246l-3.809 2.164-.073.03z"
        fill="#FFC107"
      />
      <path
        d="M13.36 12.356L3.609 22.107c.358.38 1.018.428 1.782-.006l11.259-6.395-3.29-3.35z"
        fill="#F44336"
      />
      <path
        d="M13.36 11.644l3.29-3.35L5.391 1.899C4.627 1.465 3.967 1.513 3.609 1.893l9.751 9.751z"
        fill="#4CAF50"
      />
    </svg>
  )
}

function IndiaFlag({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 640 480" aria-hidden="true" className="rounded-[2px] shadow-2xs">
      <path fill="#f93" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#128807" d="M0 320h640v160H0z" />
      <g transform="translate(320 240)">
        <circle r="70" fill="none" stroke="#008" strokeWidth="6" />
        <circle r="15" fill="#008" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="-70"
            stroke="#008"
            strokeWidth="3"
            transform={`rotate(${i * 15})`}
          />
        ))}
      </g>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0D1E2A] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container-page pt-12 sm:pt-14 pb-8 sm:pb-6">
        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[2.4fr_0.8fr_0.9fr_1fr_1fr_1.3fr] gap-8 xl:gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:pr-6 xl:pr-10">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 select-none" aria-label="SwipeDeals Home">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md font-black text-lg italic tracking-tighter shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #EA1A31 0%, #C8091B 100%)',
                }}
              >
                S
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg text-white tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
                  Swipe<span className="text-[#E8182F]">Deals</span>
                </span>
                <span className="text-[11px] text-[#9AA4B0] tracking-wide" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
                  Trusted Marketplace
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="mt-4 text-[13px] text-[#B6BEC8] leading-relaxed max-w-[340px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
              A trusted buy and sell marketplace for cars, properties, electronics and spare parts.
            </p>
            <p className="mt-1.5 text-[13px] text-[#B6BEC8] leading-relaxed max-w-[340px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
              Verified sellers. Genuine listings. Better deals.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-5">
              {[
                { icon: FaInstagram, label: 'Instagram', href: '#' },
                { icon: FaFacebookF, label: 'Facebook', href: '#' },
                { icon: FaXTwitter, label: 'X (Twitter)', href: '#' },
                { icon: FaYoutube, label: 'YouTube', href: '#' },
                { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#FFFFFF] hover:text-white transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Buy */}
          <div>
            <h3 className="text-[15px] text-white mb-4 tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
              Buy
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Cars', to: '/cars' },
                { label: 'Properties', to: '/properties' },
                { label: 'Electronics', to: '/electronics' },
                { label: 'Spare Parts', to: '/spare-parts' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[13px] text-[#A9B2BD] hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Sell */}
          <div>
            <h3 className="text-[15px] text-white mb-4 tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
              Sell
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Sell Car', to: '/sell/car' },
                { label: 'Sell Property', to: '/sell/property' },
                { label: 'Sell Electronics', to: '/sell/electronics' },
                { label: 'Sell Spare Parts', to: '/sell/spare-parts' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[13px] text-[#A9B2BD] hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-[15px] text-white mb-4 tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Careers', to: '/about' },
                { label: 'Blog', to: '/about' },
                { label: 'Terms of Use', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Contact Us', to: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[13px] text-[#A9B2BD] hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Help & Support */}
          <div>
            <h3 className="text-[15px] text-white mb-4 tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
              Help & Support
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Center', to: '/faq' },
                { label: 'Safety Tips', to: '/faq' },
                { label: 'Report a Listing', to: '/contact' },
                { label: 'Sitemap', to: '/faq' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[13px] text-[#A9B2BD] hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Download App */}
          <div>
            <h3 className="text-[15px] text-white mb-4 tracking-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
              Download App
            </h3>
            <div className="flex items-center gap-3">
              {/* QR Code */}
              <div className="bg-white p-1 rounded-lg shrink-0 shadow-2xs">
                <img
                  src={qrCodeImg}
                  alt="Scan to download SwipeDeals App"
                  className="w-17 h-17 object-contain rounded-md"
                  loading="lazy"
                />
              </div>

              {/* App download badges */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md bg-black border border-white/20 px-3.5 py-2 text-white hover:bg-neutral-900 transition-transform duration-200 hover:scale-105"
                  aria-label="Download on App Store"
                >
                  <AppleIcon className="w-4 h-4 text-white shrink-0" />
                  <div className="text-left">
                    <span className="block text-[7px] text-white/75 leading-none">Download on the</span>
                    <span className="block text-[11px] font-semibold text-white leading-tight mt-0.5">
                      App Store
                    </span>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md bg-black border border-white/20 px-3.5 py-2 text-white hover:bg-neutral-900 transition-transform duration-200 hover:scale-105"
                  aria-label="Get it on Google Play"
                >
                  <GooglePlayIcon className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <span className="block text-[7px] uppercase tracking-wider text-white/75 leading-none">
                      GET IT ON
                    </span>
                    <span className="block text-[11px] font-semibold text-white leading-tight mt-0.5">
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-8 pt-6 border-t border-[#22323F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#A9B2BD]">
          <p>© 2026 SwipeDeals. All rights reserved.</p>

          <div className="flex items-center gap-2 text-white/90 font-medium text-[14px] cursor-pointer hover:text-white transition-colors pr-4 sm:pr-5">
            <IndiaFlag className="w-8 h-5" />
            <span>India</span>
            <ChevronDown size={14} className="text-[#D5DBE2]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
