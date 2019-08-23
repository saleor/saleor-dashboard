import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "../../../misc";
import { OrderAddNote } from "../../types/OrderAddNote";
import { OrderCancel } from "../../types/OrderCancel";
import { OrderCapture } from "../../types/OrderCapture";
import { OrderCreateFulfillment } from "../../types/OrderCreateFulfillment";
import { OrderDraftCancel } from "../../types/OrderDraftCancel";
import { OrderDraftFinalize } from "../../types/OrderDraftFinalize";
import { OrderDraftUpdate } from "../../types/OrderDraftUpdate";
import { OrderFulfillmentCancel } from "../../types/OrderFulfillmentCancel";
import { OrderFulfillmentUpdateTracking } from "../../types/OrderFulfillmentUpdateTracking";
import { OrderLineDelete } from "../../types/OrderLineDelete";
import { OrderLinesAdd } from "../../types/OrderLinesAdd";
import { OrderLineUpdate } from "../../types/OrderLineUpdate";
import { OrderMarkAsPaid } from "../../types/OrderMarkAsPaid";
import { OrderRefund } from "../../types/OrderRefund";
import { OrderShippingMethodUpdate } from "../../types/OrderShippingMethodUpdate";
import { OrderUpdate } from "../../types/OrderUpdate";
import { OrderVoid } from "../../types/OrderVoid";
import { orderListUrl, orderUrl } from "../../urls";

interface OrderDetailsMessages {
  children: (props: {
    handleDraftCancel: (data: OrderDraftCancel) => void;
    handleDraftFinalize: (data: OrderDraftFinalize) => void;
    handleDraftUpdate: (data: OrderDraftUpdate) => void;
    handleNoteAdd: (data: OrderAddNote) => void;
    handleOrderCancel: (data: OrderCancel) => void;
    handleOrderFulfillmentCancel: (data: OrderFulfillmentCancel) => void;
    handleOrderFulfillmentCreate: (data: OrderCreateFulfillment) => void;
    handleOrderFulfillmentUpdate: (
      data: OrderFulfillmentUpdateTracking
    ) => void;
    handleOrderLinesAdd: (data: OrderLinesAdd) => void;
    handleOrderLineDelete: (data: OrderLineDelete) => void;
    handleOrderLineUpdate: (data: OrderLineUpdate) => void;
    handleOrderMarkAsPaid: (data: OrderMarkAsPaid) => void;
    handleOrderVoid: (data: OrderVoid) => void;
    handlePaymentCapture: (data: OrderCapture) => void;
    handlePaymentRefund: (data: OrderRefund) => void;
    handleShippingMethodUpdate: (data: OrderShippingMethodUpdate) => void;
    handleUpdate: (data: OrderUpdate) => void;
  }) => React.ReactElement;
}

export const OrderDetailsMessages: React.StatelessComponent<
  OrderDetailsMessages
