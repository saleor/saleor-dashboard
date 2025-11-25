import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderAuthorizeStatusBadge } from "./OrderAuthorizeStatusBadge";
import { OrderChargeStatusBadge } from "./OrderChargeStatusBadge";
import { OrderSummaryListItem } from "./OrderSummaryListItem";
import { PaymentsSummaryHeader } from "./PaymentsSummaryHeader";

type Props = PropsWithBox<{
  orderAmounts: {
    totalAuthorized: OrderDetailsFragment["totalAuthorized"];
    totalCaptured: OrderDetailsFragment["totalCaptured"];
    totalBalance: OrderDetailsFragment["totalBalance"];
  };
  order: OrderDetailsFragment;
  hasNoPayment: boolean;
}>;

export const PaymentsSummary = ({ orderAmounts, order, hasNoPayment, ...props }: Props) => {
  const intl = useIntl();

  if (hasNoPayment) {
    return (
      <Box
        backgroundColor="default2"
        padding={5}
        borderRadius={4}
        borderStyle="solid"
        borderColor="default1"
        borderWidth={1}
        {...props}
      >
        <PaymentsSummaryHeader
          order={order}
          description={intl.formatMessage({
            defaultMessage: "This order has no payment yet",
            id: "Fcxl/G",
          })}
        />
      </Box>
    );
  }

  return (
    <Box
      backgroundColor="default2"
      padding={5}
      borderRadius={4}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      {...props}
    >
      <PaymentsSummaryHeader
        order={order}
        description={intl.formatMessage({
          defaultMessage: "All payments from registered transactions.",
          id: "9TENcY",
        })}
      />

      <Box marginTop={2} display="flex" gap={3}>
        <OrderChargeStatusBadge status={order.chargeStatus} />
        <OrderAuthorizeStatusBadge status={order.authorizeStatus} />
      </Box>

      <Box as="ul" display="grid" gap={1} marginTop={4}>
        <OrderSummaryListItem amount={orderAmounts.totalCaptured.amount}>
          {intl.formatMessage({
            defaultMessage: "Total captured",
            id: "JIQ7KX",
          })}
        </OrderSummaryListItem>
        <OrderSummaryListItem amount={orderAmounts.totalAuthorized.amount}>
          {intl.formatMessage({
            defaultMessage: "Outstanding authorized",
            id: "AiurXc",
          })}
        </OrderSummaryListItem>
        <OrderSummaryListItem
          amount={orderAmounts.totalBalance.amount}
          showSign
          showCurrency
          currency={orderAmounts.totalBalance.currency}
        >
          {intl.formatMessage({
            defaultMessage: "Outstanding balance",
            id: "o5GUx9",
          })}
        </OrderSummaryListItem>
      </Box>
    </Box>
  );
};
