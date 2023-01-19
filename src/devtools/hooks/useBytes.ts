import { useMemo } from "react"
import { byteSize, Unit } from "../helpers/byteSize"

export const useByteSize = (
  bytes: number,
  options?: { unit: Unit }
): number => {
  return useMemo(() => {
    return byteSize(bytes, options)
  }, [bytes, options])
}
