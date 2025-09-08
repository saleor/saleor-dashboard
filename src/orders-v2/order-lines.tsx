import { OrderLineFragment } from "@dashboard/graphql";
import { OrderDetailsDatagrid } from "@dashboard/orders/components/OrderDetailsDatagrid";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

import { OrderModel } from "./order-model";

type Props = PropsWithBox<{
  lines: OrderLineFragment[];
  orderModel: OrderModel;
}>;

export const OrderLines = ({ lines, orderModel, ...props }: Props) => {
  const intl = useIntl();

  return (
    <>
      <Box padding={6} display="grid" {...props}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Text size={6} fontWeight="medium">
            {intl.formatMessage({ id: "Pvi8WI", defaultMessage: "Order lines" })}
          </Text>
          {orderModel.shouldShowFulfillButton() && (
            <Button
              onClick={() => {
                // TODO: implement fulfill order lines functionality
                alert("Fulfill order lines");
              }}
            >
              <Package size={14} />
              {intl.formatMessage({ id: "QDxJib", defaultMessage: "Fulfill" })}
            </Button>
          )}
        </Box>
      </Box>
      <OrderDetailsDatagrid
        lines={lines}
        loading={false}
        onShowMetadata={() => {
          // TODO: implement show metadata functionality
          alert("Metadata show");
        }}
        enableVerticalBorder={false}
      />
    </>
  );
};
