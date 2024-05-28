import { DashboardModal } from "@dashboard/components/Modal";
import { RadioTiles } from "@dashboard/components/RadioTiles/RadioTiles";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderRefundDialogMesages } from "./messages";
import { useOrderRefundDialog } from "./useOrderRefundDialog";

interface OrderRefundDialogProps {
  order: OrderDetailsFragment;
  open: boolean;
  onClose: () => void;
  onStandardRefund: () => void;
  onManualRefund: () => void;
}

export const OrderRefundDialog = ({
  order,
  open,
  onClose,
  onStandardRefund,
  onManualRefund,
}: OrderRefundDialogProps) => {
  const intl = useIntl();
  const {
    selectedRefundType,
    handleChangeRefundType,
    canCreateManualRefund,
    canCreateStandardRefund,
  } = useOrderRefundDialog(order);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content __width="400px">
        <DashboardModal.Title>
          {intl.formatMessage(orderRefundDialogMesages.title)}
        </DashboardModal.Title>
        <Text>{intl.formatMessage(orderRefundDialogMesages.subtitle)}</Text>
        <RadioTiles asChild value={selectedRefundType} onValueChange={handleChangeRefundType}>
          <Box
            as="fieldset"
            borderWidth={0}
            margin={0}
            padding={0}
            gap={4}
            display="flex"
            flexDirection="column"
          >
            <Tooltip open={canCreateStandardRefund ? false : undefined}>
              <Tooltip.Trigger>
                <Box>
                  <RadioTiles.RadioTile
                    value={"standard"}
                    data-test-id="standard-refund"
                    checked={selectedRefundType === "standard"}
                    title={intl.formatMessage(orderRefundDialogMesages.standardRefundTitle)}
                    description={intl.formatMessage(
                      orderRefundDialogMesages.standardRefundSubtitle,
                    )}
                    disabled={!canCreateStandardRefund}
                  />
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <FormattedMessage {...orderRefundDialogMesages.cannotCreateStandard} />
              </Tooltip.Content>
            </Tooltip>
            <Tooltip open={canCreateManualRefund ? false : undefined}>
              <Tooltip.Trigger>
                <Box>
                  <RadioTiles.RadioTile
                    value={"manual"}
                    data-test-id="manual-refund"
                    checked={selectedRefundType === "manual"}
                    title={intl.formatMessage(orderRefundDialogMesages.manualRefundTitle)}
                    description={intl.formatMessage(orderRefundDialogMesages.manualRefundSubtitle)}
                    disabled={!canCreateManualRefund}
                  />
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <FormattedMessage {...orderRefundDialogMesages.cannotCreateManual} />
              </Tooltip.Content>
            </Tooltip>
          </Box>
        </RadioTiles>
        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            <Text fontWeight="medium">{intl.formatMessage(buttonMessages.cancel)}</Text>
          </Button>
          <Button
            onClick={selectedRefundType === "standard" ? onStandardRefund : onManualRefund}
            disabled={!canCreateManualRefund && !canCreateStandardRefund}
          >
            <Text fontWeight="medium" color="buttonDefaultPrimary">
              {intl.formatMessage(buttonMessages.confirm)}
            </Text>
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
