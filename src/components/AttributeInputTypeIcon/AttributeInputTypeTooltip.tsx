import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeTooltipProps {
  inputType: AttributeInputTypeEnum;
  size?: AttributeInputTypeIconSize;
}

export const AttributeInputTypeTooltip = ({
  inputType,
  size = "small",
}: AttributeInputTypeTooltipProps) => {
  const intl = useIntl();

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box display="flex" alignItems="center">
          <AttributeInputTypeIcon inputType={inputType} size={size} />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        {getAttributeInputTypeLabel(intl, inputType)}
      </Tooltip.Content>
    </Tooltip>
  );
};
