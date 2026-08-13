import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MAX_RECENT = 6

export function useRecentSearches() {
  const [recent, setRecent] = useLocalStorage('swipedeals_recent_searches', [])

  const addSearch = useCallback((term) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecent((prev) => [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT))
  }, [setRecent])

  const clearSearches = useCallback(() => setRecent([]), [setRecent])

  return { recent, addSearch, clearSearches }
}

export default useRecentSearches
