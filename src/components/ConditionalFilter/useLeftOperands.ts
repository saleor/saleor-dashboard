import { useState } from "react"

const STATIC_OPTIONS = [
  { value: "price", label: "Price", type: 1 },
  { value: "category", label: "Category", type: 1 },
  { value: "collection", label: "Collection", type: 1 },
  { value: "channel", label: "Channel", type: 1 },
];

export const useLeftOperands = () => {
  const [operands, setOperands] = useState(STATIC_OPTIONS)


  return operands
}