import { use_GetInitialDynamicLeftOperandsQuery } from "@dashboard/graphql";
import { useState } from "react";
import { AttributeInputType, StaticElementName } from "./staticConditions";

export interface LeftOperand {
  type: AttributeInputType | StaticElementName
  label: string
  value: string
} 

const STATIC_OPTIONS: LeftOperand[] = [
  { value: "price", label: "Price", type: "price" },
  { value: "category", label: "Category", type: "category" },
  { value: "collection", label: "Collection", type: "collection" },
  { value: "channel", label: "Channel", type: "channel" },
];

export const useLeftOperands = () => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  const { data } = use_GetInitialDynamicLeftOperandsQuery({
    variables: {},
  });

  const dynamic =
    data?.attributes.edges.map(({ node }) => ({
      label: node.name,
      value: node.id,
      type: node.inputType,
      slug: node.slug,
    })) ?? [];

  return [...operands, ...dynamic];
};
