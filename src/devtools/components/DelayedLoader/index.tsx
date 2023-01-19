import React from "react"

import useDelay from "../../hooks/useDelay"

interface IDelayedLoaderProps {
  loading: boolean
  loader: React.ReactNode
  delay?: number
}

/**
 * Rendering a loading indicator when content is loading.
 * But delay loadint the indicator before the delay has passed.
 *
 * This improves the perceived performance of the app as the loader
 * does not flash on screen for short periods of time.
 *
 */
export const DelayedLoader: React.FC<IDelayedLoaderProps> = (props) => {
  const { loading, loader, delay, children } = props
  const delayExeeded = useDelay(loading, delay)

  if (loading && delayExeeded) {
    return <>{loader}</>
  }

  return <>{children}</>
}
