import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { useState } from "react";

import { StaticElementName } from "./FilterElement/ConditionOptions";

export interface LeftOperand {
  type: AttributeInputTypeEnum | StaticElementName;
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
