import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

// Lightweight mock auth — persists a user object in localStorage. There's no
// real backend here, so `login`/`register` simply store the provided
// profile; any page can call `logout` to clear it.
export function useAuth() {
  const [user, setUser] = useLocalStorage('swipedeals_user', null)

  const login = useCallback((profile) => setUser(profile), [setUser])
  const logout = useCallback(() => setUser(null), [setUser])

  return { user, isAuthenticated: !!user, login, logout }
}

export default useAuth
