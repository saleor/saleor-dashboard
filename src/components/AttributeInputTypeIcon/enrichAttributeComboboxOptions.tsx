import { type Option } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { AttributeInputTypeOptionAdornment } from "./AttributeInputTypeOptionAdornment";
import { isAttributeInputTypeEnum } from "./isAttributeInputTypeEnum";

type OperandWithType = Option & {
  type?: string;
};

export const enrichAttributeComboboxOption = <T extends OperandWithType>(
  option: T,
): T & { startAdornment?: ReactNode } => {
  if (!option.type || !isAttributeInputTypeEnum(option.type)) {
    return option;
  }

  return {
    ...option,
    startAdornment: <AttributeInputTypeOptionAdornment inputType={option.type} />,
  };
};

export const enrichAttributeComboboxOptions = <T extends OperandWithType>(options: T[]) =>
  options.map(enrichAttributeComboboxOption);
