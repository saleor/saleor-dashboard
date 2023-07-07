import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { StaticElementName } from "./FilterElement/ConditionOptions";

export interface LeftOperand {
  type: AttributeInputTypeEnum | StaticElementName;
  label: string;
  value: string;
  slug: string;
}

export interface LeftOperandsProvider {
  operands: LeftOperand[];
  setOperands: (operands: LeftOperand[]) => void;
}
