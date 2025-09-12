import { OrderLineFragment, OrderStatus } from "@dashboard/graphql";
import { OrderDetailsDatagrid } from "@dashboard/orders/components/OrderDetailsDatagrid";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import { useIntl } from "react-intl";

import { OrderDetailsViewModel } from "./order-details-view-model";

type Props = PropsWithBox<{
  lines: OrderLineFragment[];
  status: OrderStatus;
}>;

export const OrderLines = ({ lines, status, ...props }: Props) => {
  const intl = useIntl();

  return (
    <>
      <Box padding={6} display="grid" {...props}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Text size={6} fontWeight="medium">
            {intl.formatMessage({ id: "Pvi8WI", defaultMessage: "Order lines" })}
          </Text>
          {OrderDetailsViewModel.shouldShowFulfillButton(status) && (
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
