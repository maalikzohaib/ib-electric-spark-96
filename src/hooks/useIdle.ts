import { useEffect, useState } from 'react'

export function useIdle(delayMs = 0) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timeout: any
    const cb = () => {
      if (delayMs) {
        timeout = setTimeout(() => setIdle(true), delayMs)
      } else {
        setIdle(true)
      }
    }
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(cb)
    } else {
      // Fallback
      timeout = setTimeout(cb, 100)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [delayMs])

  return idle
}

