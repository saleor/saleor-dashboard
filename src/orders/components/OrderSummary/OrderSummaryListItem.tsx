import { Box, type PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { OrderSummaryListAmount } from "./OrderSummaryListAmount";

type Props = PropsWithBox<{
  children: ReactNode;
  amount: number;
  showSign?: boolean;
  showCurrency?: boolean;
  currency?: string;
  title?: string;
  amountTitle?: string;
  bold?: boolean;
}>;

export const OrderSummaryListItem = ({
  children,
  amount,
  showSign,
  currency,
  title,
  amountTitle,
  bold = false,
  ...props
}: Props): ReactNode => {
  const fontWeight = bold ? "bold" : "regular";

  return (
    <Box
      as="li"
      display="grid"
      __gridTemplateColumns="1fr auto"
      alignItems="baseline"
      gap={2}
      __minWidth={0}
      title={title}
      {...props}
    >
      <Box fontSize={4} fontWeight={fontWeight} __minWidth={0}>
        {children}
      </Box>
      <Box title={amountTitle}>
        <Text fontWeight={fontWeight} color="default2" size={3}>
          {currency}
        </Text>{" "}
        <OrderSummaryListAmount
          amount={amount}
          showSign={showSign}
          size={4}
          fontWeight={fontWeight}
          data-test-id={"amount"}
        />
      </Box>
    </Box>
  );
};
