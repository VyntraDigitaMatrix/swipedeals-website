import { useState, useEffect, useCallback } from 'react'
import {
  User,
  Phone,
  Star,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send,
  MessageSquare,
  Home,
  Building,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/buttons/Button'
import Badge from '../components/common/Badge'
import Input from '../components/forms/Input'
import { useAuth } from '../hooks/useAuth'
import { userProfileService } from '../services/userProfileService'
import { sellerReviewService } from '../services/sellerReviewService'
import { titleCaseEnum } from '../utils/enumFormat'

export default function Profile() {
  const { isAuthenticated, user, login } = useAuth()

  // 1. Profile State (GET /api/user/profile)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState(null)

  // 2. Full Name Edit State (PUT /api/user/profile/name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState('')
  const [nameError, setNameError] = useState('')

  // 3. Mobile Number Change State (POST request-otp & PUT verify-otp)
  const [isChangingPhone, setIsChangingPhone] = useState(false)
  const [newMobileNumber, setNewMobileNumber] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [phoneSuccess, setPhoneSuccess] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // 4. User Reviews State (GET /api/reviews/my-reviews)
  const [reviewsData, setReviewsData] = useState(null)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

  // Fetch Profile (GET /api/user/profile)
  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true)
    setProfileError(null)
    try {
      const response = await userProfileService.getProfile()
      const data = response?.data || response
      setProfile(data)
      setNameInput(data?.fullName || '')
    } catch (err) {
      setProfileError(err?.response?.data?.message || err?.message || 'Failed to load profile')
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  // Fetch My Reviews (GET /api/reviews/my-reviews)
  const fetchMyReviews = useCallback(async () => {
    setLoadingReviews(true)
    setReviewsError(null)
    try {
      const response = await sellerReviewService.getMyReviews()
      // PageSellerReviewResponseDTO: { totalElements, totalPages, content: [...], ... }
      const data = response?.data || response
      setReviewsData(data)
    } catch (err) {
      setReviewsError(err?.response?.data?.message || err?.message || 'Failed to load reviews')
    } finally {
      setLoadingReviews(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
      fetchMyReviews()
    }
  }, [isAuthenticated, fetchProfile, fetchMyReviews])

  // Save Full Name (PUT /api/user/profile/name)
  const handleSaveName = async (e) => {
    e?.preventDefault()
    if (!nameInput.trim()) return

    setSavingName(true)
    setNameError('')
    setNameSuccess('')
    try {
      await userProfileService.updateFullName(nameInput.trim())
      setNameSuccess('Name updated successfully!')
      setIsEditingName(false)
      // Update local profile state
      setProfile((prev) => (prev ? { ...prev, fullName: nameInput.trim() } : prev))
      if (user) {
        login({ ...user, name: nameInput.trim() })
      }
    } catch (err) {
      setNameError(err?.response?.data?.message || err?.message || 'Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  // Request Mobile Change OTP (POST /api/user/profile/mobile/request-otp)
  const handleRequestMobileOtp = async (e) => {
    e?.preventDefault()
    const cleanNumber = newMobileNumber.trim().replace(/^\+91/, '')
    if (!cleanNumber || cleanNumber.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number')
      return
    }

    setSendingOtp(true)
    setPhoneError('')
    setPhoneSuccess('')
    try {
      await userProfileService.requestMobileOtp(cleanNumber)
      setOtpSent(true)
      setPhoneSuccess(`OTP sent to +91 ${cleanNumber}`)
    } catch (err) {
      setPhoneError(err?.response?.data?.message || err?.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  // Verify Mobile Change OTP (PUT /api/user/profile/mobile/verify-otp)
  const handleVerifyMobileOtp = async (e) => {
    e?.preventDefault()
    const cleanNumber = newMobileNumber.trim().replace(/^\+91/, '')
    if (!otpInput.trim()) {
      setPhoneError('Please enter the OTP')
      return
    }

    setVerifyingOtp(true)
    setPhoneError('')
    setPhoneSuccess('')
    try {
      await userProfileService.verifyMobileOtp({
        mobileNumber: cleanNumber,
        otp: otpInput.trim(),
      })
      setPhoneSuccess('Mobile number updated successfully!')
      setIsChangingPhone(false)
      setOtpSent(false)
      setOtpInput('')
      setNewMobileNumber('')
      // Refresh profile
      fetchProfile()
    } catch (err) {
      setPhoneError(err?.response?.data?.message || err?.message || 'Invalid or expired OTP')
    } finally {
      setVerifyingOtp(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container-page py-12">
        <Breadcrumb items={[{ label: 'Profile' }]} />
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User size={30} />
          </div>
          <h1 className="text-xl font-bold text-text">Sign in to view your profile</h1>
          <p className="mt-2 text-sm text-text-secondary">Please log in to manage your profile, phone, KYC, addresses and reviews.</p>
          <Button to="/login" variant="primary" className="mt-6">
            Log In / Sign Up
          </Button>
        </div>
      </div>
    )
  }

  const kyc = profile?.kyc
  const addresses = profile?.addresses || []
  const reviewsContent = reviewsData?.content || []

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'User Profile' }]} />

      <div className="mt-6 space-y-8">
        {/* ================= 1. PROFILE OVERVIEW HEADER ================= */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          {loadingProfile ? (
            <div className="flex items-center justify-center py-10 text-text-secondary">
              <RefreshCw size={24} className="animate-spin text-primary mr-2" /> Loading profile...
            </div>
          ) : profileError ? (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
              <AlertCircle size={18} className="shrink-0" />
              <span>{profileError}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Avatar & Key Profile Fields */}
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-2xl font-black text-white shadow-soft">
                  {(profile?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-black text-text">{profile?.fullName || 'User'}</h1>
                    {profile?.role && (
                      <Badge variant="primary">{titleCaseEnum(profile.role)}</Badge>
                    )}
                    {profile?.status && (
                      <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {titleCaseEnum(profile.status)}
                      </Badge>
                    )}
                  </div>

                  <p className="font-mono text-xs text-text-secondary">ID: {profile?.id || '—'}</p>
                  <p className="text-sm font-medium text-text-secondary">
                    Mobile: <span className="font-mono font-bold text-text">+91 {profile?.mobileNumber || '—'}</span>
                  </p>
                </div>
              </div>

              {/* Stats: averageRating & totalReviews */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-alt/50 p-4 sm:w-auto">
                <div className="text-center sm:px-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-light">Average Rating</p>
                  <p className="mt-1 flex items-center justify-center gap-1 font-mono text-xl font-black text-text">
                    {profile?.averageRating ?? 0}
                    <Star size={18} className="fill-warning text-warning" />
                  </p>
                </div>
                <div className="border-l border-border text-center sm:px-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-light">Total Reviews</p>
                  <p className="mt-1 font-mono text-xl font-black text-text">{profile?.totalReviews ?? 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 2. PROFILE EDIT & CONTACT APIS ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* PUT /api/user/profile/name */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                <h2 className="text-base font-bold text-text">Full Name</h2>
              </div>
            </div>

            {nameSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success">
                <CheckCircle2 size={16} /> <span>{nameSuccess}</span>
              </div>
            )}
            {nameError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertCircle size={16} /> <span>{nameError}</span>
              </div>
            )}

            <div className="mt-5">
              {!isEditingName ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-alt/40 p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-light">Current Name</p>
                    <p className="mt-0.5 text-base font-bold text-text">{profile?.fullName || 'Not provided'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingName(true)
                      setNameInput(profile?.fullName || '')
                      setNameSuccess('')
                      setNameError('')
                    }}
                  >
                    <Edit2 size={14} /> Edit Name
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSaveName} className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    icon={User}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      disabled={savingName}
                    >
                      <X size={14} /> Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={savingName || !nameInput.trim()}
                    >
                      {savingName ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Save Name
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* POST /api/user/profile/mobile/request-otp & PUT /api/user/profile/mobile/verify-otp */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                <h2 className="text-base font-bold text-text">Mobile Number</h2>
              </div>
            </div>

            {phoneSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success">
                <CheckCircle2 size={16} /> <span>{phoneSuccess}</span>
              </div>
            )}
            {phoneError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertCircle size={16} /> <span>{phoneError}</span>
              </div>
            )}

            <div className="mt-5">
              {!isChangingPhone ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-alt/40 p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-light">Registered Mobile Number</p>
                    <p className="mt-0.5 font-mono text-base font-bold text-text">+91 {profile?.mobileNumber || '—'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsChangingPhone(true)
                      setOtpSent(false)
                      setNewMobileNumber('')
                      setOtpInput('')
                      setPhoneSuccess('')
                      setPhoneError('')
                    }}
                  >
                    <Edit2 size={14} /> Change Number
                  </Button>
                </div>
              ) : !otpSent ? (
                <form onSubmit={handleRequestMobileOtp} className="space-y-4">
                  <Input
                    label="New Mobile Number"
                    placeholder="10-digit mobile number"
                    type="tel"
                    value={newMobileNumber}
                    onChange={(e) => setNewMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    icon={Phone}
                    hint="An OTP will be sent to this number to verify the update."
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setIsChangingPhone(false)}
                      disabled={sendingOtp}
                    >
                      <X size={14} /> Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={sendingOtp || newMobileNumber.length < 10}
                    >
                      {sendingOtp ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Sending OTP...
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Send OTP
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyMobileOtp} className="space-y-4">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-text">
                    Enter the OTP sent to <span className="font-mono font-bold">+91 {newMobileNumber}</span>
                  </div>

                  <Input
                    label="Enter OTP"
                    placeholder="6-digit OTP code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                    className="font-mono text-center text-lg tracking-widest"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleRequestMobileOtp}
                      disabled={sendingOtp}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setOtpInput('')
                        }}
                        disabled={verifyingOtp}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={verifyingOtp || !otpInput.trim()}
                      >
                        {verifyingOtp ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Verifying...
                          </>
                        ) : (
                          <>
                            <Check size={14} /> Verify &amp; Update
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= 3. KYC PROFILE DETAILS ================= */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              {kyc?.status === 'VERIFIED' ? (
                <ShieldCheck size={20} className="text-success" />
              ) : (
                <ShieldAlert size={20} className="text-warning" />
              )}
              <h2 className="text-base font-bold text-text">KYC Verification Details</h2>
            </div>
            {kyc?.status && (
              <Badge variant={kyc.status === 'VERIFIED' ? 'success' : 'warning'}>
                {titleCaseEnum(kyc.status)}
              </Badge>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface-alt/40 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Verified Name</span>
              <p className="mt-1 text-sm font-semibold text-text">{kyc?.verifiedName || '—'}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt/40 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Verified Mobile</span>
              <p className="mt-1 font-mono text-sm font-semibold text-text">{kyc?.verifiedMobileNumber || '—'}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt/40 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Gender</span>
              <p className="mt-1 text-sm font-semibold text-text">{kyc?.verifiedGender || '—'}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt/40 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Date of Birth</span>
              <p className="mt-1 font-mono text-sm font-semibold text-text">{kyc?.verifiedDateOfBirth || '—'}</p>
            </div>
          </div>
        </div>

        {/* ================= 4. ADDRESSES ================= */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <h2 className="text-base font-bold text-text">Addresses</h2>
            </div>
            <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-semibold text-text">
              {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
            </span>
          </div>

          <div className="mt-5">
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MapPin size={30} className="text-text-light mb-2" />
                <p className="text-sm text-text-secondary">No addresses on file for this profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id || Math.random()}
                    className="relative rounded-xl border border-border bg-surface-alt/30 p-4 transition-all hover:border-primary/40"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="primary" icon={addr.addressType === 'WORK' ? Building : Home}>
                        {titleCaseEnum(addr.addressType || 'HOME')}
                      </Badge>
                      {addr.id && (
                        <span className="font-mono text-[10px] text-text-light">
                          ID: {addr.id.slice(0, 8)}...
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-text">{addr.street || '—'}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {addr.city}, {addr.state}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-text-secondary">
                      {addr.country} - {addr.zipCode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= 5. USER REVIEWS (GET /api/reviews/my-reviews) ================= */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                <h2 className="text-base font-bold text-text">My Reviews</h2>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                Reviews received by your seller account.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchMyReviews}
              disabled={loadingReviews}
              className="text-xs"
            >
              <RefreshCw size={12} className={loadingReviews ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>

          <div className="mt-5">
            {loadingReviews ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <RefreshCw size={24} className="animate-spin text-primary mb-2" />
                <p className="text-sm text-text-secondary">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                <AlertCircle size={18} className="shrink-0" />
                <span>{reviewsError}</span>
              </div>
            ) : reviewsContent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MessageSquare size={30} className="text-text-light mb-2" />
                <p className="text-sm text-text-secondary">No reviews found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
                  <span>Total Reviews: {reviewsData?.totalElements ?? reviewsContent.length}</span>
                  <span>Total Pages: {reviewsData?.totalPages ?? 1}</span>
                </div>

                <div className="space-y-3">
                  {reviewsContent.map((rev) => {
                    const reviewerDisplayName = rev.reviewerName || rev.sellerName || 'Anonymous'
                    const initial = reviewerDisplayName.charAt(0).toUpperCase()
                    const reviewerId = rev.reviewerId || rev.id

                    // Format date nicely
                    let dateDisplay = ''
                    if (rev.createdAt) {
                      try {
                        const d = new Date(rev.createdAt)
                        dateDisplay = d.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      } catch {
                        dateDisplay = rev.createdAt
                      }
                    }

                    return (
                      <div
                        key={rev.id || Math.random()}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:border-border/80"
                      >
                        {/* Header: Avatar, Name, Reviewer ID, Rating & Date */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700 font-bold text-base shadow-sm">
                              {initial}
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-text text-sm sm:text-base">
                                  {reviewerDisplayName}
                                </span>
                                {reviewerId && (
                                  <span className="inline-block rounded-md bg-rose-100/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-700">
                                    {reviewerId}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={
                                        star <= (rev.rating || 0)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-border'
                                      }
                                    />
                                  ))}
                                  <span className="ml-1 font-bold text-text">
                                    {Number(rev.rating || 0).toFixed(1)}
                                  </span>
                                </div>

                                {dateDisplay && (
                                  <>
                                    <span className="text-text-light">•</span>
                                    <span>{dateDisplay}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {rev.sellerName && (
                            <div className="text-xs text-text-secondary sm:text-right">
                              <span>Reviewed For: </span>
                              <strong className="text-text font-semibold">{rev.sellerName}</strong>
                            </div>
                          )}
                        </div>

                        {/* Review Comment Body */}
                        {rev.review && (
                          <div className="mt-4 pt-3 border-t border-border/60 text-sm text-text-secondary leading-relaxed">
                            {rev.review}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
