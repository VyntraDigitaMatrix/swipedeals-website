import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import SuccessScreen from '../components/common/SuccessScreen'
import SellAccessGate from '../components/common/SellAccessGate'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'

export default function Kyc() {
  const { user, isAuthenticated } = useAuth()
  const {
    kyc,
    isKycVerified,
    loading: kycLoading,
    error: kycError,
    initiateDigilocker,
    completeDigilocker,
  } = useKyc()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/sell'

  const [actionLoading, setActionLoading] = useState(false)
  const [justVerified, setJustVerified] = useState(false)
  const [error, setError] = useState('')
  const [digilockerMessage, setDigilockerMessage] = useState('')

  // Check if returning from DigiLocker redirect with sessionId in URL parameters
  useEffect(() => {
    const sessionId = searchParams.get('session_id') || searchParams.get('sessionId')
    if (sessionId && isAuthenticated) {
      setActionLoading(true)
      setDigilockerMessage('Completing DigiLocker verification...')
      completeDigilocker(sessionId)
        .then(() => {
          setJustVerified(true)
          setDigilockerMessage('')
          searchParams.delete('sessionId')
          setSearchParams(searchParams, { replace: true })
        })
        .catch((err) => {
          setError(err.message || 'DigiLocker verification could not be completed.')
        })
        .finally(() => {
          setActionLoading(false)
        })
    }
  }, [searchParams, isAuthenticated, completeDigilocker, setSearchParams])

  if (!isAuthenticated) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'KYC Verification' }]} />
        <SellAccessGate isAuthenticated={false} redirect={location.pathname + location.search} />
      </div>
    )
  }

  const handleDigilockerInitiate = async () => {
    setError('')
    setActionLoading(true)
    setDigilockerMessage('Redirecting to DigiLocker...')
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://swipedeals.in'
      const userVerifiedTarget = `${origin}/user-verified`

      const res = await initiateDigilocker({
        redirect_url: userVerifiedTarget,
        redirectUrl: userVerifiedTarget,
        callback_url: userVerifiedTarget,
        callbackUrl: userVerifiedTarget,
      })

      const rawAuthUrl =
        res?.authorizationUrl ||
        res?.data?.authorizationUrl ||
        res?.data?.data?.authorizationUrl
      const sessionId =
        res?.sessionId || res?.data?.sessionId || res?.data?.data?.sessionId

      if (rawAuthUrl) {
        let finalAuthUrl = rawAuthUrl
        const encodedTarget = encodeURIComponent(userVerifiedTarget)
        const encodedSandboxHttps = encodeURIComponent('https://developer.sandbox.co.in')
        const encodedSandboxHttp = encodeURIComponent('http://developer.sandbox.co.in')

        if (
          rawAuthUrl.startsWith('https://developer.sandbox.co.in') ||
          rawAuthUrl.startsWith('http://developer.sandbox.co.in')
        ) {
          const match = rawAuthUrl.match(/(?:session_id|sessionId)=([^&]+)/)
          const sid = match ? match[1] : sessionId
          finalAuthUrl = sid ? `${userVerifiedTarget}?session_id=${sid}` : userVerifiedTarget
        } else {
          // Replace developer.sandbox.co.in in authorizationUrl query parameters so DigiLocker redirects back to /user-verified after Allow
          finalAuthUrl = rawAuthUrl
            .replace(new RegExp(encodedSandboxHttps, 'g'), encodedTarget)
            .replace(new RegExp(encodedSandboxHttp, 'g'), encodedTarget)
            .replace(/https:\/\/developer\.sandbox\.co\.in/g, userVerifiedTarget)
            .replace(/http:\/\/developer\.sandbox\.co\.in/g, userVerifiedTarget)
            .replace(/developer\.sandbox\.co\.in/g, `${window.location.host}/user-verified`)
        }

        setDigilockerMessage('Redirecting to DigiLocker portal...')
        window.location.href = finalAuthUrl
        return
      }

      if (sessionId) {
        setDigilockerMessage('Opening user verified page...')
        window.location.href = `${userVerifiedTarget}?session_id=${sessionId}`
        return
      }

      throw new Error('DigiLocker initiation did not return an authorization URL.')
    } catch (err) {
      setError(err.message || 'Failed to initiate DigiLocker. Please try again.')
    } finally {
      setActionLoading(false)
      setDigilockerMessage('')
    }
  }

  if (isKycVerified) {
    const displayName = kyc?.verifiedName || kyc?.fullName || user?.name || 'Verified Seller'
    const displayMobile = kyc?.verifiedMobileNumber || user?.phone || 'N/A'
    const displayGender = kyc?.verifiedGender || 'N/A'
    const displayDob = kyc?.verifiedDateOfBirth || 'N/A'
    const maskedAadhar = kyc?.aadharNumber ? `XXXX XXXX ${kyc.aadharNumber.slice(-4)}` : 'Verified via DigiLocker'
    const maskedPan = kyc?.panNumber ? `${kyc.panNumber.slice(0, 2)}XXXXX${kyc.panNumber.slice(-2)}` : 'Verified via DigiLocker'

    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'KYC Verification' }]} />
        <SuccessScreen
          title={justVerified ? 'KYC Verified Successfully!' : "You're already KYC Verified"}
          description={
            justVerified
              ? 'Your identity and credentials have been verified. You can now post listings across all categories on SwipeDeals.'
              : 'Your DigiLocker Aadhaar & PAN identity check is complete — you are authorized to create listings on SwipeDeals.'
          }
          actions={[{ label: 'Continue Selling', to: redirectTo }, { label: 'Go to Dashboard', to: '/dashboard', variant: 'outline' }]}
        >
          <div className="rounded-2xl border border-border bg-surface p-5 text-left text-sm shadow-soft">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <p className="flex items-center gap-2 font-bold text-text">
                <ShieldCheck size={18} className="text-emerald-600" aria-hidden="true" />
                DigiLocker Verified Record
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700">
                <CheckCircle2 size={12} /> {kyc?.status || 'VERIFIED'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-text-secondary">Verified Full Name</span>
                <p className="font-semibold text-text text-sm">{displayName}</p>
              </div>
              <div>
                <span className="text-text-secondary">Verified Mobile</span>
                <p className="font-semibold text-text text-sm">{displayMobile.startsWith('+') ? displayMobile : `+91 ${displayMobile}`}</p>
              </div>
              <div>
                <span className="text-text-secondary">Gender</span>
                <p className="font-semibold text-text capitalize">{displayGender}</p>
              </div>
              <div>
                <span className="text-text-secondary">Date of Birth</span>
                <p className="font-semibold text-text">{displayDob}</p>
              </div>
            </div>
          </div>
        </SuccessScreen>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'KYC Verification' }]} />

      <div className="mb-8 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <ShieldCheck size={13} aria-hidden="true" /> Official DigiLocker Verification
        </span>
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Verify Your Seller Identity</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
          To ensure authentic listings and buyer safety, all sellers on SwipeDeals complete a one-time DigiLocker KYC verification.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
              <ShieldCheck size={36} />
            </div>
            <h2 className="text-xl font-extrabold text-text">Verify via DigiLocker</h2>
            <p className="mt-2 text-xs text-text-secondary">
              Connect securely with your Government DigiLocker account to verify your Aadhaar &amp; PAN identity.
            </p>
          </div>

          <div className="mb-6 space-y-3 rounded-xl border border-border/80 bg-surface-alt/50 p-4 text-xs text-text-secondary">
            <div className="flex items-center gap-2 font-semibold text-text">
              <CheckCircle2 size={15} className="text-emerald-600" /> Fast &amp; 100% Paperless
            </div>
            <p>Your Aadhaar &amp; PAN documents are fetched directly from your official DigiLocker account.</p>
          </div>

          {(error || kycError) && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/5 p-3.5 text-xs text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error || kycError}</span>
            </div>
          )}

          {digilockerMessage && (
            <p className="mb-4 text-center text-xs font-semibold text-primary animate-pulse">{digilockerMessage}</p>
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            loading={actionLoading || kycLoading}
            onClick={handleDigilockerInitiate}
            icon={ExternalLink}
            className="mt-2"
          >
            Authorize with DigiLocker
          </Button>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-info/30 bg-info/5 p-3.5 text-xs text-text-secondary">
            <Info size={15} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
            <span>Your identity details are used solely for seller verification and are protected with 128-bit encryption.</span>
          </div>

          <p className="mt-4 text-center text-[11px] text-text-secondary flex items-center justify-center gap-1">
            <Lock size={11} /> Official Government DigiLocker Integration
          </p>
        </div>
      </div>
    </div>
  )
}
