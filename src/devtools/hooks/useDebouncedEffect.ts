import { useEffect } from "react"

export const useDebouncedEffect = (
  cb: () => void,
  deps: any[],
  delay = 300
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      cb()
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, delay, ...deps])
}
