import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeOptionAdornmentProps {
  inputType: AttributeInputTypeEnum;
  size?: AttributeInputTypeIconSize;
}

export const AttributeInputTypeOptionAdornment = ({
  inputType,
  size = "xsmall",
}: AttributeInputTypeOptionAdornmentProps) => (
  <Box display="flex" alignItems="center" marginRight={1} flexShrink={0}>
    <AttributeInputTypeIcon inputType={inputType} size={size} />
  </Box>
);
