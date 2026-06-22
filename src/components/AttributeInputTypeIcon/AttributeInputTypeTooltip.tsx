import { getMeasurementUnitMessage } from "@dashboard/attributes/components/AttributeDetails/utils";
import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { type AttributeInputTypeEnum, type MeasurementUnitsEnum } from "@dashboard/graphql";
import { Box, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeTooltipProps {
  inputType: AttributeInputTypeEnum;
  size?: AttributeInputTypeIconSize;
  unit?: MeasurementUnitsEnum | null;
}

export const AttributeInputTypeTooltip = ({
  inputType,
  size = "small",
  unit = null,
}: AttributeInputTypeTooltipProps) => {
  const intl = useIntl();
  const hasUnit = unit != null;

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box display="flex" alignItems="center">
          <AttributeInputTypeIcon inputType={inputType} size={size} hasUnit={hasUnit} />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        {getAttributeInputTypeLabel(intl, inputType)}
        {hasUnit && <> · {getMeasurementUnitMessage(unit, intl.formatMessage)}</>}
      </Tooltip.Content>
    </Tooltip>
  );
};
