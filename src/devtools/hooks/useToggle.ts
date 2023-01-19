import { useReducer } from "react"

export const useToggle = () => {
  return useReducer((prev, value = !prev) => value, true)
}
