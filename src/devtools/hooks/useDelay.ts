import { useEffect, useState } from "react"

/**
 * Delay a loading state for a given time. So
 * we can prevent showing loading states too quickly.
 *
 * This improves the perceived loading time of features
 * as users do not see loaders flash on screen for short
 * periods of time.
 *
 * @returns {boolean} Wether the given delay has exceeded the given delay timeout
 */
function useDelay(loading: boolean, delay = 300): boolean {
  const [delayExeeded, setDelayExeeded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayExeeded(true)
    }, delay)

    return () => {
      setDelayExeeded(false)
      clearTimeout(timeout)
    }
  }, [setDelayExeeded, delay, loading])

  return delayExeeded
}

export default useDelay
