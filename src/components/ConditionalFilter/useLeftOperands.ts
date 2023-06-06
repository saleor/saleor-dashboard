import { useState } from "react"

const STATIC_OPTIONS = [
  { value: "price", label: "Price" },
  { value: "category", label: "Category" },
  { value: "rating", label: "Rating" },
  { value: "discount", label: "Discount" },
];

export const useLeftOperands = () => {
  const [operands, setOperands] = useState(STATIC_OPTIONS)


  return operands
}