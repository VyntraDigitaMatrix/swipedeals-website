import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import manImg from '../../assets/categories/Man.png'
import ctaImg from '../../assets/categories/CTA.png'

function AppleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.1.65-2.73 1.4-.56.64-1.04 1.72-.94 2.76 1.07.08 2.06-.57 2.66-1.29z" />
    </svg>
  )
}

function GooglePlayIcon({ className = 'w-5 h-5' }) {
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

export default function CTA() {
  return (
    <section
      className="container-page py-6 sm:py-8 space-y-6 sm:space-y-8 bg-[#FFFFFF]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── Banner 1: Start Selling on SwipeDeals ── */}
      <div className="relative pt-4 sm:pt-6">
        <div className="relative rounded-2xl bg-[#FDEAE9] border border-[#F9D7D7]/60 px-5 py-5 sm:px-8 sm:py-6 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xs">
          {/* Left: Man image */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="relative shrink-0 w-28 sm:w-36 md:w-44 lg:w-48 self-end -mt-8 sm:-mt-12 md:-mt-14 -mb-5 sm:-mb-6 pointer-events-none">
              <img
                src={manImg}
                alt="Start selling on SwipeDeals"
                className="w-full h-auto object-contain object-bottom drop-shadow-sm"
                loading="lazy"
              />
            </div>

            {/* Middle: Content */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">
                Start Selling on SwipeDeals
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl font-normal leading-relaxed">
                List your car, property, electronics or spare parts and reach thousands of buyers.
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="shrink-0 w-full md:w-auto flex justify-end">
            <Link
              to="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8091E] hover:bg-[#A90718] px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span>Create a Free Listing</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Banner 2: Get the SwipeDeals App (Uses CTA.png as background with content overlaid) ── */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xs min-h-[160px] sm:min-h-[190px] md:min-h-[220px] flex items-center">
        {/* Background CTA.png image covering the entire container */}
        <img
          src={ctaImg}
          alt="Get the SwipeDeals App"
          className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
          loading="lazy"
        />

        {/* Subtle mobile readability gradient for very small screens */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#590408]/90 via-[#590408]/60 to-transparent sm:hidden pointer-events-none"
          aria-hidden="true"
        />

        {/* Content placed directly over the left half of the CTA.png image */}
        <div className="relative z-10 px-6 py-6 sm:px-10 sm:py-8 md:px-12 md:py-8 max-w-lg">
          <h2 className="text-xl sm:text-2xl md:text-[28px] text-white tracking-tight leading-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
            Get the SwipeDeals App
          </h2>
          <p className="text-xs sm:text-sm text-[#F3DEDE] mt-1.5" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular' }}>
            Buy, sell and manage your listings on the go.
          </p>

          {/* App download buttons */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-lg bg-black border border-white/20 px-3.5 py-2 text-white hover:bg-neutral-900 transition-transform duration-200 hover:scale-[1.03]"
            >
              <AppleIcon className="w-5 h-5 text-white shrink-0" />
              <div className="text-left">
                <span className="block text-[8px] sm:text-[9px] text-white/75 leading-none">
                  Download on the
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-white leading-tight mt-0.5">
                  App Store
                </span>
              </div>
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-lg bg-black border border-white/20 px-3.5 py-2 text-white hover:bg-neutral-900 transition-transform duration-200 hover:scale-[1.03]"
            >
              <GooglePlayIcon className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-white/75 leading-none">
                  GET IT ON
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-white leading-tight mt-0.5">
                  Google Play
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
