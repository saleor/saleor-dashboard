import messages from "@saleor/containers/BackgroundTasks/messages";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { InvoiceEmailSend } from "../../types/InvoiceEmailSend";
import { InvoiceRequest } from "../../types/InvoiceRequest";
import { OrderAddNote } from "../../types/OrderAddNote";
import { OrderCancel } from "../../types/OrderCancel";
import { OrderCapture } from "../../types/OrderCapture";
import { OrderDraftCancel } from "../../types/OrderDraftCancel";
import { OrderDraftFinalize } from "../../types/OrderDraftFinalize";
import { OrderDraftUpdate } from "../../types/OrderDraftUpdate";
import { OrderFulfillmentCancel } from "../../types/OrderFulfillmentCancel";
import { OrderFulfillmentUpdateTracking } from "../../types/OrderFulfillmentUpdateTracking";
import { OrderLineDelete } from "../../types/OrderLineDelete";
import { OrderLinesAdd } from "../../types/OrderLinesAdd";
import { OrderLineUpdate } from "../../types/OrderLineUpdate";
import { OrderMarkAsPaid } from "../../types/OrderMarkAsPaid";
import { OrderShippingMethodUpdate } from "../../types/OrderShippingMethodUpdate";
import { OrderUpdate } from "../../types/OrderUpdate";
import { OrderVoid } from "../../types/OrderVoid";
import { orderUrl, OrderUrlQueryParams } from "../../urls";

interface OrderDetailsMessages {
  children: (props: {
    handleDraftCancel: (data: OrderDraftCancel) => void;
    handleDraftFinalize: (data: OrderDraftFinalize) => void;
    handleDraftUpdate: (data: OrderDraftUpdate) => void;
    handleNoteAdd: (data: OrderAddNote) => void;
    handleOrderCancel: (data: OrderCancel) => void;
    handleOrderFulfillmentCancel: (data: OrderFulfillmentCancel) => void;
    handleOrderFulfillmentUpdate: (
      data: OrderFulfillmentUpdateTracking
    ) => void;
    handleOrderLinesAdd: (data: OrderLinesAdd) => void;
    handleOrderLineDelete: (data: OrderLineDelete) => void;
    handleOrderLineUpdate: (data: OrderLineUpdate) => void;
    handleOrderMarkAsPaid: (data: OrderMarkAsPaid) => void;
    handleOrderVoid: (data: OrderVoid) => void;
    handlePaymentCapture: (data: OrderCapture) => void;
    handleShippingMethodUpdate: (data: OrderShippingMethodUpdate) => void;
    handleUpdate: (data: OrderUpdate) => void;
    handleInvoiceGeneratePending: (data: InvoiceRequest) => void;
    handleInvoiceGenerateFinished: (data: InvoiceRequest) => void;
    handleInvoiceSend: (data: InvoiceEmailSend) => void;
  }) => React.ReactElement;
  id: string;
  params: OrderUrlQueryParams;
}

export const OrderDetailsMessages: React.FC<OrderDetailsMessages> = ({
  children,
  id,
  params
}) => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const intl = useIntl();

  const [, closeModal] = createDialogActionHandlers(
    navigate,
    params => orderUrl(id, params),
    params
  );

  const handlePaymentCapture = (data: OrderCapture) => {
    const errs = data.orderCapture?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Payment successfully captured"
        })
      });
      closeModal();
    }
  };
  const handleOrderMarkAsPaid = (data: OrderMarkAsPaid) => {
    const errs = data.orderMarkAsPaid?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order marked as paid"
        })
      });
      closeModal();
    }
  };
  const handleOrderCancel = (data: OrderCancel) => {
    const errs = data.orderCancel?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order successfully cancelled"
        })
      });
      closeModal();
    }
  };
  const handleDraftCancel = (data: OrderDraftCancel) => {
    const errs = data.draftOrderDelete?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order successfully cancelled"
        })
      });
      closeModal();
    }
  };
  const handleOrderVoid = (data: OrderVoid) => {
    const errs = data.orderVoid?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order payment successfully voided"
        })
      });
      closeModal();
    }
  };
  const handleNoteAdd = (data: OrderAddNote) => {
    const errs = data.orderAddNote?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Note successfully added"
        })
      });
    }
  };
  const handleUpdate = (data: OrderUpdate) => {
    const errs = data.orderUpdate?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order successfully updated"
        })
      });
      closeModal();
    }
  };
  const handleDraftUpdate = (data: OrderDraftUpdate) => {
    const errs = data.draftOrderUpdate?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order successfully updated"
        })
      });
    }
    closeModal();
  };
  const handleShippingMethodUpdate = (data: OrderShippingMethodUpdate) => {
    const errs = data.orderUpdateShipping?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Shipping method successfully updated"
        })
      });
      closeModal();
    }
  };
  const handleOrderLineDelete = (data: OrderLineDelete) => {
    const errs = data.draftOrderLineDelete?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order line deleted"
        })
      });
    }
  };
  const handleOrderLinesAdd = (data: OrderLinesAdd) => {
    const errs = data.draftOrderLinesCreate?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order line added"
        })
      });
      closeModal();
    }
  };
  const handleOrderLineUpdate = (data: OrderLineUpdate) => {
    const errs = data.draftOrderLineUpdate?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Order line updated"
        })
      });
    }
  };
  const handleOrderFulfillmentCancel = (data: OrderFulfillmentCancel) => {
    const errs = data.orderFulfillmentCancel?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Fulfillment successfully cancelled"
        })
      });
      closeModal();
    }
  };
  const handleOrderFulfillmentUpdate = (
    data: OrderFulfillmentUpdateTracking
  ) => {
    const errs = data.orderFulfillmentUpdateTracking?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Fulfillment successfully updated"
        })
      });
      closeModal();
    }
  };
  const handleDraftFinalize = (data: OrderDraftFinalize) => {
    const errs = data.draftOrderComplete?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Draft order successfully finalized"
        })
      });
    }
  };
  const handleInvoiceGeneratePending = (data: InvoiceRequest) => {
    const errs = data.invoiceRequest?.errors;
    if (errs.length === 0) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage:
            "We’re generating the invoice you requested. Please wait a couple of moments"
        }),
        title: intl.formatMessage({
          defaultMessage: "Invoice is Generating"
        })
      });
      closeModal();
    }
  };
  const handleInvoiceGenerateFinished = (data: InvoiceRequest) => {
    const errs = data.invoiceRequest?.errors;
    if (errs.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage(messages.invoiceGenerateFinishedText),
        title: intl.formatMessage(messages.invoiceGenerateFinishedTitle)
      });
      closeModal();
    }
  };
  const handleInvoiceSend = (data: InvoiceEmailSend) => {
    const errs = data.invoiceSendEmail?.errors;
    if (errs.length === 0) {
      pushMessage({
        text: intl.formatMessage({
          defaultMessage: "Invoice email sent"
        })
      });
      closeModal();
    }
  };

  return children({
    handleDraftCancel,
    handleDraftFinalize,
    handleDraftUpdate,
    handleInvoiceGenerateFinished,
    handleInvoiceGeneratePending,
    handleInvoiceSend,
    handleNoteAdd,
    handleOrderCancel,
    handleOrderFulfillmentCancel,
    handleOrderFulfillmentUpdate,
    handleOrderLineDelete,
    handleOrderLineUpdate,
    handleOrderLinesAdd,
    handleOrderMarkAsPaid,
    handleOrderVoid,
    handlePaymentCapture,
    handleShippingMethodUpdate,
    handleUpdate
  });
};
