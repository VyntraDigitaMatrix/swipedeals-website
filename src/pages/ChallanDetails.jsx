import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Fuel,
  Gavel,
  Info,
  Lock,
  MapPin,
  RefreshCw,
  Shield,
  Tag,
  User,
  Zap,
} from 'lucide-react'
import { normalizeRegNumber } from '../data/vehicleServices'

function IndianNumberPlate({ regNo = 'AP 16 BK 1000' }) {
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

function formatDisplayReg(num) {
  if (!num) return 'AP 16 BK 1000'
  const norm = normalizeRegNumber(num)
  return norm.replace(/([A-Z]{2})(\d{2})([A-Z]+)(\d+)/, '$1 $2 $3 $4') || num
}

export default function ChallanDetails() {
  const { rcNumber } = useParams()
  const navigate = useNavigate()

  const currentReg = formatDisplayReg(rcNumber || 'AP 16 BK 1000')
  const [activeTab, setActiveTab] = useState('pending') // 'pending' | 'paid'
  const [selectedPayable, setSelectedPayable] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [isPaidSuccess, setIsPaidSuccess] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCourtModal, setShowCourtModal] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [rcNumber])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  const handlePay = () => {
    if (!selectedPayable || isPaidSuccess) return
    setIsPaying(true)
    setTimeout(() => {
      setIsPaying(false)
      setIsPaidSuccess(true)
    }, 900)
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
        {/* Breadcrumb: Home > Challan > AP 16 BK 1000 */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs text-[#64748B]">
          <Link to="/" className="hover:text-[#0F172A] transition-colors">
            Home
          </Link>
          <span className="text-[#94A3B8]">&gt;</span>
          <Link to="/challan-payment" className="hover:text-[#0F172A] transition-colors">
            Challan
          </Link>
          <span className="text-[#94A3B8]">&gt;</span>
          <span className="font-semibold text-[#0F172A]">{currentReg}</span>
        </nav>

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
                  TVS Apache RTR 160
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Zap size={14} className="text-[#64748B]" /> Two-wheeler
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Fuel size={14} className="text-[#64748B]" /> Petrol
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#64748B]" /> Registered 2017
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#64748B]" /> AP-16, Andhra Pradesh
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
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
                onClick={() => navigate('/challan-payment')}
                className="inline-flex items-center justify-center rounded-lg border border-[#D5112A] bg-white px-4 py-2 text-xs font-semibold text-[#D5112A] hover:bg-red-50/50 transition cursor-pointer"
              >
                Check another vehicle
              </button>
            </div>
          </div>

          {/* Bottom 4 Metrics Grid inside Top Card */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-[#64748B]">Amount due</p>
              <p className="text-xl sm:text-2xl font-black text-[#D5112A] mt-1">
                {isPaidSuccess ? '₹ 0' : '₹ 1,000'}
              </p>
            </div>

            <div className="sm:border-l sm:border-[#F1F5F9] sm:pl-6">
              <p className="text-xs text-[#64748B]">Payable online</p>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
                {isPaidSuccess ? 0 : 1}
              </p>
            </div>

            <div className="border-l border-[#F1F5F9] pl-4 sm:pl-6">
              <p className="text-xs text-[#64748B]">In court</p>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">2</p>
            </div>

            <div className="border-l border-[#F1F5F9] pl-4 sm:pl-6">
              <p className="text-xs text-[#64748B]">Paid</p>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
                {isPaidSuccess ? 3 : 2}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main 2-Column Content ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Columns: Tabs and Challans List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs Toggle: Pending (3) vs Paid (2) */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#F1F5F9] text-xs font-semibold select-none">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'pending'
                    ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                <span>Pending</span>
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D5112A] px-1 text-[10px] font-bold text-white">
                  {isPaidSuccess ? 2 : 3}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paid')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'paid'
                    ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                <span>Paid</span>
                <span className="text-[#64748B] font-medium">{isPaidSuccess ? 3 : 2}</span>
              </button>
            </div>

            {/* ── TAB 1: PENDING CHALLANS ── */}
            {activeTab === 'pending' ? (
              <div className="space-y-4">
                {/* Select All Payable Bar */}
                {!isPaidSuccess ? (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => setSelectedPayable((v) => !v)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${selectedPayable ? 'bg-[#D5112A] text-white' : 'border border-[#CBD5E1] bg-white'
                          }`}
                      >
                        {selectedPayable && <Check size={14} strokeWidth={3} />}
                      </button>
                      <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                        Select all payable (1)
                      </span>
                    </label>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">₹ 1,000</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#B8EDCB] bg-[#EDFBF2] p-4 flex items-center gap-3 text-xs text-[#16A34A] font-semibold">
                    <CheckCircle2 size={18} />
                    <span>All online payable challans cleared! Receipt generated.</span>
                  </div>
                )}

                {/* 1. Payable Challan Card: Riding without a helmet */}
                {!isPaidSuccess ? (
                  <div
                    className={`rounded-2xl bg-white p-5 transition-all shadow-2xs ${selectedPayable
                        ? 'border-2 border-[#D5112A]'
                        : 'border border-[#E5E7EB]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPayable((v) => !v)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 cursor-pointer ${selectedPayable ? 'bg-[#D5112A] text-white' : 'border border-[#CBD5E1] bg-white'
                            }`}
                        >
                          {selectedPayable && <Check size={14} strokeWidth={3} />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                              Riding without a helmet
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#D97706]">
                              <Clock size={11} strokeWidth={2.5} />
                              <span>Pending</span>
                            </span>
                          </div>

                          <p className="text-xs text-[#64748B] mt-1">
                            Challan no. AP9431419803062 &middot; MV Act Sec 194D
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-[#94A3B8]" /> 31 Aug 2025, 5:16 am
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-[#94A3B8]" /> Bus Stand Circle, Guntur
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Camera size={13} className="text-[#94A3B8]" /> Traffic camera
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Payable online status */}
                      <div className="text-right shrink-0">
                        <p className="text-lg sm:text-xl font-black text-[#0F172A]">₹ 1,000</p>
                        <p className="text-xs text-[#64748B] mt-0.5">Payable online</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* 2. Court Challan Card: No valid PUC certificate */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 flex items-center justify-center text-[#94A3B8] shrink-0">
                        <Lock size={16} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                            No valid PUC certificate
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
                            <Gavel size={11} strokeWidth={2.2} />
                            <span>Court</span>
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1">
                          Challan no. AP7005486895097 &middot; MV Act Sec 190(2)
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#94A3B8]" /> 13 Apr 2026, 10:41 am
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#94A3B8]" /> Flyover Exit, Visakhapatnam
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={13} className="text-[#94A3B8]" /> Traffic officer
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg sm:text-xl font-bold text-[#0F172A]">₹ 10,000</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Not payable online</p>
                    </div>
                  </div>

                  {/* Notice bar inside card */}
                  <div className="mt-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 flex items-start gap-2.5 text-xs text-[#92400E]">
                    <Info size={15} className="shrink-0 text-[#D97706] mt-0.5" />
                    <span>
                      This challan has been sent to a virtual court and has to be settled there.{' '}
                      <button
                        type="button"
                        onClick={() => setShowCourtModal(true)}
                        className="font-bold underline text-[#92400E] hover:text-[#78350F] cursor-pointer"
                      >
                        What to do next
                      </button>
                    </span>
                  </div>
                </div>

                {/* 3. Court Challan Card: Using a mobile phone while driving */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 flex items-center justify-center text-[#94A3B8] shrink-0">
                        <Lock size={16} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                            Using a mobile phone while driving
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
                            <Gavel size={11} strokeWidth={2.2} />
                            <span>Court</span>
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1">
                          Challan no. AP9762449758360 &middot; MV Act Sec 184
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#94A3B8]" /> 19 Mar 2026, 12:31 am
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#94A3B8]" /> Collectorate Junction, Guntur
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={13} className="text-[#94A3B8]" /> Traffic officer
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg sm:text-xl font-bold text-[#0F172A]">₹ 1,500</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Not payable online</p>
                    </div>
                  </div>

                  {/* Notice bar inside card */}
                  <div className="mt-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 flex items-start gap-2.5 text-xs text-[#92400E]">
                    <Info size={15} className="shrink-0 text-[#D97706] mt-0.5" />
                    <span>
                      This challan has been sent to a virtual court and has to be settled there.{' '}
                      <button
                        type="button"
                        onClick={() => setShowCourtModal(true)}
                        className="font-bold underline text-[#92400E] hover:text-[#78350F] cursor-pointer"
                      >
                        What to do next
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── TAB 2: PAID CHALLANS ── */
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                          Overspeeding (Exceeding limit)
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EDFBF2] px-2 py-0.5 text-[11px] font-semibold text-[#16A34A]">
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          <span>Paid</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Challan no. AP845129038411 &middot; Receipt #CHL-2024-8931
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-2">Paid on 12 Jan 2024 via UPI</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0F172A]">₹ 1,000</p>
                      <button
                        type="button"
                        className="mt-1 text-xs font-semibold text-[#D5112A] hover:underline cursor-pointer"
                      >
                        Download receipt
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                          Signal Jumping (Red light violation)
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EDFBF2] px-2 py-0.5 text-[11px] font-semibold text-[#16A34A]">
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          <span>Paid</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Challan no. AP774910283419 &middot; Receipt #CHL-2023-4210
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-2">Paid on 04 Nov 2023 via Net Banking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0F172A]">₹ 1,000</p>
                      <button
                        type="button"
                        className="mt-1 text-xs font-semibold text-[#D5112A] hover:underline cursor-pointer"
                      >
                        Download receipt
                      </button>
                    </div>
                  </div>
                </div>

                {isPaidSuccess && (
                  <div className="rounded-2xl border border-[#B8EDCB] bg-[#EDFBF2] p-5 shadow-2xs">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                            Riding without a helmet
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] text-white px-2 py-0.5 text-[11px] font-semibold">
                            <Check size={11} strokeWidth={2.5} />
                            <span>Paid Just Now</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">
                          Challan no. AP9431419803062 &middot; Receipt #SWP-{Date.now().toString().slice(-6)}
                        </p>
                        <p className="text-xs text-[#16A34A] mt-2 font-medium">Successfully processed online</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#0F172A]">₹ 1,000</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: 3 Sidebar Cards */}
          <div className="flex flex-col gap-5">
            {/* Card 1: Payment summary */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-4">Payment summary</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Challans selected</span>
                  <span className="font-semibold text-[#0F172A]">
                    {!isPaidSuccess && selectedPayable ? '1' : '0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Challan amount</span>
                  <span className="font-semibold text-[#0F172A]">
                    {!isPaidSuccess && selectedPayable ? '₹ 1,000' : '₹ 0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Convenience fee</span>
                  <span className="font-bold text-[#16A34A]">Free</span>
                </div>

                <div className="border-t border-dashed border-[#E2E8F0] pt-3 flex items-center justify-between">
                  <span className="font-extrabold text-[#0F172A] text-sm">Total payable</span>
                  <span className="font-extrabold text-[#0F172A] text-sm sm:text-base">
                    {!isPaidSuccess && selectedPayable ? '₹ 1,000' : '₹ 0'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={isPaidSuccess || !selectedPayable || isPaying}
                className={`mt-5 w-full rounded-xl py-3 px-4 font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${isPaidSuccess
                    ? 'bg-[#EDFBF2] text-[#16A34A] border border-[#B8EDCB] cursor-default'
                    : !selectedPayable
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#D5112A] hover:bg-[#B3081A] text-white cursor-pointer active:scale-[0.99]'
                  }`}
              >
                {isPaying ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : isPaidSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> Paid Successfully
                  </>
                ) : (
                  'Pay ₹ 1,000'
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
                <Shield size={13} className="text-[#16A34A]" />
                <span>UPI, cards and net banking accepted</span>
              </div>
            </div>

            {/* Card 2: 2 challans are in court */}
            <div className="rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#0F172A] mb-2">
                <Gavel size={18} />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">2 challans are in court</h3>
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                Court challans can&apos;t be paid online here. Settle them through the virtual court to avoid
                further action.
              </p>

              <button
                type="button"
                onClick={() => setShowCourtModal(true)}
                className="mt-3 text-xs font-bold text-[#6D28D9] hover:underline cursor-pointer block"
              >
                What to do next
              </button>
            </div>

            {/* Card 3: Selling this bike? */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={17} className="text-[#0F172A]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Selling this bike?</h3>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                Listings with no pending challans sell faster. Post yours for free.
              </p>

              <Link
                to="/sell"
                className="text-xs font-bold text-[#D5112A] hover:underline inline-block"
              >
                Sell on SwipeDeals
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Disclaimer ── */}
        <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 text-xs text-[#64748B]">
          <Info size={15} className="shrink-0 text-[#858D9D]" />
          <span>Preview: challans are sample data generated from the vehicle number, and payments are simulated.</span>
        </div>
      </div>

      {/* ── Virtual Court Guidance Modal ── */}
      {showCourtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-2.5 text-[#7C3AED] mb-3">
              <Gavel size={22} />
              <h3 className="text-lg font-bold text-[#0F172A]">Virtual Court Challan Settlement</h3>
            </div>

            <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
              Certain traffic violations (like missing PUC or driving while using phone) are transferred directly to
              the Judicial Virtual Court system (vcourts.gov.in) under the Motor Vehicles Act.
            </p>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-xs space-y-2.5 mb-5">
              <p className="font-bold text-[#0F172A]">How to settle in 3 simple steps:</p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[#334151]">
                <li>Visit the official e-Courts portal at <strong>vcourts.gov.in</strong>.</li>
                <li>Search by your vehicle number <strong>({currentReg})</strong> or challan number.</li>
                <li>Review the judicial fine amount, propose a plea, and settle via net banking / UPI.</li>
              </ol>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCourtModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <a
                href="https://vcourts.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white transition shadow-sm"
              >
                <span>Visit vcourts.gov.in</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
