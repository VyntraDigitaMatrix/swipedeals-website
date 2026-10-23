import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Fuel,
  Info,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Tag,
  User,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import { normalizeRegNumber } from '../data/vehicleServices'

function IndianNumberPlate({ regNo = 'TS 09 EK 2024' }) {
  return (
    <div className="relative inline-flex items-center h-[52px] rounded-lg border-2 border-[#1E293B] bg-white shadow-xs overflow-hidden select-none shrink-0">
      {/* Blue IND left strip */}
      <div className="flex flex-col items-center justify-center w-7 h-full bg-[#003399] py-1 text-white">
        <span className="text-[9px] font-bold tracking-tighter leading-none">IND</span>
      </div>

      {/* Number text */}
      <div className="px-3.5 flex items-center">
        <span
          className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-wider"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}
        >
          {regNo}
        </span>
      </div>
    </div>
  )
}

function ValidPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EDFBF2] px-2 py-0.5 text-[11px] font-semibold text-[#16A34A]">
      <Check size={12} strokeWidth={2.5} />
      <span>Valid</span>
    </span>
  )
}

function formatDisplayReg(num) {
  if (!num) return 'TS 09 EK 2024'
  const norm = normalizeRegNumber(num)
  return norm.replace(/([A-Z]{2})(\d{2})([A-Z]+)(\d+)/, '$1 $2 $3 $4') || num
}

