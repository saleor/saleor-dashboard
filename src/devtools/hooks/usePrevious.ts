import { useRef, useEffect } from "react"

export const usePrevious = <T>(value: T | null) => {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
