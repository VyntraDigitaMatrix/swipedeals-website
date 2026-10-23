import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RotateCw,
  ShieldCheck,
  Tag,
  User,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import OtpInput from '../components/forms/OtpInput'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { authService } from '../services/authService'
import AuthLayout from '../components/layout/AuthLayout'
import createAccountHeroImg from '../assets/CreateAccount.png'

const RESEND_SECONDS = 30
const FONT = { fontFamily: 'Inter, sans-serif' }

function extractErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback
}

/* ---------- Static content ---------- */
const FEATURES = [
  { Icon: ShieldCheck, lines: ['Verified', 'Dealers Only'] },
  { Icon: Lock, lines: ['Safe & Secure', 'Transactions'] },
  { Icon: CarFront, lines: ['200-Point', 'Inspection'], note: '(For Cars)' },
  { Icon: Tag, lines: ['Best Deals', 'Across', 'Categories'] },
]

const STATS = [
  { v: '10L+', l: 'Happy Customers' },
  { v: '50K+', l: 'Verified Dealers' },
  { v: '25+', l: 'Categories' },
  { v: '4.8★', l: 'Average Rating' },
]

/* ---------- Shared responsive class strings (scale with screen height on lg+) ---------- */
const labelCls =
  'block text-xs lg:text-[length:clamp(11px,1.6vh,14px)] font-bold text-[#181C29] mb-2'

const inputCls =
  'w-full pl-9 pr-3 py-2.5 lg:py-[clamp(7px,1.3vh,14px)] rounded-xl border border-[#E2E5EB] bg-white text-xs sm:text-[13px] lg:text-[length:clamp(12px,1.7vh,15px)] text-[#0B1B2E] placeholder:text-gray-400 focus:border-[#BD0F27] focus:outline-none focus:ring-1 focus:ring-[#BD0F27] transition'

const iconCls =
  'absolute left-3 top-1/2 -translate-y-1/2 text-[#3E4654] w-4 h-4 2xl:w-[18px] 2xl:h-[18px]'

const socialBtnCls =
  'flex items-center justify-center gap-2 py-2.5 lg:py-[clamp(7px,1.3vh,14px)] px-3 rounded-xl border border-[#E2E5Eb] bg-white hover:bg-gray-50 text-xs sm:text-[13px] lg:text-[length:clamp(12px,1.7vh,15px)] font-semibold text-[#0B1B2E] transition shadow-2xs cursor-pointer'

