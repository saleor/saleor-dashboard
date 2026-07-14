import { Box, Toggle } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { OrderLineMatrixNeedsActionHelpTooltip } from "./OrderLineMatrixNeedsActionHelpTooltip";

interface OrderLineMatrixNeedsActionSwitchProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

export const OrderLineMatrixNeedsActionSwitch = ({
  pressed,
  onPressedChange,
}: OrderLineMatrixNeedsActionSwitchProps): JSX.Element => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" gap={2} flexShrink="0">
      <OrderLineMatrixNeedsActionHelpTooltip />
      <Toggle
        pressed={pressed}
        onPressedChange={onPressedChange}
        data-test-id="matrix-needs-action-toggle"
        aria-label={intl.formatMessage(messages.needsActionFilterAriaLabel)}
      />
    </Box>
  );
};
