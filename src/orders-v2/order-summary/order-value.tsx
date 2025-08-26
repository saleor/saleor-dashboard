import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

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
        <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2}>
          <Text fontWeight="medium" size={4}>
            {intl.formatMessage({
              defaultMessage: "Subtotal",
              id: "L8seEc",
            })}
          </Text>
          <Text fontFamily="Geist Mono" fontWeight="medium">
            {intl.formatNumber(orderSubtotal.gross.amount, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </Box>
        <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2}>
          <Text fontWeight="medium" size={4}>
            {intl.formatMessage(
              {
                defaultMessage: "Shipping {carrierName}",
                id: "mpkBZc",
              },
              {
                carrierName: (
                  <Text color="default2" size={4} fontWeight="medium">
                    ({shippingMethodName})
                  </Text>
                ),
              },
            )}
          </Text>

          <Text fontFamily="Geist Mono" fontWeight="medium">
            {intl.formatNumber(shippingPrice.gross.amount, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </Box>
        <Box as="li" display="grid" __gridTemplateColumns="1fr auto" gap={2}>
          <Text fontWeight="medium" size={4}>
            {intl.formatMessage({
              defaultMessage: "Taxes ",
              id: "HTiAMm",
            })}
            <Text size={4} fontWeight="medium" color="default2">
              {intl.formatMessage(
                {
                  defaultMessage: "{taxAmount, plural, =0 {(not applicable)} other {} }",
                  id: "2ZC9wL",
                },
                { taxAmount: orderTotal.tax.amount },
              )}
            </Text>
          </Text>
          <Text fontFamily="Geist Mono" fontWeight="medium">
            {intl.formatNumber(orderTotal.tax.amount, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </Box>
        {discounts.map(discount => (
          <Box
            key={`order-value-discount-${discount.id}`}
            as="li"
            display="grid"
            __gridTemplateColumns="1fr auto"
            gap={2}
          >
            <Text fontWeight="medium" size={4}>
              Discount (Voucher: Tests)
            </Text>
            <Text style={{ fontFamily: "Geist Mono" }} fontWeight="medium">
              5.00
            </Text>
          </Box>
        ))}

        {/* TODO: add giftcards support */}

        <Box display="grid" placeItems="end">
          <Box>
            <Text style={{ fontFamily: "Geist Mono" }} fontWeight="medium" color="default2">
              USD
            </Text>
            <Text
              style={{ fontFamily: "Geist Mono" }}
              fontWeight="bold"
              borderStyle="solid"
              borderColor="default2"
              borderBottomWidth={0}
              borderLeftWidth={0}
              borderRightWidth={0}
            >
              125.10
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
