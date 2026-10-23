import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  Headphones,
  Info,
  Lock,
  Mail,
  Phone,
  RotateCw,
  ShieldCheck,
  User,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import OtpInput from '../components/forms/OtpInput'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { authService } from '../services/authService'
import AuthLayout from '../components/layout/AuthLayout'
import createAccountHeroImg from '../assets/login.png'

const RESEND_SECONDS = 30

function extractErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback
}

export default function Login() {
  const [tab, setTab] = useState('mobile') // 'mobile' | 'email'
  const [step, setStep] = useState('input') // 'input' | 'name' | 'otp'
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const [knownUsers, setKnownUsers] = useLocalStorage('swipedeals_known_users', {})
  const otpStartedRef = useRef(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  useEffect(() => {
    if (step !== 'otp' || resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [step, resendIn])

  // Handle Continue from Mobile / Email
  const handleContinue = async (e) => {
    e.preventDefault()

    if (tab === 'email') {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Please enter a valid email address.')
        return
      }
      setError('Email magic-link / password sign-in is coming soon. Please use Mobile number.')
      return
    }

    const cleanedPhone = phone.replace(/\D/g, '')
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    setError('')
    setLoading(true)
    try {
      await authService.requestLoginOtp(cleanedPhone)
      setMode('login')
      setOtp('')
      setResendIn(RESEND_SECONDS)
      setStep('otp')
    } catch (err) {
      if (err.response?.status === 404) {
        // No account for this number yet — collect a name, then register
        setStep('name')
      } else {
        setError(extractErrorMessage(err, 'Could not send OTP. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  // If number not registered yet, get full name and start registration OTP
  const handleStartRegistration = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const cleanedPhone = phone.replace(/\D/g, '')
      await authService.requestRegistrationOtp(name.trim(), cleanedPhone)
      setMode('register')
      setOtp('')
      setResendIn(RESEND_SECONDS)
      setStep('otp')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendIn > 0) return
    setError('')
    try {
      const cleanedPhone = phone.replace(/\D/g, '')
      if (mode === 'register') {
        await authService.resendRegistrationOtp(cleanedPhone)
      } else {
        await authService.resendLoginOtp(cleanedPhone)
      }
      setOtp('')
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not resend OTP. Please try again.'))
    }
  }

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const cleanedPhone = phone.replace(/\D/g, '')
      const response =
        mode === 'register'
          ? await authService.verifyRegistrationOtp(cleanedPhone, otp)
          : await authService.verifyLoginOtp(cleanedPhone, otp)

      const tokens = response?.data
      if (!tokens?.accessToken) {
        throw new Error('Sign-in did not return an access token.')
      }
      authService.setTokens(tokens)

      const displayName = mode === 'register' ? name.trim() : knownUsers[cleanedPhone]?.name
      setKnownUsers((prev) => ({
        ...prev,
        [cleanedPhone]: { name: displayName || prev[cleanedPhone]?.name || null },
      }))
      login({ name: displayName || `+91 ${cleanedPhone}`, phone: cleanedPhone, email: null })

      navigate(redirectTo)
    } catch (err) {
      setError(extractErrorMessage(err, 'Incorrect or expired OTP. Please try again.'))
    } finally {
      setLoading(false)
      otpStartedRef.current = false
    }
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
    >
      <div className="max-w-full w-full mx-auto">
        <h2 className="text-2xl sm:text-[30px]" style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E' }}>
          Welcome back
        </h2>
        <p className="text-[15px] mt-1 mb-4" style={{ fontFamily: 'Inter', fontWeight: 400, color: '#5B6474' }}>
          Log in to continue to SwipeDeals.
        </p>

              {/* Mobile / Email Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200/60 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setTab('mobile')
                    setError('')
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'mobile'
                    ? 'bg-[#FEEDEE] text-[#C8102E] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Phone size={14} className={tab === 'mobile' ? 'text-[#c0001f]' : 'text-gray-500'} />
                  <span>Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTab('email')
                    setError('')
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'email'
                    ? 'bg-[#FEEDEE] text-[#C8102E] border border-[#FEEDEE] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Mail size={14} className={tab === 'email' ? 'text-[#c0001f]' : 'text-gray-500'} />
                  <span>Email</span>
                </button>
              </div>

              {step === 'input' && (
                <form onSubmit={handleContinue} className="space-y-3">
                  {tab === 'mobile' ? (
                    <div>
                      <label className="mb-1" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#0B1B2E', fontSize: '14px' }}>
                        Mobile number
                      </label>
                      <div className="flex rounded-xl border border-gray-200 bg-white focus-within:border-[#c0001f] focus-within:ring-2 focus-within:ring-[#c0001f]/10 transition overflow-hidden mt-2">
                        {/* Indian Flag +91 */}
                        <div className="flex items-center gap-1.5 px-3 bg-gray-50/70 border-r border-[#E4E7EC] text-xs font-bold text-gray-700 select-none">
                          <svg className="w-5 h-3.5 rounded-[2px] shadow-2xs shrink-0" viewBox="0 0 640 480">
                            <path fill="#f93" d="M0 0h640v160H0z" />
                            <path fill="#fff" d="M0 160h640v160H0z" />
                            <path fill="#128807" d="M0 320h640v160H0z" />
                            <g transform="matrix(3.2 0 0 3.2 320 240)">
                              <circle r="20" fill="none" stroke="#008" strokeWidth="2" />
                              <circle r="3" fill="#008" />
                              <path d="M0-20V20M-20 0H20M-14.1-14.1L14.1 14.1M-14.1 14.1L14.1-14.1" stroke="#008" strokeWidth="0.8" />
                            </g>
                          </svg>
                          <span>+91</span>
                          <span className="text-[10px] text-gray-400">▼</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="Enter mobile number"
                          className="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#0B1B2E', fontSize: '14px' }}>
                        Email address
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#c0001f] focus:outline-none focus:ring-2 focus:ring-[#c0001f]/10 transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Notification */}
                  {error && (
                    <div className="p-2 rounded-xl bg-[#FEEDEE] border border-[#FEEDEE] text-xs font-semibold text-[#C8102E]">
                      {error}
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#BD0F27] hover:bg-[#a5001a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-70 cursor-pointer"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Continue'}</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>

                  {/* OR Divider */}
                  <div className="relative flex items-center justify-center my-5">
                    <div className="border-t border-[#E4E7EC] w-full" />
                    <span className="bg-white px-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest absolute">
                      OR
                    </span>
                  </div>

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={() => setError('Google sign-in will be enabled soon. Please log in with mobile OTP.')}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E4E7EC] bg-white hover:bg-gray-50 flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#0B1B2E', fontSize: '14px' }}
                  >
                    <FcGoogle size={17} />
                    <span>Continue with Google</span>
                  </button>

                  {/* Keep me signed in checkbox with info tooltip */}
                  <div className="flex items-center gap-1.5 pt-0.5 select-none">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-[#E4E7EC] text-[#BD0F27] focus:ring-[#BD0F27] accent-[#BD0F27]"
                      />
                      <span className="text-[11px] sm:text-xs" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#2B3443', fontSize: '12px' }}>
                        Keep me signed in
                      </span>
                    </label>
                    <Info size={13} className="text-[#8A92A0] cursor-pointer" title="Saves your session on this device securely" />
                  </div>

                  {/* New to SwipeDeals Card */}
                  <div className="p-2 sm:p-2.5 bg-[#F6F7F9] rounded-xl text-center" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#2B3443', fontSize: '12px' }}>
                    New to SwipeDeals?{' '}
                    <Link to="/register" className="font-bold text-[#BD0F27] hover:underline">
                      Create an account
                    </Link>
                  </div>

                  {/* Footer Links: Forgot password / Privacy / Terms */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <Link to="/forgot-password" className="hover:underline" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#1D63D8', fontSize: '12px' }}>
                      Forgot password?
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <Link to="/privacy" className="hover:underline" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#5B6474', fontSize: '12px' }}>
                        Privacy Policy
                      </Link>
                      <span>•</span>
                      <Link to="/terms" className="hover:underline" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#5B6474', fontSize: '12px' }}>
                        Terms
                      </Link>
                    </div>
                  </div>
                </form>
              )}

              {/* Name collection when phone number doesn't have an account */}
              {step === 'name' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input')
                      setError('')
                    }}
                    className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#c0001f]"
                  >
                    <ArrowLeft size={14} />
                    Change number
                  </button>

                  <h3 className="text-xl font-bold text-gray-900">What should we call you?</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    We couldn't find an account for <span className="font-bold text-gray-800">+91 {phone}</span> — let's set up your profile.
                  </p>

                  <form className="mt-5 space-y-4" onSubmit={handleStartRegistration}>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aditya Kapoor"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#c0001f] focus:outline-none focus:ring-2 focus:ring-[#c0001f]/10"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#c0001f]">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-[#c0001f] hover:bg-[#a5001a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-70 cursor-pointer"
                    >
                      <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* OTP Verification Screen */}
              {step === 'otp' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(mode === 'register' ? 'name' : 'input')
                      setError('')
                    }}
                    className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#c0001f]"
                  >
                    <ArrowLeft size={14} />
                    {mode === 'register' ? 'Back' : 'Change number'}
                  </button>

                  <h3 className="text-xl font-bold text-gray-900">Verify your mobile number</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 6-digit OTP sent to <span className="font-bold text-gray-800">+91 {phone}</span>
                  </p>

                  <form className="mt-5 space-y-4" onSubmit={handleVerifyOtp}>
                    <OtpInput value={otp} onChange={setOtp} error={error} />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-[#c0001f] hover:bg-[#a5001a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-70 cursor-pointer"
                    >
                      <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                      {!loading && <Check size={18} />}
                    </button>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck size={14} />
                        Confidential OTP
                      </span>

                      {resendIn > 0 ? (
                        <span className="text-gray-400">Resend in 0:{resendIn.toString().padStart(2, '0')}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          className="flex items-center gap-1 font-bold text-[#c0001f] hover:underline cursor-pointer"
                        >
                          <RotateCw size={12} />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
      </div>
    </AuthLayout>
  )
}
