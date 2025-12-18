import { OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { transactionActionMessages } from "../OrderTransaction/messages";

type Props = {
  order: OrderDetailsFragment;
  canCapture: boolean;
  canRefund: boolean;
  canVoid: boolean;
  canMarkAsPaid: boolean;
  onMarkAsPaid?: () => void;
  onLegacyPaymentsApiCapture?: () => any;
  onLegacyPaymentsApiRefund?: () => any;
  onLegacyPaymentsApiVoid?: () => any;
};

export const LegacyPaymentsApiButtons = ({
  order,
  canCapture,
  canRefund,
  canVoid,
  canMarkAsPaid,
  onMarkAsPaid,
  onLegacyPaymentsApiCapture,
  onLegacyPaymentsApiRefund,
  onLegacyPaymentsApiVoid,
}: Props) => {
  const intl = useIntl();

  const showButtons =
    order?.status !== OrderStatus.CANCELED &&
    (canCapture || canRefund || canVoid || (canMarkAsPaid && onMarkAsPaid));

  if (!showButtons) {
    return null;
  }

  return (
    <Box display="flex" gap={2}>
      {canCapture && (
        <Button variant="secondary" onClick={onLegacyPaymentsApiCapture}>
          {intl.formatMessage(transactionActionMessages.capture)}
        </Button>
      )}
      {canRefund && (
        <Button
          variant="secondary"
          onClick={onLegacyPaymentsApiRefund}
          data-test-id="refund-button"
        >
          {intl.formatMessage(transactionActionMessages.refund)}
        </Button>
      )}
      {canVoid && (
        <Button variant="secondary" onClick={onLegacyPaymentsApiVoid}>
          {intl.formatMessage(transactionActionMessages.void)}
        </Button>
      )}
      {canMarkAsPaid && onMarkAsPaid && (
        <Button variant="secondary" onClick={onMarkAsPaid} data-test-id="mark-as-paid-button">
          {intl.formatMessage(transactionActionMessages.markAsPaid)}
        </Button>
      )}
    </Box>
  );
};
