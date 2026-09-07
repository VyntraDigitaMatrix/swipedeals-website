import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Route-level auth guard for pages that require a signed-in user.
 *
 * Used as a layout route in App.jsx — <Route element={<PrivateRoute />}>
 * wraps one or more child <Route>s. When signed in, it renders the matched
 * child via <Outlet/>; otherwise it redirects to /login with a `redirect`
 * query param pointing back at the page the visitor was trying to reach —
 * the same convention already used by SellAccessGate and Login.jsx, so the
 * user lands back here automatically once they sign in.
 *
 * Pages that need auth PLUS an extra condition (e.g. the sell flows also
 * require completed KYC) keep handling that nuance themselves via
 * SellAccessGate — this guard only covers the "must be logged in at all" case.
 */
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <Outlet />
}
