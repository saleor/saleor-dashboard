import CardSpacer from "@dashboard/components/CardSpacer";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import TrashIcon from "@dashboard/icons/Trash";
import { OrderSharedType } from "@dashboard/orders/types";
import { mergeRepeatedOrderLines } from "@dashboard/orders/utils/data";
import { Card, TableBody } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import React from "react";

import { renderCollection } from "../../../misc";
import OrderCardTitle from "../OrderCardTitle";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import ActionButtons from "./ActionButtons";
import ExtraInfoLines from "./ExtraInfoLines";
import useStyles from "./styles";

interface OrderFulfilledProductsCardProps {
  fulfillment: OrderDetailsFragment["fulfillments"][0];
  fulfillmentAllowUnpaid: boolean;
  order?: OrderSharedType;
  onOrderFulfillmentApprove: () => void;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
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
  } = props;
  const classes = useStyles(props);

  if (!fulfillment) {
    return null;
  }

  const getLines = () => {
    if (statusesToMergeLines.includes(fulfillment?.status)) {
      return mergeRepeatedOrderLines(fulfillment.lines);
    }

    return fulfillment?.lines || [];
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
        <ResponsiveTable className={classes.table}>
          <TableHeader />
          <TableBody>
            {renderCollection(getLines(), line => (
              <TableLine key={line.id} line={line} />
            ))}
          </TableBody>
          <ExtraInfoLines fulfillment={fulfillment} />
        </ResponsiveTable>
        <ActionButtons
          orderId={order?.id}
          status={fulfillment?.status}
          trackingNumber={fulfillment?.trackingNumber}
          orderIsPaid={order?.isPaid}
          fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
          onTrackingCodeAdd={onTrackingCodeAdd}
          onApprove={onOrderFulfillmentApprove}
        />
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderFulfilledProductsCard;
