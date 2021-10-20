import { Button } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

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

  const canCapture = !!order?.actions?.includes(OrderAction.CAPTURE);
  const canVoid = !!order?.actions?.includes(OrderAction.VOID);
  const canRefund = !!order?.actions?.includes(OrderAction.REFUND);
  const canMarkAsPaid = !!order?.actions?.includes(OrderAction.MARK_AS_PAID);

  const intl = useIntl();

  return (
    <>
      {canRefund && (
        <Button
          color="primary"
          variant="text"
          onClick={onRefund}
          data-test-id="refund-button"
        >
          {intl.formatMessage(messages.refund)}
        </Button>
      )}
      {canVoid && (
        <Button color="primary" variant="text" onClick={onVoid}>
          {intl.formatMessage(messages.void)}
        </Button>
      )}
      {canCapture && (
        <Button color="primary" variant="text" onClick={onCapture}>
          {intl.formatMessage(messages.capture)}
        </Button>
      )}
      {canMarkAsPaid && (
        <Button color="primary" variant="text" onClick={onMarkAsPaid}>
          {intl.formatMessage(messages.markAsPaid)}
        </Button>
      )}
    </>
  );
};

OrderPaymentToolbar.displayName = "OrderPaymentToolbar";
export default OrderPaymentToolbar;
