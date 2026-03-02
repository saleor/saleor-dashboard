import { type AttributeEntityTypeEnum, type AttributeInputTypeEnum } from "@dashboard/graphql";

import { type StaticElementName } from "./FilterElement/ConditionOptions";

export interface LeftOperand {
  type: AttributeInputTypeEnum | StaticElementName;
  label: string;
  value: string;
  slug: string;
  entityType?: AttributeEntityTypeEnum;
  maxOccurrences?: number;
}

export interface LeftOperandsProvider {
  operands: LeftOperand[];
  setOperands: (operands: LeftOperand[]) => void;
}
