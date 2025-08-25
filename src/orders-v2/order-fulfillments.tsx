import { FulfillmentFragment } from "@dashboard/graphql";
import { OrderDetailsDatagrid } from "@dashboard/orders/components/OrderDetailsDatagrid";
import { Box, Text } from "@saleor/macaw-ui-next";
import { PackageIcon } from "lucide-react";
import React from "react";

export const OrderFulfillments = ({ fulfillments }: { fulfillments: FulfillmentFragment[] }) => {
  return (
    <Box>
      {fulfillments.map(fulfillment => (
        <Box key={`fulfillment-${fulfillment.id}`}>
          <Box padding={6} display="grid" backgroundColor="default2">
            <Text>From {fulfillment.warehouse.name} 2025-08-25 | Tracking: </Text>
            <Text>
              {fulfillment.status} <PackageIcon />
            </Text>
          </Box>

          <OrderDetailsDatagrid
            lines={fulfillment.lines.map(line => line.orderLine)}
            loading={false}
            onShowMetadata={undefined}
            enableVerticalBorder={false}
          />
        </Box>
      ))}
    </Box>
  );
};
