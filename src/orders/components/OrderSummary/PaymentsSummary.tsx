import { OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderSummaryListAmount } from "./OrderSummaryListAmount";
import { OrderSummaryListItem } from "./OrderSummaryListItem";
import { PaymentsSummaryHeader } from "./PaymentsSummaryHeader";

type Props = PropsWithBox<{
  orderAmounts: {
    totalAuthorized: OrderDetailsFragment["totalAuthorized"];
    totalCaptured: OrderDetailsFragment["totalCaptured"];
    totalRefunded: OrderDetailsFragment["totalRefunded"];
    totalBalance: OrderDetailsFragment["totalBalance"];
    total: OrderDetailsFragment["total"];
    totalAuthorizePending: OrderDetailsFragment["totalAuthorizePending"];
    totalCharged: OrderDetailsFragment["totalCharged"];
    totalChargePending: OrderDetailsFragment["totalChargePending"];
    totalCanceled: OrderDetailsFragment["totalCanceled"];
    totalCancelPending: OrderDetailsFragment["totalCancelPending"];
  };
  order: OrderDetailsFragment;
  hasNoPayment: boolean;
}>;

export const PaymentsSummary = ({ orderAmounts, order, hasNoPayment, ...props }: Props) => {
  const intl = useIntl();

  const shouldDisplay = OrderDetailsViewModel.getShouldDisplayAmounts(orderAmounts);

  if (hasNoPayment) {
    return (
      <Box
        backgroundColor="default2"
        padding={5}
        borderRadius={4}
        borderStyle="solid"
        borderColor="default1"
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

  const totalAmountFractional =
    orderAmounts.totalCaptured.fractionalAmount - orderAmounts.totalRefunded.fractionalAmount;

  return (
    <Box
      backgroundColor="default2"
      padding={5}
      borderRadius={4}
      borderStyle="solid"
      borderColor="default1"
      {...props}
    >
      <PaymentsSummaryHeader
        order={order}
        description={intl.formatMessage({
          defaultMessage: "All payments from registered transactions.",
          id: "9TENcY",
        })}
      />

      <Box as="ul" display="grid" gap={1} marginTop={4}>
        <OrderSummaryListItem amount={orderAmounts.totalAuthorized.amount}>
          {intl.formatMessage({
            defaultMessage: "Authorized",
            id: "NAepnj",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.authorizedPending && (
          <OrderSummaryListItem amount={orderAmounts.totalAuthorizePending.amount}>
            {intl.formatMessage({
              defaultMessage: "Authorized pending",
              id: "tXOS3M",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={orderAmounts.totalCaptured.amount} showSign>
          {intl.formatMessage({
            defaultMessage: "Captured",
            id: "nMwGMj",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.chargedPending && (
          <OrderSummaryListItem amount={orderAmounts.totalChargePending.amount}>
            {intl.formatMessage({
              defaultMessage: "Charged pending",
              id: "Aw2OKG",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={orderAmounts.totalCanceled.amount}>
          {intl.formatMessage({
            defaultMessage: "Cancelled",
            id: "3wsVWF",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.cancelledPending && (
          <OrderSummaryListItem amount={orderAmounts.totalCancelPending.amount}>
            {intl.formatMessage({
              defaultMessage: "Cancelled pending",
              id: "o0AP7/",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={-orderAmounts.totalRefunded.amount} showSign>
          {intl.formatMessage({
            defaultMessage: "Refunded",
            id: "Gs86nL",
          })}
        </OrderSummaryListItem>
      </Box>

      <Box display="grid" placeItems="end">
        <Box
          borderStyle="solid"
          borderColor="default2"
          borderBottomWidth={0}
          borderLeftWidth={0}
          borderRightWidth={0}
        >
          {intl.formatMessage(
            {
              defaultMessage: "{currency} {totalAmount}",
              id: "V21v8h",
            },
            {
              currency: (
                <Text fontWeight="medium" color="default2" size={3}>
                  {orderAmounts.total.gross.currency}
                </Text>
              ),
              totalAmount: (
                <OrderSummaryListAmount amount={totalAmountFractional} fontWeight="bold" />
              ),
            },
          )}
        </Box>
      </Box>
    </Box>
  );
};
