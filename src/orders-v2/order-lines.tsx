import { OrderLineFragment } from "@dashboard/graphql";
import { OrderDetailsDatagrid } from "@dashboard/orders/components/OrderDetailsDatagrid";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

type Props = PropsWithBox<{
  lines: OrderLineFragment[];
}>;

export const OrderLines = ({ lines }: Props) => {
  const intl = useIntl();

  return (
    <>
      <Box padding={6} display="grid">
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Text size={5} fontWeight="medium">
            {intl.formatMessage({ id: "Pvi8WI", defaultMessage: "Order lines" })}
          </Text>
          <Button onClick={() => alert("Fulfill order lines")}>
            <Package size={14} />
            {intl.formatMessage({ id: "QDxJib", defaultMessage: "Fulfill" })}
          </Button>
        </Box>
      </Box>
      <OrderDetailsDatagrid
        lines={lines}
        loading={false}
        onShowMetadata={undefined}
        enableVerticalBorder={false}
      />
    </>
  );
};
