import { DashboardModal } from "@dashboard/components/Modal";
import { RadioTiles } from "@dashboard/components/RadioTiles/RadioTiles";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { orderRefundDialogMesages } from "./messages";
import { useOrderRefundDialog } from "./useOrderRefundDialog";

interface OrderRefundDialogProps {
  open: boolean;
  onClose: () => void;
  onStandardRefund: () => void;
  onManualRefund: () => void;
}

export const OrderRefundDialog = ({
  open,
  onClose,
  onStandardRefund,
  onManualRefund,
}: OrderRefundDialogProps) => {
  const intl = useIntl();
  const { selectedRefundType, handleChangeRefundType, canCreateManualRefund } =
    useOrderRefundDialog();

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs" data-test-id="order-refund-dialog">
        <DashboardModal.Header>
          {intl.formatMessage(orderRefundDialogMesages.title)}
        </DashboardModal.Header>
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
            <Box>
              <RadioTiles.RadioTile
                value={"standard"}
                data-test-id="standard-refund"
                checked={selectedRefundType === "standard"}
                title={intl.formatMessage(orderRefundDialogMesages.standardRefundTitle)}
                description={intl.formatMessage(orderRefundDialogMesages.standardRefundSubtitle)}
              />
            </Box>
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
          <Button onClick={onClose} variant="secondary" data-test-id="back-button">
            <Text fontWeight="medium">{intl.formatMessage(buttonMessages.back)}</Text>
          </Button>
          <Button
            onClick={selectedRefundType === "standard" ? onStandardRefund : onManualRefund}
            data-test-id="proceed-button"
          >
            <Text fontWeight="medium" color="buttonDefaultPrimary">
              {intl.formatMessage(buttonMessages.proceed)}
            </Text>
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
