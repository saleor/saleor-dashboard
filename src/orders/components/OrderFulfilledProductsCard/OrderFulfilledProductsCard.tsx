import CardSpacer from "@dashboard/components/CardSpacer";
import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import TrashIcon from "@dashboard/icons/Trash";
import { mergeRepeatedOrderLines } from "@dashboard/orders/utils/data";
import { Card, CardContent } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import React from "react";

import OrderCardTitle from "../OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid";
import ActionButtons from "./ActionButtons";
import ExtraInfoLines from "./ExtraInfoLines";
import useStyles from "./styles";

interface OrderFulfilledProductsCardProps {
  fulfillment: OrderDetailsFragment["fulfillments"][0];
  fulfillmentAllowUnpaid: boolean;
  order?: OrderDetailsFragment;
  onOrderFulfillmentApprove: () => void;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
  onRefund: () => void;
}

const statusesToMergeLines = [
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.REPLACED,
];
const cancelableStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
];

const OrderFulfilledProductsCard: React.FC<
  OrderFulfilledProductsCardProps
> = props => {
  const {
    fulfillment,
    fulfillmentAllowUnpaid,
    order,
    onOrderFulfillmentApprove,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd,
    onRefund,
  } = props;
  const classes = useStyles(props);

  if (!fulfillment) {
    return null;
  }

  const getLines = () => {
    if (statusesToMergeLines.includes(fulfillment?.status)) {
      return mergeRepeatedOrderLines(fulfillment.lines).map(
        order => order.orderLine,
      );
    }

    return fulfillment?.lines.map(order => order.orderLine) || [];
  };

  return (
    <>
      <Card>
        <OrderCardTitle
          withStatus
          lines={fulfillment?.lines}
          fulfillmentOrder={fulfillment?.fulfillmentOrder}
          status={fulfillment?.status}
          warehouseName={fulfillment?.warehouse?.name}
          orderNumber={order?.number}
          toolbar={
            cancelableStatuses.includes(fulfillment?.status) && (
              <IconButton
                variant="secondary"
                className={classes.deleteIcon}
                onClick={onOrderFulfillmentCancel}
                data-test-id="cancel-fulfillment-button"
              >
                <TrashIcon />
              </IconButton>
            )
          }
        />
        <CardContent>
          <OrderDetailsDatagrid lines={getLines()} loading={false} />
          <ExtraInfoLines fulfillment={fulfillment} />
          <ActionButtons
            status={fulfillment?.status}
            trackingNumber={fulfillment?.trackingNumber}
            orderIsPaid={order?.isPaid}
            fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
            onTrackingCodeAdd={onTrackingCodeAdd}
            onRefund={onRefund}
            onApprove={onOrderFulfillmentApprove}
          />
        </CardContent>
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderFulfilledProductsCard;
