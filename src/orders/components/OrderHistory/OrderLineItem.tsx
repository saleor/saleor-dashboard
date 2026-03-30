import { type OrderEventFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";

type EventLine = NonNullable<OrderEventFragment["lines"]>[number];

interface OrderLineItemProps {
  orderLine: EventLine["orderLine"];
  quantity: number;
  // Used when orderLine or orderLine.productName is missing.
  fallbackItemName: string;
}

export const OrderLineItem = ({ orderLine, quantity, fallbackItemName }: OrderLineItemProps) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
    <Box display="flex" flexDirection="column">
      <Text size={3} fontWeight="medium">
        {orderLine?.productName || fallbackItemName}
      </Text>
      {orderLine?.variantName && (
        <Text size={2} color="default2">
          {orderLine.variantName}
        </Text>
      )}
    </Box>
    <Text size={3} color="default2" whiteSpace="nowrap" flexShrink="0">
      ×{quantity}
    </Text>
  </Box>
);
