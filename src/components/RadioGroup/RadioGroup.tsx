import {
  RadioGroup as RadioGroupBase,
  RadioGroupRootProps,
} from "@saleor/macaw-ui-next";
import React from "react";

import { StopPropagation } from "../StopPropagation";

const RadioGroupRoot = (props: RadioGroupRootProps) => {
  // StopProgation is used here to block onClick events from RadioGroup that cause throw error in datagrid
  // Datagrid listing for all on click event but RadioGroup emitated couple events at onced
  return (
    <StopPropagation>
      <RadioGroupBase {...props} />
    </StopPropagation>
  );
};

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupBase.Item,
});
