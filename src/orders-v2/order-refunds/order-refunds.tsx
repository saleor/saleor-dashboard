import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderFulfillmentRefundedStatusIcon } from "../icons/order-fulfillment-refunded-status-icon";
import { OrderRefundsViewModel } from "./order-refunds-view-model";
import { RefundListItem } from "./refund-list-item";

type Props = PropsWithBox<{
  onNewRefund?: () => void;
  onEditRefund?: (refundId: string) => void;
  order: OrderDetailsFragment;
}>;

export const OrderRefunds = ({ onNewRefund, onEditRefund, order }: Props) => {
  const intl = useIntl();

  const orderRefunds = OrderRefundsViewModel.prepareOrderRefundDisplayList(
    order.transactions.flatMap(t => t.events),
    order.grantedRefunds ?? [],
  );

  return (
    <Box padding={6} gap={4} display="grid">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Refunds",
            id: "pXQSzm",
          })}
        </Text>
        <Button
          variant="secondary"
          icon={<OrderFulfillmentRefundedStatusIcon />}
          onClick={onNewRefund}
        >
          {intl.formatMessage({
            defaultMessage: "New Refund",
            id: "DPsabz",
          })}
        </Button>
      </Box>

      <Box as="ul" display="grid" gap={3}>
        {orderRefunds.length === 0 && (
          <Box as="li" display="flex" justifyContent="center" padding={6}>
            <Text size={3} color="default2">
              {intl.formatMessage({
                defaultMessage: "No refunds made for this order.",
                id: "qs0dIo",
              })}
            </Text>
          </Box>
        )}
        {orderRefunds.map(refund => (
          <RefundListItem key={refund.id} refund={refund} onEditRefund={onEditRefund} />
        ))}
      </Box>
    </Box>
  );
};
