import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  RotateCw,
} from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import createAccountHeroImg from '../assets/login.png'

export default function ForgotPassword() {
  const [tab, setTab] = useState('mobile') // 'mobile' | 'email'
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (tab === 'mobile') {
      const cleaned = phone.replace(/\D/g, '')
      if (!/^[6-9]\d{9}$/.test(cleaned)) {
        setError('Please enter a valid 10-digit mobile number.')
        return
      }
    } else {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Please enter a valid email address.')
        return
      }
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <AuthLayout
      badgeText="India's Trusted Marketplace"
      headline={
        <>
          Buy smarter.
          <br />
          <span className="text-[#C8102E]">Sell faster.</span>
        </>
      }
      subheading="From cars and bikes to properties, electronics, furniture, jobs and more — everything you need, all in one place."
      heroImage={createAccountHeroImg}
      heroImageAlt="SwipeDeals marketplace - Cars, bikes, laptops, electronics and properties"
      rightWidthClass="w-full lg:w-[45%]"
    >

      <div className="flex flex-col justify-between h-full">
        {/* Back to login top link */}
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] transition-colors"
            style={{ fontFamily: 'Inter' }}
          >
            <ArrowLeft size={15} />
            <span>Back to login</span>
              </Link>
            </div>

            {/* Center block */}
            <div className="w-full max-w-[420px] mx-auto py-1">
              {/* Pink circular icon with Lock & Reload badge */}
              <div className="flex justify-center mb-2.5">
                <div className="relative w-14 h-14 sm:w-17 sm:h-17 rounded-full bg-[#FDE6E8] flex items-center justify-center">
                  <Lock size={30} className="text-[#CF0F28]" strokeWidth={2.4} />
                  <div className="absolute bottom-2.5 right-2.5 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center">
                    <RotateCw size={10} className="text-[#0B1B2E]" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Heading & Subheading */}
              <div className="text-center mb-3">
                <h2
                  className="text-xl sm:text-[24px] tracking-tight"
                  style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E', fontStyle: 'Bold' }}
                >
                  Forgot your password?
                </h2>
                <p
                  className="text-xs sm:text-[13px] mt-1 max-w-[320px] mx-auto"
                  style={{ fontFamily: 'Inter', fontWeight: 400, color: '#4B5563' }}
                >
                  No worries. Enter your registered mobile number or email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Mobile / Email Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200/60 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setTab('mobile')
                    setError('')
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tab === 'mobile'
                    ? 'bg-[#FDE9EA] text-[#C8102E] shadow-xs'
                    : 'text-[#2B3443] hover:text-gray-900'
                    }`}
                  style={{ fontFamily: 'Inter' }}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${tab === 'mobile' ? 'text-[#C8102E]' : 'text-[#2B3443]'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <rect x="5" y="2" width="14" height="20" rx="3" />
                    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth={3} strokeLinecap="round" />
                  </svg>
                  <span>Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTab('email')
                    setError('')
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tab === 'email'
                    ? 'bg-[#FDE9EA] text-[#C8102E] shadow-xs'
                    : 'text-[#2B3443] hover:text-gray-900'
                    }`}
                  style={{ fontFamily: 'Inter' }}
                >
                  <Mail size={14} className={tab === 'email' ? 'text-[#C8102E]' : 'text-[#2B3443]'} />
                  <span>Email</span>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {tab === 'mobile' ? (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        color: '#0B1B2E',
                        fontSize: '12px',
                      }}
                    >
                      Mobile number
                    </label>
                    <div className="flex rounded-xl border border-[#E2E5EB] bg-white focus-within:border-[#BD0F27] focus-within:ring-2 focus-within:ring-[#BD0F27]/10 transition overflow-hidden">
                      {/* Indian Flag +91 */}
                      <div className="flex items-center gap-1.5 px-3 bg-gray-50/70 border-r border-[#E4E7EC] text-xs font-bold text-gray-700 select-none">
                        <svg className="w-5 h-3.5 rounded-[2px] shadow-2xs shrink-0" viewBox="0 0 640 480">
                          <path fill="#f93" d="M0 0h640v160H0z" />
                          <path fill="#fff" d="M0 160h640v160H0z" />
                          <path fill="#090" d="M0 320h640v160H0z" />
                          <circle cx="320" cy="240" r="45" fill="#008" />
                          <circle cx="320" cy="240" r="35" fill="#fff" />
                          <circle cx="320" cy="240" r="8" fill="#008" />
                        </svg>
                        <span>+91</span>
                        <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter your mobile number"
                        className="flex-1 px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        color: '#0B1B2E',
                        fontSize: '12px',
                      }}
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#BD0F27] focus:outline-none focus:ring-2 focus:ring-[#BD0F27]/10"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-2 rounded-xl bg-[#FEEDEE] border border-[#FEEDEE] text-xs font-semibold text-[#C8102E]">
                    {error}
                  </div>
                )}

                {submitted && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                    Reset link has been sent successfully! Check your {tab}.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-70 cursor-pointer"
                  style={{
                    fontFamily: 'Inter',
                    background: 'linear-gradient(90deg, #C50E26 0%, #B80A21 100%)',
                  }}
                >
                  <span>{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
                  {!loading && <ArrowRight size={15} />}
                </button>
              </form>
            </div>

            {/* Stepper Footer: 1 Enter Details -> 2 Verify Identity -> 3 Reset Password */}
            <div className="pt-2 pb-1 w-full max-w-[390px] mx-auto">
              <div className="relative flex items-center justify-between">
                {/* Connecting Horizontal Line */}
                <div className="absolute left-6 right-6 top-3 h-[1.5px] bg-[#E1E3EA] -z-0" />

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#E8414F] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <span
                    className="mt-1 text-[10.5px] font-semibold text-[#0B1B2E]"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#3E4654' }}
                  >
                    Enter Details
                  </span>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D0D5DD] text-gray-600 text-[11px] font-bold flex items-center justify-center">
                    2
                  </div>
                  <span
                    className="mt-1 text-[10.5px] font-medium text-gray-500"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#3E4654' }}
                  >
                    Verify Identity
                  </span>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D0D5DD] text-gray-600 text-[11px] font-bold flex items-center justify-center">
                    3
                  </div>
                  <span
                    className="mt-1 text-[10.5px] font-medium text-gray-500"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#3E4654' }}
                  >
                    Reset Password
                  </span>
                </div>
              </div>
            </div>
          </div>
    </AuthLayout>
  )
}
