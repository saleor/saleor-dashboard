import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import React from "react";

import { OrderValue } from "./order-value";
import { PaymentsSummary } from "./payments-summary";

export const OrderSummary = ({
  orderSubtotal,
  shippingMethodName,
  shippingPrice,
  orderTotal,
  discounts,
}: {
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: string;
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  orderTotal: OrderDetailsFragment["total"];
  discounts: OrderDetailsFragment["discounts"];
}) => {
  return (
    <Box padding={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          Order summary
        </Text>

        <Button variant="secondary">
          <CheckIcon size={16} />
          Mark as Paid
        </Button>
      </Box>

      <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={3}>
        <OrderValue
          orderSubtotal={orderSubtotal}
          shippingMethodName={shippingMethodName}
          shippingPrice={shippingPrice}
          orderTotal={orderTotal}
          discounts={discounts}
        />
        <PaymentsSummary />
      </Box>
    </Box>
  );
};
