import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderSummaryListAmount } from "./order-summary-list-amount";
import { OrderSummaryListItem } from "./order-summary-list-item";

type Props = PropsWithBox<{
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  orderTotal: OrderDetailsFragment["total"];
  discounts: OrderDetailsFragment["discounts"];
  orderId: string;
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
}>;

export const OrderValue = ({
  orderSubtotal,
  shippingMethodName,
  shippingPrice,
  orderTotal,
  discounts,
  orderId,
  giftCardsAmount,
  usedGiftCards,
  ...props
}: Props) => {
  const intl = useIntl();

  return (
    <Box backgroundColor="default2" padding={5} borderRadius={4} {...props}>
      <Box display="flex" flexDirection="column">
        <Text fontWeight="medium" fontSize={6}>
          {intl.formatMessage({
            defaultMessage: "Order value",
            id: "fL08MU",
          })}
        </Text>
        <Text color="default2" size={3}>
          {intl.formatMessage({
            defaultMessage: "All line as ordered by the client.",
            id: "AoCDZi",
          })}
        </Text>
      </Box>

      <Box as="ul" display="grid" gap={1}>
        <OrderSummaryListItem amount={orderSubtotal.gross.amount}>
          {intl.formatMessage({
            defaultMessage: "Subtotal",
            id: "L8seEc",
          })}
        </OrderSummaryListItem>
        <OrderSummaryListItem amount={shippingPrice.gross.amount}>
          {intl.formatMessage(
            {
              defaultMessage: "Shipping {carrierName}",
              id: "mpkBZc",
            },
            {
              carrierName: (
                <Text color="default2" fontWeight="medium">
                  ({shippingMethodName})
                </Text>
              ),
            },
          )}
        </OrderSummaryListItem>
        <OrderSummaryListItem amount={orderTotal.tax.amount}>
          {intl.formatMessage({
            defaultMessage: "Taxes ",
            id: "HTiAMm",
          })}
          <Text fontWeight="medium" color="default2">
            {intl.formatMessage(
              {
                defaultMessage: "{taxAmount, plural, =0 {(not applicable)} other {} }",
                id: "2ZC9wL",
              },
              { taxAmount: orderTotal.tax.amount },
            )}
          </Text>
        </OrderSummaryListItem>

        {discounts.map(discount => (
          <OrderSummaryListItem
            key={`order-value-discount-${discount.id}`}
            amount={discount.amount.amount}
          >
            {intl.formatMessage(
              {
                defaultMessage: "Discount {discountName}",
                id: "vs0xiH",
              },
              {
                discountName: (
                  <Text fontWeight="medium" color="default2">
                    ({discount.name})
                  </Text>
                ),
              },
            )}
          </OrderSummaryListItem>
        ))}

        {giftCardsAmount && giftCardsAmount > 0 && usedGiftCards && (
          <OrderSummaryListItem amount={-giftCardsAmount}>
            {intl.formatMessage(
              {
                defaultMessage:
                  "{usedGiftCards, plural, one {Gift card} other {Gift cards} } {giftCardCodesList}",
                id: "5kODlC",
              },
              {
                usedGiftCards: usedGiftCards.length,
                giftCardCodesList: (
                  <Text fontWeight="medium" color="default2">
                    ({usedGiftCards.map(card => card.last4CodeChars).join(", ")})
                  </Text>
                ),
              },
            )}
          </OrderSummaryListItem>
        )}

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
                  <Text fontFamily="Geist Mono" fontWeight="medium" color="default2">
                    {orderTotal.gross.currency}
                  </Text>
                ),
                totalAmount: (
                  <OrderSummaryListAmount amount={orderTotal.gross.amount} fontWeight="bold" />
                ),
              },
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
