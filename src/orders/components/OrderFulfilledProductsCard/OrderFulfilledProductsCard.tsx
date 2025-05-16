// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import { orderHasTransactions } from "@dashboard/orders/types";
import { mergeRepeatedOrderLines } from "@dashboard/orders/utils/data";
import { Box, Button, Divider, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";

import OrderCardTitle from "../OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid";
import ActionButtons from "./ActionButtons";
import ExtraInfoLines from "./ExtraInfoLines";

interface OrderFulfilledProductsCardProps {
  fulfillment: OrderDetailsFragment["fulfillments"][0];
  fulfillmentAllowUnpaid: boolean;
  order?: OrderDetailsFragment;
  onOrderFulfillmentApprove: () => void;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
  dataTestId?: string;
  onShowMetadata: (id: string) => void;
}

const statusesToMergeLines = [
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.REPLACED,
];
const cancelableStatuses = [FulfillmentStatus.FULFILLED, FulfillmentStatus.WAITING_FOR_APPROVAL];
const fulfillmentLineToLine = ({
  quantity,
  orderLine,
}: OrderDetailsFragment["fulfillments"][0]["lines"][0]) => ({
  ...orderLine,
  // 'quantity' has the correct number of returned items
  // 'orderLine.quantity' has the total number of items in the order
  quantity,
});
const OrderFulfilledProductsCard: React.FC<OrderFulfilledProductsCardProps> = props => {
  const {
    fulfillment,
    fulfillmentAllowUnpaid,
    order,
    onOrderFulfillmentApprove,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd,
    onShowMetadata,
    dataTestId,
  } = props;

  if (!fulfillment) {
    return null;
  }

  const getLines = () => {
    if (statusesToMergeLines.includes(fulfillment?.status)) {
      return mergeRepeatedOrderLines(fulfillment.lines).map(fulfillmentLineToLine);
    }

    return fulfillment?.lines.map(fulfillmentLineToLine) || [];
  };

  return (
    <Box data-test-id={dataTestId}>
      <OrderCardTitle
        withStatus
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
        warehouseName={fulfillment?.warehouse?.name}
        orderNumber={order?.number}
        toolbar={
          <Box display="flex" alignItems="center" gap={6}>
            {cancelableStatuses.includes(fulfillment?.status) && (
              <Button
                variant="secondary"
                onClick={onOrderFulfillmentCancel}
                data-test-id="cancel-fulfillment-button"
                icon={<TrashBinIcon />}
              />
            )}
            <ActionButtons
              orderId={order?.id}
              status={fulfillment?.status}
              trackingNumber={fulfillment?.trackingNumber}
              orderIsPaid={order?.isPaid}
              fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
              onTrackingCodeAdd={onTrackingCodeAdd}
              onApprove={onOrderFulfillmentApprove}
              hasTransactions={orderHasTransactions(order)}
            />
          </Box>
        }
      />
      <DashboardCard.Content paddingX={0}>
        <OrderDetailsDatagrid lines={getLines()} loading={false} onShowMetadata={onShowMetadata} />
        <ExtraInfoLines fulfillment={fulfillment} />
      </DashboardCard.Content>
      {props.children}
      <Divider />
    </Box>
  );
};

export default OrderFulfilledProductsCard;
