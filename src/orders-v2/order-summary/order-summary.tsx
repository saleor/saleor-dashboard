import { OrderAction, OrderDetailsFragment, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { OrderTotalAmounts } from "@dashboard/orders/components/OrderPaymentSummaryCard/components/PaymentsSummary/utils";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

import { OrderDetailsViewModel } from "../order-details-view-model";
import { OrderValue } from "./order-value";
import { PaymentsSummary } from "./payments-summary";

type Props = PropsWithBox<{
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  discounts: OrderDetailsFragment["discounts"];
  paymentStatus: PaymentChargeStatusEnum;
  orderTotalAmounts: OrderTotalAmounts;
  orderActions: OrderAction[];
  orderId: string;
  giftCards: OrderDetailsFragment["giftCards"];
}>;

export const OrderSummary = ({
  orderSubtotal,
  shippingMethodName,
  shippingPrice,
  discounts,
  paymentStatus,
  orderTotalAmounts,
  orderActions,
  orderId,
  giftCards,
}: Props) => {
  const canMarkAsPaid = OrderDetailsViewModel.canOrderBeMarkedAsPaid(orderActions);
  const intl = useIntl();

  return (
    <Box padding={6} display="grid" gap={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Order summary",
            id: "SB//YQ",
          })}
        </Text>

        {canMarkAsPaid && (
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
          giftCards={giftCards}
        />
        <PaymentsSummary orderAmounts={orderTotalAmounts} paymentStatus={paymentStatus} />
      </Box>
    </Box>
  );
};
