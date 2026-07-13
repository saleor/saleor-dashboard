import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { OrderLineDiscountLineDetails } from "@dashboard/orders/components/OrderDiscountModal/OrderLineDiscountLineDetails";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../messages";
import { type LinePriceWaterfall, type PriceWarning } from "../utils/types";
import { PriceWaterfallList } from "./PriceWaterfallList";

interface LinePriceWaterfallModalProps {
  waterfall: LinePriceWaterfall;
  onClose: () => void;
}

export const LinePriceWaterfallModal = ({ waterfall, onClose }: LinePriceWaterfallModalProps) => {
  const intl = useIntl();

  return (
    <DashboardModal open onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.ContextHeader
          description={
            <OrderLineDiscountLineDetails
              productName={waterfall.productName}
              variantName={waterfall.variantName}
              productSku={waterfall.productSku}
              quantity={waterfall.quantity}
              thumbnailUrl={waterfall.thumbnailUrl}
            />
          }
          wrapDescription={false}
        >
          <FormattedMessage {...messages.modalTitle} />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={4}>
              <PriceWaterfallList waterfall={waterfall} />

              {waterfall.warnings.length > 0 && (
                <Box display="flex" flexDirection="column" gap={2}>
                  {waterfall.warnings.map((warning, index) => (
                    <WarningCallout key={`${warning.id}-${index}`} warning={warning} />
                  ))}
                </Box>
              )}
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            {intl.formatMessage(buttonMessages.close)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

interface WarningCalloutProps {
  warning: PriceWarning;
}

const WarningCallout = ({ warning }: WarningCalloutProps) => {
  const intl = useIntl();
  const message = (() => {
    switch (warning.id) {
      case "manual_overrides_automatic":
        return intl.formatMessage(messages.warningManualOverridesAutomatic);
      default:
        return null;
    }
  })();

  if (!message) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={3}
      padding={3}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      borderRadius={3}
    >
      <Box color="warning1" __lineHeight="0" __marginTop="2px" flexShrink="0">
        <AlertTriangle size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Text size={2} color="default2">
        {message}
      </Text>
    </Box>
  );
};
