import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Bell, Camera, Heart, Lock, LogIn, LogOut, Mail, MapPin, Phone, Settings, ShieldCheck, ShoppingBag, User } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import Button from '../components/buttons/Button'
import { useAuth } from '../hooks/useAuth'
import { useKyc } from '../hooks/useKyc'
import { cn } from '../utils/cn'

const TABS = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'listings', label: 'My Listings', icon: ShoppingBag },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
]

export default function Profile() {
  const [tab, setTab] = useState('profile')
  const { user, isAuthenticated, logout } = useAuth()
  const { kyc, isKycVerified } = useKyc()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: 'Profile' }]} />
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LogIn size={28} aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-text">You&rsquo;re not logged in</h1>
          <p className="mt-2 text-sm text-text-secondary">Log in to view your profile, saved listings and account settings.</p>
          <div className="mt-6 flex gap-3">
            <Button to="/login" variant="primary">
              Log In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex flex-col items-center border-b border-border pb-5 text-center">
            <div className="relative">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-2xl font-black text-white">
                {(user?.name || user?.phone || 'U').charAt(0).toUpperCase()}
              </span>
              <button type="button" aria-label="Change photo" className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow-soft">
                <Camera size={12} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 font-bold text-text">{user?.name || (user?.phone ? `+91 ${user.phone}` : 'Account')}</p>
            <p className="text-xs text-text-secondary">{user?.email || (user?.phone && `+91 ${user.phone}`)}</p>
          </div>

          <nav className="mt-4 flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors',
                  tab === t.id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-alt'
                )}
              >
                <t.icon size={16} aria-hidden="true" />
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold text-danger hover:bg-danger/5"
            >
              <LogOut size={16} aria-hidden="true" />
              Log Out
            </button>
          </nav>
        </aside>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          {tab === 'profile' && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-text">Profile Information</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Full Name" icon={User} defaultValue={user?.name || ''} />
                <Input
                  label="Mobile Number"
                  icon={Phone}
                  type="tel"
                  defaultValue={user.phone ? `+91 ${user.phone}` : ''}
                  disabled
                  className="cursor-not-allowed opacity-60"
                  hint="Verified via OTP — contact support to change."
                />
                <Input label="Email Address" icon={Mail} type="email" defaultValue={user.email || ''} placeholder="Add an email (optional)" />
                <Input label="City" icon={MapPin} placeholder="Mumbai" />
              </div>
              <Button variant="primary" className="mt-6">
                Save Changes
              </Button>
            </div>
          )}

          {tab === 'listings' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag size={32} className="mb-4 text-text-light" aria-hidden="true" />
              <p className="text-sm text-text-secondary">You haven&rsquo;t listed anything yet.</p>
              <Button to="/sell" variant="primary" size="sm" className="mt-4">
                Create a Listing
              </Button>
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart size={32} className="mb-4 text-text-light" aria-hidden="true" />
              <p className="text-sm text-text-secondary">Manage your saved items on the dedicated wishlist page.</p>
              <Button to="/wishlist" variant="primary" size="sm" className="mt-4">
                Go to Wishlist
              </Button>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-text">Notification Preferences</h2>
              <div className="space-y-4">
                {['Price drop alerts', 'New matching listings', 'Dealer messages', 'Marketing emails'].map((label) => (
                  <label key={label} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <span className="text-sm font-medium text-text">{label}</span>
                    <input type="checkbox" defaultChecked className="h-5 w-9 shrink-0 accent-[#6E0D25]" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-text">
                <Settings size={18} aria-hidden="true" /> Security Settings
              </h2>

              {isKycVerified ? (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-text">KYC verified</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Aadhaar &amp; PAN on file for <span className="font-semibold text-text">{kyc?.fullName}</span> &mdash; you can list
                      products in any category.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">KYC not completed</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Verify your identity with Aadhaar &amp; PAN before you can list a product in any category.
                    </p>
                    <Button to="/kyc" variant="primary" size="sm" className="mt-3">
                      Complete KYC
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
                <Lock size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-text">OTP-secured account</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    There&rsquo;s no password to manage — every login is verified with a one-time code sent to{' '}
                    <span className="font-semibold text-text">+91 {user.phone}</span>.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-6" onClick={handleLogout}>
                Log Out of This Device
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
