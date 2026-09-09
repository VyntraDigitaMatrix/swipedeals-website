import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue((prev) => {
          const valueToStore = newValue instanceof Function ? newValue(prev) : newValue
          if (valueToStore === null || valueToStore === undefined) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
          window.dispatchEvent(new Event('storage'))
          return valueToStore
        })
      } catch (e) {
        console.error(e)
      }
    },
    [key]
  )

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        setValue(item !== null ? JSON.parse(item) : initialValue)
      } catch {
        setValue(initialValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [value, setStoredValue]
}

export default useLocalStorage
