import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeOptionLabelProps {
  inputType: AttributeInputTypeEnum;
  iconSize?: AttributeInputTypeIconSize;
  textSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}

export const AttributeInputTypeOptionLabel = ({
  inputType,
  iconSize = "xsmall",
  textSize = 3,
}: AttributeInputTypeOptionLabelProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" gap={2} flexShrink="0">
      <AttributeInputTypeIcon inputType={inputType} size={iconSize} />
      <Text size={textSize} whiteSpace="nowrap">
        {getAttributeInputTypeLabel(intl, inputType)}
      </Text>
    </Box>
  );
};
