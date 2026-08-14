import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import type { ReactNode } from "react";

import { AttributeInputTypeTooltip } from "./AttributeInputTypeTooltip";

interface AttributeNameWithTypeIconProps {
  name: ReactNode;
  inputType?: AttributeInputTypeEnum | null;
  secondary?: string | null;
}

export const AttributeNameWithTypeIcon = ({
  name,
  inputType,
  secondary,
}: AttributeNameWithTypeIconProps): JSX.Element => (
  <Box display="flex" flexDirection="column" gap={0.5} minWidth={0}>
    <Box display="flex" alignItems="center" gap={1} minWidth={0}>
      {name}
      {inputType ? <AttributeInputTypeTooltip inputType={inputType} size="xsmall" /> : null}
    </Box>
    {secondary ? (
      <Text size={2} color="default2" ellipsis data-test-id="slug">
        {secondary}
      </Text>
    ) : null}
  </Box>
);