> = ({ children }) => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const intl = useIntl();

  const handlePaymentCapture = (data: OrderCapture) => {
    if (!maybe(() => data.orderCapture.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Payment successfully captured"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage(
          {
            defaultMessage: "Payment not captured: {errorMessage}"
          },
          {
            errorMessage: data.orderCapture.errors.find(
              error => error.field === "payment"
            ).message
          }
        )
      });
    }
  };
  const handlePaymentRefund = (data: OrderRefund) => {
    if (!maybe(() => data.orderRefund.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Payment successfully refunded"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage(
          {
            defaultMessage: "Payment not refunded: {errorMessage}",
            description: "notification"
          },
          {
            errorMessage: data.orderRefund.errors.find(
              error => error.field === "payment"
            ).message
          }
        )
      });
    }
  };
  const handleOrderFulfillmentCreate = (data: OrderCreateFulfillment) => {
    if (!maybe(() => data.orderFulfillmentCreate.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Items successfully fulfilled"
        })
      });
      navigate(orderUrl(data.orderFulfillmentCreate.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not fulfill items"
        })
      });
    }
  };
  const handleOrderMarkAsPaid = (data: OrderMarkAsPaid) => {
    if (!maybe(() => data.orderMarkAsPaid.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order marked as paid"
        })
      });
      navigate(orderUrl(data.orderMarkAsPaid.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not mark order as paid"
        })
      });
    }
  };
  const handleOrderCancel = (data: OrderCancel) => {
    pushMessage({
      text: intl.formatMessage({
        defaultMessage: "Order successfully cancelled"
      })
    });
    navigate(orderUrl(data.orderCancel.order.id), true);
  };
  const handleDraftCancel = () => {
    pushMessage({
      text: intl.formatMessage({
        defaultMessage: "Order successfully cancelled"
      })
    });
    navigate(orderListUrl(), true);
  };
  const handleOrderVoid = () => {
    pushMessage({
      text: intl.formatMessage({
        defaultMessage: "Order payment successfully voided"
      })
    });
  };
  const handleNoteAdd = (data: OrderAddNote) => {
    if (!maybe(() => data.orderAddNote.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Note successfully added"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not add note"
        })
      });
    }
  };
  const handleUpdate = (data: OrderUpdate) => {
    if (!maybe(() => data.orderUpdate.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order successfully updated"
        })
      });
      navigate(orderUrl(data.orderUpdate.order.id), true);
    }
  };
  const handleDraftUpdate = (data: OrderDraftUpdate) => {
    if (!maybe(() => data.draftOrderUpdate.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order successfully updated"
        })
      });
      navigate(orderUrl(data.draftOrderUpdate.order.id), true);
    }
  };
  const handleShippingMethodUpdate = (data: OrderShippingMethodUpdate) => {
    if (!maybe(() => data.orderUpdateShipping.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Shipping method successfully updated"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not update shipping method"
        })
      });
    }
    navigate(orderUrl(data.orderUpdateShipping.order.id), true);
  };
  const handleOrderLineDelete = (data: OrderLineDelete) => {
    if (!maybe(() => data.draftOrderLineDelete.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order line deleted"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not delete order line"
        })
      });
    }
  };
  const handleOrderLinesAdd = (data: OrderLinesAdd) => {
    if (!maybe(() => data.draftOrderLinesCreate.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order line added"
        })
      });
      navigate(orderUrl(data.draftOrderLinesCreate.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not create order line"
        })
      });
    }
  };
  const handleOrderLineUpdate = (data: OrderLineUpdate) => {
    if (!maybe(() => data.draftOrderLineUpdate.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Order line updated"
        })
      });
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not update order line"
        })
      });
    }
  };
  const handleOrderFulfillmentCancel = (data: OrderFulfillmentCancel) => {
    if (!maybe(() => data.orderFulfillmentCancel.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Fulfillment successfully cancelled"
        })
      });
      navigate(orderUrl(data.orderFulfillmentCancel.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not cancel fulfillment"
        })
      });
    }
  };
  const handleOrderFulfillmentUpdate = (
    data: OrderFulfillmentUpdateTracking
  ) => {
    if (!maybe(() => data.orderFulfillmentUpdateTracking.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Fulfillment successfully updated"
        })
      });
      navigate(orderUrl(data.orderFulfillmentUpdateTracking.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not update fulfillment"
        })
      });
    }
  };
  const handleDraftFinalize = (data: OrderDraftFinalize) => {
    if (!maybe(() => data.draftOrderComplete.errors.length)) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Draft order successfully finalized"
        })
      });
      navigate(orderUrl(data.draftOrderComplete.order.id), true);
    } else {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Could not finalize draft"
        })
      });
    }
  };

  return children({
    handleDraftCancel,
    handleDraftFinalize,
    handleDraftUpdate,
    handleNoteAdd,
    handleOrderCancel,
    handleOrderFulfillmentCancel,
    handleOrderFulfillmentCreate,
    handleOrderFulfillmentUpdate,
    handleOrderLineDelete,
    handleOrderLineUpdate,
    handleOrderLinesAdd,
    handleOrderMarkAsPaid,
    handleOrderVoid,
    handlePaymentCapture,
    handlePaymentRefund,
    handleShippingMethodUpdate,
    handleUpdate
  });
};
