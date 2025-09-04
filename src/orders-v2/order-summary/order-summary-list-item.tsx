import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { OrderSumaryListAmount } from "./order-summary-list-amount";

type Props = PropsWithBox<{
  children: ReactNode;
  amount: number;
}>;

export const OrderSummaryListItem = ({ children, amount, ...props }: Props) => {
  return (
    <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2} {...props}>
      <Text fontWeight="medium" size={4}>
        {children}
      </Text>
      <OrderSumaryListAmount amount={amount} />
    </Box>
  );
};
