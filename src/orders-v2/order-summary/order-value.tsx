import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Text, TextProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { useIntl } from "react-intl";

type Props = Omit<TextProps, "children"> & { amount: number };

const OrderValueAmount = ({ amount, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Text fontFamily="Geist Mono" fontWeight="medium" {...props}>
      {intl.formatNumber(amount, {
        minimumFractionDigits: 2,
      })}
    </Text>
  );
};

const OrderValueListItem = ({ children, amount }: { children: ReactNode; amount: number }) => {
  return (
    <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2}>
      <Text fontWeight="medium" size={4}>
        {children}
      </Text>
      <OrderValueAmount amount={amount} />
    </Box>
  );
};

const OrderValueTotal = ({ orderTotal }: { orderTotal: OrderDetailsFragment["total"] }) => {
  const intl = useIntl();

  return (
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
            totalAmount: <OrderValueAmount amount={orderTotal.gross.amount} fontWeight="bold" />,
          },
        )}
      </Box>
    </Box>
  );
};

export const OrderValue = ({
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
  const intl = useIntl();

  return (
    <Box backgroundColor="default2" padding={5} borderRadius={4}>
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
        <OrderValueListItem amount={orderSubtotal.gross.amount}>
          {intl.formatMessage({
            defaultMessage: "Subtotal",
            id: "L8seEc",
          })}
        </OrderValueListItem>
        <OrderValueListItem amount={shippingPrice.gross.amount}>
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
        </OrderValueListItem>
        <OrderValueListItem amount={orderTotal.tax.amount}>
          <>
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
          </>
        </OrderValueListItem>

        {discounts.map(discount => (
          <OrderValueListItem
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
          </OrderValueListItem>
        ))}

        {/* TODO: add giftcards support */}

        <OrderValueTotal orderTotal={orderTotal} />
      </Box>
    </Box>
  );
};
