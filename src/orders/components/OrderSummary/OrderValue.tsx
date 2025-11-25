import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderSummaryListAmount } from "./OrderSummaryListAmount";
import { OrderSummaryListItem } from "./OrderSummaryListItem";
import { OrderValueHeader } from "./OrderValueHeader";

type Props = PropsWithBox<{
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  orderTotal: OrderDetailsFragment["total"];
  discounts: OrderDetailsFragment["discounts"];
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
  displayGrossPrices: OrderDetailsFragment["displayGrossPrices"];
}>;

export const OrderValue = ({
  orderSubtotal,
  shippingMethodName,
  shippingPrice,
  orderTotal,
  discounts,
  giftCardsAmount,
  usedGiftCards,
  displayGrossPrices,
  ...props
}: Props) => {
  const intl = useIntl();

  return (
    <Box
      backgroundColor="default2"
      padding={5}
      borderRadius={4}
      borderStyle="solid"
      borderColor="transparent"
      borderWidth={1}
      {...props}
    >
      <OrderValueHeader
        description={intl.formatMessage({
          defaultMessage: "All lines as ordered by the client.",
          id: "73SSOz",
        })}
      />

      <Box as="ul" display="grid" gap={1} marginTop={4}>
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
                <Text color="default2" fontWeight="medium" size={3}>
                  ({shippingMethodName})
                </Text>
              ),
            },
          )}
        </OrderSummaryListItem>
        {!displayGrossPrices && (
          <OrderSummaryListItem amount={orderTotal.tax.amount}>
            {intl.formatMessage({
              defaultMessage: "Taxes ",
              id: "HTiAMm",
            })}
          </OrderSummaryListItem>
        )}

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
                  <Text fontWeight="medium" color="default2" size={3}>
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
                  <Text fontWeight="medium" color="default2" size={3}>
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
            borderColor="default1"
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
        {displayGrossPrices && (
          <OrderSummaryListItem amount={orderTotal.tax.amount}>
            {intl.formatMessage({
              defaultMessage: "Taxes ",
              id: "HTiAMm",
            })}
            <Text color="default2" fontWeight="medium" size={3}>
              (included)
            </Text>
          </OrderSummaryListItem>
        )}
      </Box>
    </Box>
  );
};
