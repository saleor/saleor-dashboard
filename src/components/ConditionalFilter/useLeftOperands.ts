import { useState } from "react";

import {
  AttributeInputType,
  StaticElementName,
} from "./FilterElement/ConditionOptions";

export interface LeftOperand {
  type: AttributeInputType | StaticElementName;
  label: string;
  value: string;
  slug: string;
}

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

export const useLeftOperands = () => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  return {
    operands,
    setOperands,
  };
};
