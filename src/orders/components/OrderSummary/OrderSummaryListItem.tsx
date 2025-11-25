import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { OrderSummaryListAmount } from "./OrderSummaryListAmount";

type Props = PropsWithBox<{
  children: ReactNode;
  amount: number;
  showSign?: boolean;
  showCurrency?: boolean;
  currency?: string;
}>;

export const OrderSummaryListItem = ({ children, amount, showSign, currency, ...props }: Props) => {
  return (
    <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2} {...props}>
      <Text fontWeight="medium" size={3}>
        {children}
      </Text>
      <Box>
        <Text fontWeight="medium" color="default2" size={3}>
          {currency}
        </Text>{" "}
        <OrderSummaryListAmount amount={amount} showSign={showSign} />
      </Box>
    </Box>
  );
};
