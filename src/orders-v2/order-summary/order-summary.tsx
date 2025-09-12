import { OrderDetailsFragment, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { OrderTotalAmounts } from "../order-details-view-model";
import { OrderValue } from "./order-value";
import { PaymentsSummary } from "./payments-summary";

type Props = PropsWithBox<{
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  discounts: OrderDetailsFragment["discounts"];
  paymentStatus: PaymentChargeStatusEnum;
  orderTotalAmounts: OrderTotalAmounts;
  orderId: string;
  canBeMarkedAsPaid: boolean;
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
}>;

export const OrderSummary = ({
  orderSubtotal,
  shippingMethodName,
  shippingPrice,
  discounts,
  paymentStatus,
  orderTotalAmounts,
  orderId,
  canBeMarkedAsPaid,
  giftCardsAmount,
  usedGiftCards,
  ...props
}: Props) => {
  const intl = useIntl();

  return (
    <Box padding={6} display="grid" gap={6} {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Order summary",
            id: "SB//YQ",
          })}
        </Text>

        {canBeMarkedAsPaid && (
          <Button variant="secondary">
            <CheckIcon size={16} />
            {intl.formatMessage({
              defaultMessage: "Mark as Paid",
              id: "RsLoDB",
            })}
          </Button>
        )}
      </Box>

      <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={3}>
        <OrderValue
          orderSubtotal={orderSubtotal}
          shippingMethodName={shippingMethodName}
          shippingPrice={shippingPrice}
          orderTotal={orderTotalAmounts.total}
          discounts={discounts}
          orderId={orderId}
          giftCardsAmount={giftCardsAmount}
          usedGiftCards={usedGiftCards}
        />
        <PaymentsSummary orderAmounts={orderTotalAmounts} paymentStatus={paymentStatus} />
      </Box>
    </Box>
  );
};
