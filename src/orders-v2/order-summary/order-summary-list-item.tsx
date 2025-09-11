import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { OrderSummaryListAmount } from "./order-summary-list-amount";

type Props = PropsWithBox<{
  children: ReactNode;
  amount: number;
  showSign?: boolean;
}>;

export const OrderSummaryListItem = ({ children, amount, showSign, ...props }: Props) => {
  return (
    <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2} {...props}>
      <Text fontWeight="medium" size={4}>
        {children}
      </Text>
      <OrderSummaryListAmount amount={amount} showSign={showSign} />
    </Box>
  );
};