function Criterion({ met, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        met ? 'text-[#1E8E3E] font-medium' : 'text-gray-500'
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 2xl:h-4 2xl:w-4 items-center justify-center rounded-full text-white text-[9px] ${
          met ? 'bg-[#1E8E3E]' : 'bg-gray-300'
        }`}
      >
        ✓
      </span>
      {children}
    </span>
  )
}

export default function Register() {
  const [step, setStep] = useState('details') // 'details' | 'otp'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const [, setKnownUsers] = useLocalStorage('swipedeals_known_users', {})

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

  // Password validation rules matching UI indicators
  const hasMinLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)

  // Step 1: Submit Details -> Request OTP
  const handleRegisterOtp = async (e) => {
    e.preventDefault()

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    const cleanedPhone = mobileNumber.replace(/\D/g, '')
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy.')
      return
    }

    setError('')
    setLoading(true)
    try {
      await authService.requestRegistrationOtp(fullName.trim(), cleanedPhone)
      setOtp('')
      setResendIn(RESEND_SECONDS)
      setStep('otp')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send registration OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendIn > 0) return
    setError('')
    try {
      const cleanedPhone = mobileNumber.replace(/\D/g, '')
      await authService.resendRegistrationOtp(cleanedPhone)
      setOtp('')
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not resend OTP. Please try again.'))
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const cleanedPhone = mobileNumber.replace(/\D/g, '')
      const response = await authService.verifyRegistrationOtp(cleanedPhone, otp)
      const tokens = response?.data
      if (!tokens?.accessToken) {
        throw new Error('Registration did not return an access token.')
      }
      authService.setTokens(tokens)

      const name = fullName.trim()
      setKnownUsers((prev) => ({
        ...prev,
        [cleanedPhone]: { name, email: email.trim() || null },
      }))
      login({ name, phone: cleanedPhone, email: email.trim() || null })

      navigate(redirectTo)
    } catch (err) {
      setError(extractErrorMessage(err, 'Incorrect or expired OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      rightWidthClass="w-full lg:w-[45%]"
      heroCustom={
        <div
          style={FONT}
          className="w-full lg:w-[55%] relative flex flex-col justify-between overflow-hidden bg-[#FDECEE] border-b lg:border-b-0 lg:border-r border-[#ECEEF2]
                     min-h-[540px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[580px]"
        >
          {/* Full-bleed background illustration */}
          <img
            src={createAccountHeroImg}
            alt="SwipeDeals marketplace - Cars, bikes, laptops, electronics and properties"
            className="absolute inset-0 w-full h-full object-cover object-[65%_bottom] pointer-events-none select-none"
            loading="eager"
          />

          {/* Text + feature icons */}
          <div className="relative z-10 px-5 sm:px-8 xl:px-10 2xl:px-14 pt-6 sm:pt-8 lg:pt-[3.5vh]">
            {/* Badge line */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4 2xl:mb-5">
              <span className="w-5 2xl:w-7 h-[2px] bg-[#D4111F] rounded-full inline-block" />
              <span className="text-[9px] sm:text-[10px] xl:text-[11px] 2xl:text-xs uppercase" style={{ fontFamily: 'Inter', fontWeight: 700, color: '#3E4654', fontStyle: 'Bold' }}>
                Join India&apos;s Trusted Marketplace
              </span>
            </div>

            {/* Headline (scales with the smaller of screen height / width on lg+) */}
            <h1 className="text-[25px] sm:text-[32px] md:text-[36px] lg:text-[35px] leading-[1.2]">
              <span className="block max-w-[400px] sm:max-w-[480px] lg:max-w-[400px] xl:max-w-[420px] 2xl:max-w-[600px]" style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E', fontStyle: 'Bold'}}>
                Create your account and unlock a bigger <span className="text-[#C8102E]">world of opportunities.</span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-2 lg:mt-[1.2vh] text-xs sm:text-[13px] lg:text-[13px] leading-snug max-w-[300px] sm:max-w-[380px] xl:max-w-[380px] 2xl:max-w-[520px]" style={{ fontFamily: 'Inter', fontWeight: 400, color: '#3A4352', fontStyle: 'Regular'}}>
              Buy, sell and upgrade across cars, properties, electronics, furniture, jobs and more —
              all in one place.
            </p>

            {/* 4 feature items */}
            <div className="mt-4 sm:mt-5 lg:mt-[1.5vh] grid grid-cols-4 max-w-[340px] sm:max-w-[420px] xl:max-w-[380px] 2xl:max-w-[560px]">
              {FEATURES.map(({ Icon, lines, note }, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center px-1 sm:px-1.5 ${
                    i > 0 ? 'border-l border-[#E6C4CA]/70' : ''
                  }`}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-12 2xl:h-12 rounded-xl bg-[#FDE5E9] flex items-center justify-center text-[#CF1430] mb-1.5">
                    <Icon className="w-4 h-4 2xl:w-5 2xl:h-5" />
                  </div>
                  <span className="text-[9.5px] sm:text-[10.5px] xl:text-[11px] 2xl:text-[13px] leading-tight" style={{ fontFamily: 'Inter', fontWeight: 400, color: '#1F2633', fontStyle: 'Regular'}}>
                    {lines.map((l, j) => (
                      <span key={j} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                  {note && (
                    <span className="text-[8px] sm:text-[8.5px] 2xl:text-[10px] text-[#5B6474]">
                      {note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 mx-5 sm:mx-8 xl:mx-10 2xl:mx-14 mb-3 lg:mb-[2vh] pt-3 grid grid-cols-2 sm:grid-cols-4 gap-y-3 text-left">
            {STATS.map((s, i) => (
              <div
                key={s.l}
                className={`${i % 2 === 1 ? 'border-l border-[#E1D3D6] pl-3' : ''} ${
                  i > 0 ? 'sm:border-l sm:border-[#E1D3D6] sm:pl-3' : ''
                }`}
              >
                <p className="text-base sm:text-[17px] 2xl:text-2xl font-bold text-[#0B1B2E] leading-none">
                  {s.v}
                </p>
                <p className="text-[10px] 2xl:text-xs text-[#5B6474] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div
        style={FONT}
        className="w-full max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto"
      >
        <h2 className="text-[22px] sm:text-2xl lg:text-[length:clamp(20px,3.8vh,34px)]" style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E', fontStyle: 'Bold'}}>
          Create your SwipeDeals account
        </h2>
        <p className="text-xs sm:text-[13px] lg:text-[length:clamp(12px,1.7vh,16px)] mt-1 mb-4 lg:mb-[1.8vh]" style={{ fontFamily: 'Inter', fontWeight: 400, color: '#4B5563', fontStyle: 'Regular'}}>
          It&apos;s quick, easy and free.
        </p>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 lg:mb-[1.6vh]">
          <button
            type="button"
            className={socialBtnCls}
            onClick={() =>
              setError('Google sign-in will be enabled soon. Please register with mobile OTP.')
            }
          >
            <FcGoogle className="w-[17px] h-[17px] 2xl:w-5 2xl:h-5" />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className={socialBtnCls}
            onClick={() =>
              setError('Apple sign-in will be enabled soon. Please register with mobile OTP.')
            }
          >
            <FaApple className="w-[17px] h-[17px] 2xl:w-5 2xl:h-5 text-black" />
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-3.5 lg:my-[1.6vh] mt-4 lg:mt-6 mb-10 lg:mb-6">
          <div className="border-t border-[#E6E8EC] w-full" />
          <span className="bg-white px-2.5 text-[10px] 2xl:text-xs font-bold text-[#5B6474] uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleRegisterOtp} className="space-y-3 lg:space-y-[1.4vh]">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Full name</label>
                <div className="relative">
                  <User className={iconCls} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email address</label>
                <div className="relative">
                  <Mail className={iconCls} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Mobile number */}
            <div>
              <label className={labelCls}>Mobile number</label>
              <div className="flex rounded-xl border border-[#E4E7EC] bg-white focus-within:border-[#BD0F27] focus-within:ring-1 focus-within:ring-[#BD0F27] transition overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 bg-gray-50/70 border-r border-[#E4E7EC] text-xs lg:text-[length:clamp(12px,1.7vh,15px)] font-bold text-gray-700 select-none">
                  <svg
                    className="w-5 h-3.5 2xl:w-6 2xl:h-4 rounded-[2px] shadow-2xs shrink-0"
                    viewBox="0 0 640 480"
                  >
                    <path fill="#f93" d="M0 0h640v160H0z" />
                    <path fill="#fff" d="M0 160h640v160H0z" />
                    <path fill="#090" d="M0 320h640v160H0z" />
                    <circle cx="320" cy="240" r="45" fill="#008" />
                    <circle cx="320" cy="240" r="35" fill="#fff" />
                    <circle cx="320" cy="240" r="8" fill="#008" />
                  </svg>
                  <span>+91</span>
                  <span className="text-[10px] text-gray-400">▼</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="Enter mobile number"
                  className="w-full min-w-0 px-3 py-2.5 lg:py-[clamp(7px,1.3vh,14px)] text-xs sm:text-[13px] lg:text-[length:clamp(12px,1.7vh,15px)] text-[#0B1B2E] placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <Lock className={iconCls} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 2xl:w-[18px] 2xl:h-[18px]" />
                  ) : (
                    <Eye className="w-4 h-4 2xl:w-[18px] 2xl:h-[18px]" />
                  )}
                </button>
              </div>

              {/* Password criteria */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[10.5px] sm:text-[11px] lg:text-[length:clamp(10px,1.4vh,12px)]">
                <Criterion met={hasMinLength}>At least 8 characters</Criterion>
                <Criterion met={hasLetter}>One letter</Criterion>
                <Criterion met={hasNumber}>One number</Criterion>
                <Criterion met={hasSpecial}>One special character</Criterion>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer pt-3 select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 2xl:h-4 2xl:w-4 shrink-0 rounded border-[#E4E7EC] accent-[#C40923]"
              />
              <span className="text-xs lg:text-[length:clamp(12px,1.6vh,14px)] text-[#2B3443] leading-snug">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-[#1446D9] hover:underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-[#1446D9] hover:underline">
                  Privacy Policy
                </Link>{' '}
                of SwipeDeals.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="p-2.5 rounded-xl bg-[#FEEDEE] border border-[#F9CDD2] text-xs 2xl:text-sm font-semibold text-[#C8102E]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B80720] mt-6 py-3 lg:py-[clamp(8px,1.5vh,16px)] px-4 rounded-xl text-white font-bold text-sm lg:text-[length:clamp(13px,1.8vh,16px)] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-70 cursor-pointer"
            >
              <span>{loading ? 'Sending OTP...' : 'Create account'}</span>
              {!loading && <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />}
            </button>

            <div className="border-t border-[#E6E8EC] w-full mt-4" />

            <p className="text-center text-xs lg:text-[length:clamp(11px,1.6vh,14px)] text-[#2B3443] pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#1446D9] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              type="button"
              onClick={() => {
                setStep('details')
                setError('')
              }}
              className="mb-4 flex items-center gap-1.5 text-xs 2xl:text-sm font-bold text-gray-500 hover:text-[#c0001f] cursor-pointer"
            >
              <ArrowLeft size={14} />
              Change details
            </button>

            <h3 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-gray-900">
              Verify your mobile number
            </h3>
            <p className="mt-1 text-xs 2xl:text-sm text-gray-500">
              Enter the 6-digit OTP sent to{' '}
              <span className="font-bold text-gray-800">+91 {mobileNumber}</span>
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleVerifyOtp}>
              <OtpInput value={otp} onChange={setOtp} error={error} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 2xl:py-3.5 px-4 rounded-xl bg-[#c0001f] hover:bg-[#a5001a] text-white font-bold text-sm 2xl:text-base flex items-center justify-center gap-2 shadow-md transition disabled:opacity-70 cursor-pointer"
              >
                <span>{loading ? 'Verifying...' : 'Complete Registration'}</span>
                {!loading && <Check size={18} />}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs 2xl:text-sm text-gray-500 pt-1">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck size={14} />
                  Confidential OTP
                </span>

                {resendIn > 0 ? (
                  <span className="text-gray-400">
                    Resend in 0:{resendIn.toString().padStart(2, '0')}
                  </span>
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