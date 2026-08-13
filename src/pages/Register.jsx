import { Navigate } from 'react-router-dom'

// Sign-up is now handled inline by the mobile + OTP login flow — first-time
// numbers are asked for their name right after OTP verification. This route
// is kept so existing links don't break, and simply forwards to /login.
export default function Register() {
  return <Navigate to="/login" replace />
}
