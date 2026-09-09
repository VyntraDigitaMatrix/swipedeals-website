import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCw,
  ShieldCheck,
  UserCheck,
  XCircle,
  BadgeCheck,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'
import { kycService } from '../services/kycService'

export default function UserActivation() {
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const { fetchKycStatus } = useKyc()

  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId')
  const queryStatus = searchParams.get('status')

  const [loading, setLoading] = useState(Boolean(sessionId))
  const [verifiedData, setVerifiedData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [activationStatus, setActivationStatus] = useState(
    queryStatus === 'success' ? 'success' : queryStatus === 'failed' ? 'failed' : null
  )

  useEffect(() => {
    if (!sessionId) {
      if (!queryStatus && isAuthenticated) {
        setLoading(true)
        kycService
          .getKycStatus()
          .then((res) => {
            const data = res?.data || res
            if (
              data &&
              (data.status === 'VERIFIED' ||
                data.status === 'COMPLETED' ||
                data.status === 'APPROVED' ||
                data.status === 'ACTIVE' ||
                (data.aadhaarVerified && data.panVerified))
            ) {
              setVerifiedData(data)
              setActivationStatus('success')
            } else {
              setActivationStatus('failed')
            }
          })
          .catch((err) => {
            setErrorMessage(err?.response?.data?.message || err.message)
            setActivationStatus('failed')
          })
          .finally(() => {
            setLoading(false)
          })
      }
      return
    }

    setLoading(true)
    setErrorMessage('')

    // Call backend DigiLocker completion endpoint
    kycService
      .completeDigilocker(sessionId)
      .then((res) => {
        // If response indicates failure, status === 503, or success === false
        if (res?.success === false || res?.status === 503 || res?.errorCode) {
          setActivationStatus('failed')
          setErrorMessage(res?.message || 'DigiLocker verification could not be completed. Please try again.')
          return
        }

        const data = res?.data || res
        const payload = data?.data || data

        if (
          payload?.status === 'NOT_STARTED' ||
          payload?.status === 'FAILED' ||
          data?.success === false
        ) {
          setActivationStatus('failed')
          setErrorMessage(
            data?.message ||
            payload?.message ||
            'DigiLocker verification could not be completed. Please try again.'
          )
          return
        }

        if (
          payload?.status === 'VERIFIED' ||
          payload?.status === 'COMPLETED' ||
          payload?.status === 'APPROVED' ||
          payload?.status === 'ACTIVE' ||
          payload?.status === 'verified' ||
          (payload?.aadhaarVerified && payload?.panVerified)
        ) {
          setVerifiedData(payload)
          setActivationStatus('success')
          fetchKycStatus()
        } else {
          setActivationStatus('failed')
          setErrorMessage(
            payload?.message || res?.message || 'DigiLocker verification could not be completed.'
          )
        }
      })
      .catch((err) => {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'DigiLocker verification could not be completed. Please try again.'
        setErrorMessage(errorMsg)
        setActivationStatus('failed')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [sessionId, queryStatus, isAuthenticated, fetchKycStatus])

  const displayName =
    verifiedData?.verifiedName ||
    verifiedData?.fullName ||
    verifiedData?.name ||
    user?.name ||
    'Verified Seller'
  const rawMobile =
    verifiedData?.verifiedMobileNumber ||
    verifiedData?.mobileNumber ||
    verifiedData?.phone ||
    user?.phone ||
    user?.mobileNumber ||
    ''
  const displayMobile = rawMobile
    ? rawMobile.startsWith('+')
      ? rawMobile
      : `+91 ${rawMobile}`
    : 'Registered Mobile Verified'
  const displayGender =
    verifiedData?.verifiedGender ||
    verifiedData?.gender ||
    'Verified via Aadhaar'
  const displayDob =
    verifiedData?.verifiedDateOfBirth ||
    verifiedData?.dateOfBirth ||
    verifiedData?.dob ||
    'Verified via Aadhaar'
  const displayStatus =
    verifiedData?.status &&
      verifiedData.status !== 'IN_PROGRESS' &&
      verifiedData.status !== 'PENDING'
      ? verifiedData.status
      : 'VERIFIED'

  const maskedAadhaar =
    verifiedData?.aadharNumber || verifiedData?.aadhaarNumber
      ? `XXXX XXXX ${(verifiedData.aadharNumber || verifiedData.aadhaarNumber).slice(-4)}`
      : 'Verified via DigiLocker'
  const maskedPan = verifiedData?.panNumber
    ? `${verifiedData.panNumber.slice(0, 2)}XXXXX${verifiedData.panNumber.slice(-2)}`
    : 'Verified via DigiLocker'

  return (
    <div className="container-page py-12">
      <Breadcrumb items={[{ label: 'User Activation' }]} />

      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 size={44} className="mx-auto mb-4 animate-spin text-primary" />
              <h2 className="text-xl font-bold text-text">Activating User Account...</h2>
              <p className="mt-2 text-xs text-text-secondary">
                Completing DigiLocker verification ({sessionId ? `Session ID: ${sessionId.slice(0, 8)}...` : 'Processing'})
              </p>
            </div>
          ) : activationStatus === 'success' ? (
            <>
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                <ShieldCheck size={48} />
              </div>

              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-700">
                <BadgeCheck size={15} /> User Account Activated
              </span>

              <h1 className="mt-2 text-2xl font-extrabold text-text">Identity Verified Successfully!</h1>
              <p className="mt-3 text-sm text-text-secondary">
                Your DigiLocker Aadhaar &amp; PAN identity verification is complete. Your account is now fully activated to post listings and trade on SwipeDeals.
              </p>

              {verifiedData && (
                <div className="mt-6 rounded-xl border border-border/80 bg-surface-alt/60 p-4 text-left text-xs space-y-3">
                  <div className="border-b border-border pb-2 flex items-center justify-between">
                    <span className="font-bold text-text flex items-center gap-1.5">
                      <UserCheck size={15} className="text-emerald-600" />
                      Verified Details
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      {displayStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-text-secondary">
                    <div>
                      <span className="text-[11px] text-text-secondary">Full Name</span>
                      <p className="font-semibold text-text text-xs mt-0.5">{displayName}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-secondary">Mobile Number</span>
                      <p className="font-semibold text-text text-xs mt-0.5">{displayMobile}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-secondary">Gender</span>
                      <p className="font-semibold text-text text-xs capitalize mt-0.5">{displayGender}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-secondary">Date of Birth</span>
                      <p className="font-semibold text-text text-xs mt-0.5">{displayDob}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                    <div className="rounded-lg bg-surface p-2 border border-border/60">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-secondary">Aadhaar</span>
                        <span className="text-emerald-600 font-bold">Verified</span>
                      </div>
                      <p className="font-mono text-[11px] font-semibold text-text mt-0.5">{maskedAadhaar}</p>
                    </div>

                    <div className="rounded-lg bg-surface p-2 border border-border/60">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-secondary">PAN</span>
                        <span className="text-emerald-600 font-bold">Verified</span>
                      </div>
                      <p className="font-mono text-[11px] font-semibold text-text mt-0.5">{maskedPan}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                <Button to="/sell" variant="primary" size="lg" icon={ArrowRight}>
                  Start Selling
                </Button>
                <Button to="/dashboard" variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <XCircle size={48} />
              </div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                Verification Failed
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-text">Verification Could Not Be Completed</h1>
              <p className="mt-3 text-sm text-text-secondary">
                {errorMessage || 'DigiLocker was unable to verify your identity or the session expired. Please try again.'}
              </p>

              {sessionId && (
                <p className="mt-2 font-mono text-[11px] text-text-secondary">
                  Session ID: <span className="font-semibold text-text">{sessionId}</span>
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                <Button to="/kyc" variant="primary" size="lg" icon={RotateCw}>
                  Try Again
                </Button>
                <Button to="/dashboard" variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
