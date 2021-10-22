import { Button } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderAction } from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import { orderPaymentToolbarMessages as messages } from "./messages";

interface OrderPaymentToolbarProps {
  order: OrderDetails_order;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const OrderPaymentToolbar: React.FC<OrderPaymentToolbarProps> = props => {
  const { order, onCapture, onMarkAsPaid, onRefund, onVoid } = props;

  const canPerformOrderAction = (actionType: OrderAction) =>
    !!order?.actions?.includes(actionType);

  return (
    <>
      {canPerformOrderAction(OrderAction.REFUND) && (
        <Button
          color="primary"
          variant="text"
          onClick={onRefund}
          data-test-id="refund-button"
        >
          <FormattedMessage {...messages.refund} />
        </Button>
      )}
      {canPerformOrderAction(OrderAction.VOID) && (
        <Button color="primary" variant="text" onClick={onVoid}>
          <FormattedMessage {...messages.void} />
        </Button>
      )}
      {canPerformOrderAction(OrderAction.CAPTURE) && (
        <Button color="primary" variant="text" onClick={onCapture}>
          <FormattedMessage {...messages.capture} />
        </Button>
      )}
      {canPerformOrderAction(OrderAction.MARK_AS_PAID) && (
        <Button color="primary" variant="text" onClick={onMarkAsPaid}>
          <FormattedMessage {...messages.markAsPaid} />
        </Button>
      )}
    </>
  );
};

OrderPaymentToolbar.displayName = "OrderPaymentToolbar";
export default OrderPaymentToolbar;
