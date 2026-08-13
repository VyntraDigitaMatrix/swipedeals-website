import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Info, Phone, RotateCw, ShieldCheck, User } from 'lucide-react'
import Input from '../components/forms/Input'
import OtpInput from '../components/forms/OtpInput'
import Button from '../components/buttons/Button'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEMO_PHONE, DEMO_OTP, DEMO_PROFILE } from '../utils/demoAuth'

const RESEND_SECONDS = 30

export default function Login() {
  const [step, setStep] = useState('phone') // 'phone' | 'otp' | 'name'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const [knownUsers, setKnownUsers] = useLocalStorage('swipedeals_known_users', {})
  const seeded = useRef(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  // Seed the demo account once so it's ready to sign in with no extra steps.
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    if (!knownUsers[DEMO_PHONE]) {
      setKnownUsers((prev) => ({ ...prev, [DEMO_PHONE]: { name: DEMO_PROFILE.name, email: DEMO_PROFILE.email } }))
    }
  }, [knownUsers, setKnownUsers])

  useEffect(() => {
    if (step !== 'otp' || resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [step, resendIn])

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOtp('')
      setResendIn(RESEND_SECONDS)
      setStep('otp')
    }, 600)
  }

  const handleResend = () => {
    if (resendIn > 0) return
    setOtp('')
    setResendIn(RESEND_SECONDS)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    if (otp !== DEMO_OTP) {
      setError(`Incorrect OTP. Use ${DEMO_OTP} for this demo.`)
      return
    }
    setError('')
    const existing = knownUsers[phone]
    if (existing) {
      login({ name: existing.name, phone, email: existing.email || null })
      navigate(redirectTo)
      return
    }
    setStep('name')
  }

  const handleCompleteSignup = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    setError('')
    setKnownUsers((prev) => ({ ...prev, [phone]: { name: name.trim(), email: null } }))
    login({ name: name.trim(), phone, email: null })
    navigate(redirectTo)
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
          <h2 className="text-2xl font-extrabold">Welcome back to SwipeDeals</h2>
          <p className="mt-3 text-sm text-white/75">
            Access your saved listings, ongoing chats and personalized recommendations across cars, properties and more.
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-base font-black text-white">S</span>
            <span className="text-base font-extrabold text-text">SwipeDeals</span>
          </Link>

          {step === 'phone' && (
            <>
              <h1 className="text-2xl font-extrabold text-text">Log in or sign up</h1>
              <p className="mt-2 text-sm text-text-secondary">We&rsquo;ll text you a one-time password to verify it&rsquo;s you.</p>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-info/30 bg-info/5 p-3.5 text-xs text-text-secondary">
                <Info size={15} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
                <span>
                  Demo credentials — Mobile <span className="font-semibold text-text">{DEMO_PHONE}</span>, OTP{' '}
                  <span className="font-semibold text-text">{DEMO_OTP}</span>
                </span>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSendOtp}>
                <Input
                  label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  icon={Phone}
                  placeholder="98765 43210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={error}
                  hint={!error ? "We'll never share your number with anyone." : undefined}
                  required
                />
                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <button
                type="button"
                onClick={() => { setStep('phone'); setError('') }}
                className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Change number
              </button>

              <h1 className="text-2xl font-extrabold text-text">Verify your number</h1>
              <p className="mt-2 text-sm text-text-secondary">
                Enter the 6-digit OTP sent to <span className="font-semibold text-text">+91 {phone}</span>
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleVerifyOtp}>
                <OtpInput value={otp} onChange={setOtp} error={error} />

                <Button type="submit" variant="primary" fullWidth size="lg">
                  Verify &amp; Continue
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

          {step === 'name' && (
            <>
              <h1 className="text-2xl font-extrabold text-text">What should we call you?</h1>
              <p className="mt-2 text-sm text-text-secondary">Just this once — we&rsquo;ll remember you next time you log in.</p>

              <form className="mt-6 space-y-4" onSubmit={handleCompleteSignup}>
                <Input
                  label="Full name"
                  icon={User}
                  placeholder="e.g. Aditya Kapoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error}
                  required
                />
                <Button type="submit" variant="primary" fullWidth size="lg">
                  Continue to SwipeDeals
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
