import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, RotateCw, ShieldCheck, User } from 'lucide-react'
import Input from '../components/forms/Input'
import OtpInput from '../components/forms/OtpInput'
import Button from '../components/buttons/Button'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { authService } from '../services/authService'

const RESEND_SECONDS = 30

function extractErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback
}

export default function Register() {
  const [step, setStep] = useState('details') // 'details' | 'otp'
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
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

  // Step 1: POST /api/user/auth/register -> { fullName, mobileNumber }
  const handleRegisterOtp = async (e) => {
    e.preventDefault()
    if (fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.requestRegistrationOtp(fullName.trim(), mobileNumber)
      setOtp('')
      setResendIn(RESEND_SECONDS)
      setStep('otp')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send registration OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP: POST /api/user/auth/register/resend-otp -> { mobileNumber }
  const handleResend = async () => {
    if (resendIn > 0) return
    setError('')
    try {
      await authService.resendRegistrationOtp(mobileNumber)
      setOtp('')
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not resend OTP. Please try again.'))
    }
  }

  // Step 2: POST /api/user/auth/register/verify-otp -> { mobileNumber, otp }
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await authService.verifyRegistrationOtp(mobileNumber, otp)
      const tokens = response?.data
      if (!tokens?.accessToken) {
        throw new Error('Registration did not return an access token.')
      }
      authService.setTokens(tokens)

      const name = fullName.trim()
      setKnownUsers((prev) => ({ ...prev, [mobileNumber]: { name } }))
      login({ name, phone: mobileNumber, email: null })

      navigate(redirectTo)
    } catch (err) {
      setError(extractErrorMessage(err, 'Incorrect or expired OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:flex lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md px-10 text-center text-white"
        >
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black backdrop-blur-sm">
            S
          </span>
          <h2 className="text-2xl font-extrabold">Create your SwipeDeals Account</h2>
          <p className="mt-3 text-sm text-white/75">
            Join thousands of buyers and verified sellers. Discover great deals across vehicles, property, and electronics.
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-base font-black text-white">S</span>
            <span className="text-base font-extrabold text-text">SwipeDeals</span>
          </Link>

          {step === 'details' && (
            <>
              <h1 className="text-2xl font-extrabold text-text">Create an account</h1>
              <p className="mt-2 text-sm text-text-secondary">Enter your name and mobile number to get started.</p>

              <form className="mt-5 space-y-4" onSubmit={handleRegisterOtp}>
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="e.g. Rohan Mehta"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  icon={Phone}
                  placeholder="98765 43210"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={error}
                  required
                />
                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Send Verification OTP
                </Button>

                <p className="mt-4 text-center text-xs text-text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('details')
                  setError('')
                }}
                className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Change details
              </button>

              <h1 className="text-2xl font-extrabold text-text">Verify your number</h1>
              <p className="mt-2 text-sm text-text-secondary">
                Enter the 6-digit OTP sent to <span className="font-semibold text-text">+91 {mobileNumber}</span>
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleVerifyOtp}>
                <OtpInput value={otp} onChange={setOtp} error={error} />

                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Complete Registration
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <ShieldCheck size={13} className="text-success" aria-hidden="true" />
                    Your OTP is confidential — never share it.
                  </span>
                  {resendIn > 0 ? (
                    <span className="text-text-light">Resend in 0:{resendIn.toString().padStart(2, '0')}</span>
                  ) : (
                    <button type="button" onClick={handleResend} className="flex items-center gap-1 font-semibold text-primary hover:underline">
                      <RotateCw size={12} aria-hidden="true" />
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
