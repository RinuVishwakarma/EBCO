import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 1000) //setting the debounced timeout value

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay]) //debounced will call if these parameter changes

  return debouncedValue
}

export default useDebounce
