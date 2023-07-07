import { useState } from "react";

import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";

const STATIC_OPTIONS: LeftOperand[] = [
  { value: "price", label: "Price", type: "price", slug: "price" },
  { value: "category", label: "Category", type: "category", slug: "category" },
  {
    value: "collection",
    label: "Collection",
    type: "collection",
    slug: "collection",
  },
  { value: "channel", label: "Channel", type: "channel", slug: "channel" },
];

export const useFilterLeftOperandsProvider = (): LeftOperandsProvider => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  return {
    operands,
    setOperands: (options: LeftOperand[]) =>
      setOperands(prev => [...prev, ...options]),
  };
};
