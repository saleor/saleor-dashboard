import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Tooltip } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { useIntl } from "react-intl";

import { constraintReasonMessages } from "./constraintReasonMessages";

interface ConstraintReasonHintProps {
  fields: string[];
  testId?: string;
}

export const ConstraintReasonHint = ({
  fields,
  testId,
}: ConstraintReasonHintProps): JSX.Element | null => {
  const intl = useIntl();

  if (fields.length === 0) {
    return null;
  }

  const list = new Intl.ListFormat(intl.locale, { type: "conjunction" }).format(fields);
  const label = intl.formatMessage(constraintReasonMessages.neededFor, { fields: list });

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          cursor="pointer"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          color="default2"
          flexShrink="0"
          aria-label={label}
          data-test-id={testId}
        >
          <Info size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} aria-hidden />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="start">
        <Tooltip.Arrow />
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
};
