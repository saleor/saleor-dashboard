import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { AttributeInputTypeTooltip } from "./AttributeInputTypeTooltip";

interface AttributeNameWithTypeIconProps {
  name: React.ReactNode;
  inputType?: AttributeInputTypeEnum | null;
}

export const AttributeNameWithTypeIcon = ({ name, inputType }: AttributeNameWithTypeIconProps) => (
  <Box display="flex" alignItems="center" gap={1}>
    {name}
    {inputType && <AttributeInputTypeTooltip inputType={inputType} size="xsmall" />}
  </Box>
);
