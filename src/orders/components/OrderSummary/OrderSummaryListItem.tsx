import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { OrderSummaryListAmount } from "./OrderSummaryListAmount";

type Props = PropsWithBox<{
  children: ReactNode;
  amount: number;
  showSign?: boolean;
  showCurrency?: boolean;
  currency?: string;
  title?: string;
  amountTitle?: string;
}>;

export const OrderSummaryListItem = ({
  children,
  amount,
  showSign,
  currency,
  title,
  amountTitle,
  ...props
}: Props): ReactNode => {
  return (
    <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2} title={title} {...props}>
      <Text fontWeight="medium" size={4}>
        {children}
      </Text>
      <Box title={amountTitle}>
        <Text fontWeight="medium" color="default2" size={3}>
          {currency}
        </Text>{" "}
        <OrderSummaryListAmount amount={amount} showSign={showSign} size={4} />
      </Box>
    </Box>
  );
};
