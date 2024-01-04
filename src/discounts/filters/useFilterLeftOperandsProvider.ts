import { LeftOperand } from "@dashboard/components/ConditionalFilter/LeftOperandsProvider";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import unionBy from "lodash/unionBy";
import { useState } from "react";

export const STATIC_OPTIONS: LeftOperand[] = [
  {
    value: "name",
    label: "Name",
    type: AttributeInputTypeEnum.PLAIN_TEXT,
    slug: "name",
  },
  {
    value: "startDate",
    label: "Start date",
    type: AttributeInputTypeEnum.DATE,
    slug: "startDate",
  },
  {
    value: "endDate",
    label: "End date",
    type: AttributeInputTypeEnum.DATE,
    slug: "endDate",
  },
];

export const useFilterLeftOperandsProvider = () => {
  const [operands, setOperands] = useState<LeftOperand[]>(STATIC_OPTIONS);

  return {
    operands,
    setOperands: (options: LeftOperand[]) =>
      setOperands(prev => unionBy([...prev, ...options], "value")),
  };
};
