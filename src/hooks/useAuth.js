import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { authService } from '../services/authService'

// Real backend-backed auth. Session tokens live in localStorage under
// authService's own keys; `user` here is just the display profile
// (name/phone/email) the app renders in the navbar and account pages.
//
// `login(profile)` is called by the Login page once the OTP has been
// verified and tokens have already been stored via authService.setTokens().
// `logout()` best-effort revokes the refresh token on the server, then
// always clears local session state regardless of whether that succeeds.
export function useAuth() {
  const [user, setUser] = useLocalStorage('swipedeals_user', null)

  const login = useCallback(
    (profile) => {
      setUser(profile)
    },
    [setUser]
  )

  const logout = useCallback(() => {
    const refreshToken = authService.getRefreshToken()
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {
        // Token may already be expired/revoked — local cleanup below still proceeds.
      })
    }
    authService.clearTokens()
    setUser(null)
  }, [setUser])

  const hasToken = !!authService.getAccessToken()
  const effectiveUser = user || (hasToken ? { name: 'User' } : null)
  const isAuthenticated = !!effectiveUser

  return { user: effectiveUser, isAuthenticated, login, logout }
}

export default useAuth
