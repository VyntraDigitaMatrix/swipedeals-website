import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MAX_COMPARE = 4

// Persists a small set of product ids selected for side-by-side comparison.
export function useCompare() {
  const [compareList, setCompareList] = useLocalStorage('swipedeals_compare', [])

  const isComparing = useCallback((id) => compareList.includes(id), [compareList])

  const toggleCompare = useCallback((id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }, [setCompareList])

  const clearCompare = useCallback(() => setCompareList([]), [setCompareList])
  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((x) => x !== id))
  }, [setCompareList])

  return {
    compareList,
    isComparing,
    toggleCompare,
    clearCompare,
    removeFromCompare,
    isFull: compareList.length >= MAX_COMPARE,
    count: compareList.length,
  }
}

export default useCompare
