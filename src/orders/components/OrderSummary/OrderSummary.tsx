import { OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { OrderValue } from "./OrderValue";
import { PaymentsSummary } from "./PaymentsSummary";

type Props = PropsWithBox<{
  order: OrderDetailsFragment;
  onMarkAsPaid: () => any;
}>;

export const OrderSummary = ({ order, ...props }: Props) => {
  const intl = useIntl();
  const giftCardsAmount = extractOrderGiftCardUsedAmount(order);
  const usedGiftCards = OrderDetailsViewModel.getUsedGiftCards(order?.giftCards);

  return (
    <Box padding={6} display="grid" gap={6} {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Order summary",
            id: "SB//YQ",
          })}
        </Text>

        <Button variant="secondary">
          <CheckIcon size={16} />
          {intl.formatMessage({
            defaultMessage: "Mark as Paid",
            id: "RsLoDB",
          })}
        </Button>
      </Box>

      <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={3}>
        <OrderValue
          orderSubtotal={order?.subtotal}
          shippingMethodName={order?.shippingMethodName}
          shippingPrice={order.shippingPrice}
          orderTotal={order.total}
          discounts={order.discounts}
          orderId={order.id}
          giftCardsAmount={giftCardsAmount}
          usedGiftCards={usedGiftCards}
        />
        <PaymentsSummary
          orderAmounts={{
            totalAuthorized: order.totalAuthorized,
            totalCaptured: order.totalCaptured,
            totalRefunded: order.totalRefunded,
            totalBalance: order.totalBalance,
            total: order.total,
            totalAuthorizePending: order.totalAuthorizePending,
            totalCharged: order.totalCharged,
            totalChargePending: order.totalChargePending,
            totalCanceled: order.totalCanceled,
            totalCancelPending: order.totalCancelPending,
          }}
          paymentStatus={order.paymentStatus}
          order={order}
        />
      </Box>
    </Box>
  );
};
