import { Card, TableBody } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { OrderDetailsFragment } from "@saleor/fragments/types/OrderDetailsFragment";
import TrashIcon from "@saleor/icons/Trash";
import { IconButton } from "@saleor/macaw-ui";
import { mergeRepeatedOrderLines } from "@saleor/orders/utils/data";
import React from "react";

import { renderCollection } from "../../../misc";
import { FulfillmentStatus } from "../../../types/globalTypes";
import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";
import ActionButtons from "./ActionButtons";
import ExtraInfoLines from "./ExtraInfoLines";
import useStyles from "./styles";

interface OrderFulfilledProductsCardProps {
  fulfillment: OrderDetails_order_fulfillments;
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
  FulfillmentStatus.REPLACED
];
const cancelableStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.WAITING_FOR_APPROVAL
];

const OrderFulfilledProductsCard: React.FC<OrderFulfilledProductsCardProps> = props => {
  const {
    fulfillment,
    fulfillmentAllowUnpaid,
    order,
    onOrderFulfillmentApprove,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd,
    onRefund
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
        <CardTitle
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
                data-test-id="cancelFulfillmentButton"
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
              <TableLine line={line} />
            ))}
          </TableBody>
          <ExtraInfoLines fulfillment={fulfillment} />
        </ResponsiveTable>
        <ActionButtons
          status={fulfillment?.status}
          trackingNumber={fulfillment?.trackingNumber}
          orderIsPaid={order?.isPaid}
          fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
          onTrackingCodeAdd={onTrackingCodeAdd}
          onRefund={onRefund}
          onApprove={onOrderFulfillmentApprove}
        />
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderFulfilledProductsCard;