export default function RcDetails() {
  const { rcNumber } = useParams()
  const navigate = useNavigate()

  const currentReg = formatDisplayReg(rcNumber || 'TS 09 EK 2024')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [rcNumber])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  const handleModalSearch = (e) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    const cleanReg = normalizeRegNumber(searchInput.trim())
    setShowSearchModal(false)
    setSearchInput('')
    navigate(`/rc-status/${cleanReg}`)
  }

  return (
    <div
      className="relative min-h-screen bg-[#FFFFFF] overflow-hidden py-6 sm:py-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background ambient flows - only on details page */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[250px] -left-[140px] w-[450px] h-[450px] rounded-full blur-[100px] opacity-90"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 205, 211, 0.7) 0%, rgba(255, 228, 230, 0.45) 50%, rgba(255, 255, 255, 0) 75%)',
          }}
        />
        <div
          className="absolute top-[280px] -right-[150px] w-[600px] h-[700px] rounded-full blur-[110px] opacity-90"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 215, 205, 0.65) 0%, rgba(254, 240, 235, 0.4) 50%, rgba(255, 255, 255, 0) 75%)',
          }}
        />
        <div
          className="absolute top-[800px] -left-[220px] w-[550px] h-[600px] rounded-full blur-[110px] opacity-90"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 215, 215, 2.6) 0%, rgba(255, 235, 240, 0.35) 50%, rgba(255, 255, 255, 0) 75%)',
          }}
        />
      </div>

      <div className="container-page relative z-10 max-w-6xl">
        {/* Breadcrumb with interactive back to form */}
        <Breadcrumb
          items={[
            { label: 'Vehicle Services', to: '/' },
            { label: 'RC Status', to: '/rc-status' },
            { label: currentReg },
          ]}
        />

        {/* ── Top Main Vehicle Card ── */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
          {/* Top Row: Plate, Title, Specs, Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* License Plate */}
              <IndianNumberPlate regNo={currentReg} />

              {/* Title & Quick specs */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  Mahindra XUV700 AX5
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Car size={14} className="text-[#64748B]" /> Car
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Fuel size={14} className="text-[#64748B]" /> Diesel
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#64748B]" /> Registered 2014
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#64748B]" /> TS-09, Telangana
                  </span>
                </div>
              </div>
            </div>

            {/* Right Buttons: Refresh & Check another vehicle */}
            <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#374151] hover:bg-gray-50 transition shadow-2xs cursor-pointer"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#D5112A]' : 'text-[#64748B]'} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate('/rc-status')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center rounded-lg border border-[#D5112A] bg-white px-4 py-2 text-xs font-semibold text-[#D5112A] hover:bg-red-50/50 transition cursor-pointer"
              >
                Check another vehicle
              </button>
            </div>
          </div>

          {/* Green Status Banner inside the card */}
          <div className="mt-6 rounded-xl bg-[#EDFBF2] border border-[#B8EDCB] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#D1F7DE] flex items-center justify-center text-[#16A34A] shrink-0">
                <ShieldCheck size={20} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">
                  RC is active · Clean record
                </p>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Valid registration, insurance and PUC, no open loan and no pending challans.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#16A34A] self-start sm:self-center shrink-0">
              <Check size={15} strokeWidth={2.5} />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* ── Details Grid: 2 Columns for 4 Cards + 1 Column for Sidebar ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: 4 Section Cards in 2x2 Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Registration Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0">
                  <FileText size={18} strokeWidth={2} />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Registration</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Registration no.</span>
                  <span className="font-bold text-[#0F172A]">{currentReg}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Registering authority</span>
                  <span className="font-semibold text-[#0F172A]">TS-09, Telangana</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Registration date</span>
                  <span className="font-semibold text-[#0F172A]">14 Dec 2014</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Fitness / RC valid upto</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A]">14 Dec 2029</span>
                    <ValidPill />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Road tax</span>
                  <span className="font-semibold text-[#0F172A]">Lifetime tax (LTT)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">RC status</span>
                  <span className="font-bold text-[#16A34A]">Active</span>
                </div>
              </div>
            </div>

            {/* 2. Ownership Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0">
                  <User size={18} strokeWidth={2} />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Ownership</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Owner name</span>
                  <span className="font-bold text-[#0F172A]">S••••• B••••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Ownership</span>
                  <span className="font-semibold text-[#0F172A]">1st owner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Financed by</span>
                  <span className="font-semibold text-[#0F172A]">Not financed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">NOC issued</span>
                  <span className="font-semibold text-[#0F172A]">No</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Blacklist status</span>
                  <span className="font-semibold text-[#0F172A]">Not blacklisted</span>
                </div>
              </div>
            </div>

            {/* 3. Insurance & PUC Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0">
                  <Shield size={18} strokeWidth={2} />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Insurance &amp; PUC</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Insurer</span>
                  <span className="font-bold text-[#0F172A]">ICICI Lombard</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Policy no.</span>
                  <span className="font-semibold text-[#0F172A]">••••••9644</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Insurance valid upto</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A]">24 Aug 2027</span>
                    <ValidPill />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">PUC valid upto</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A]">24 Jan 2027</span>
                    <ValidPill />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Emission norms</span>
                  <span className="font-semibold text-[#0F172A]">BS IV</span>
                </div>
              </div>
            </div>

            {/* 4. Vehicle Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-[#FFEDD5] flex items-center justify-center text-[#EA580C] shrink-0">
                  <Car size={18} strokeWidth={2} />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Vehicle</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Maker / model</span>
                  <span className="font-bold text-[#0F172A]">Mahindra XUV700 AX5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Vehicle class</span>
                  <span className="font-semibold text-[#0F172A]">Motor Car (LMV)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Fuel type</span>
                  <span className="font-semibold text-[#0F172A]">Diesel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Engine capacity</span>
                  <span className="font-semibold text-[#0F172A]">1493 cc</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Colour</span>
                  <span className="font-semibold text-[#0F172A]">Magma Grey</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Seating</span>
                  <span className="font-semibold text-[#0F172A]">7 seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Chassis no.</span>
                  <span className="font-semibold text-[#0F172A]">MAL•••••••••53804</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Engine no.</span>
                  <span className="font-semibold text-[#0F172A]">L15•••••4256</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column: 3 Cards */}
          <div className="flex flex-col gap-5">
            {/* Card A: Traffic challans */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={17} className="text-[#0F172A]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Traffic challans</h3>
              </div>
              <p className="text-xs text-[#64748B] mb-4">No pending challans on this vehicle.</p>
              <Link
                to="/challan-payment"
                className="w-full inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-2.5 text-xs font-semibold text-[#1F2937] hover:bg-gray-50 transition shadow-2xs"
              >
                View challan history
              </Link>
            </div>

            {/* Card B: Buying this car? */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-3.5">
                <ClipboardCheck size={18} className="text-[#0F172A]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Buying this car?</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-[#374151]">
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Match the owner name with the seller&apos;s ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>No loan to close — good to go</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Check that insurance is transferred to you</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Clear pending challans before the transfer</span>
                </li>
              </ul>
            </div>

            {/* Card C: Selling this car? */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={17} className="text-[#0F172A]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Selling this car?</h3>
              </div>
              <p className="text-xs text-[#64748B] mb-4">
                List it for free, or put it up on SwipeAuctions for the best price.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <Link to="/sell/car" className="text-[#D5112A] hover:underline">
                  Sell on SwipeDeals
                </Link>
                <Link to="/sell/car/auction" className="text-[#2563EB] hover:underline">
                  SwipeAuctions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Disclaimer ── */}
        <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 text-xs text-[#64748B]">
          <Info size={15} className="shrink-0 text-[#858D9D]" />
          <span>Preview: RC details are sample data generated from the vehicle number.</span>
        </div>
      </div>

      {/* ── Check another vehicle Modal (optional popup fallback) ── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold text-[#0F172A]">Check another vehicle RC</h3>
            <p className="mt-1 text-xs text-[#64748B]">
              Enter registration number (e.g. TS 09 EK 2024 or DL 01 AB 1234)
            </p>

            <form onSubmit={handleModalSearch} className="mt-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="TS 09 EK 2024"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm uppercase font-semibold text-gray-900 focus:border-[#D5112A] focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D5112A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#A90718] transition shadow-sm"
                >
                  Lookup RC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
