import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeLabelProps {
  inputType: AttributeInputTypeEnum;
  iconSize?: AttributeInputTypeIconSize;
  showIcon?: boolean;
  showLabel?: boolean;
  textSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  hasUnit?: boolean;
}

export const AttributeInputTypeLabel = ({
  inputType,
  iconSize = "small",
  showIcon = true,
  showLabel = true,
  textSize = 3,
  hasUnit = false,
}: AttributeInputTypeLabelProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {showIcon && (
        <AttributeInputTypeIcon inputType={inputType} size={iconSize} hasUnit={hasUnit} />
      )}
      {showLabel && (
        <Text size={textSize} color="default2">
          {getAttributeInputTypeLabel(intl, inputType)}
        </Text>
      )}
    </Box>
  );
};
