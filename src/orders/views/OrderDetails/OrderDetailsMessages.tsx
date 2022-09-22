import { handleNestedMutationErrors } from "@saleor/auth";
import messages from "@saleor/containers/BackgroundTasks/messages";
import {
  InvoiceEmailSendMutation,
  InvoiceRequestMutation,
  OrderAddNoteMutation,
  OrderCancelMutation,
  OrderCaptureMutation,
  OrderDraftCancelMutation,
  OrderDraftFinalizeMutation,
  OrderDraftUpdateMutation,
  OrderErrorCode,
  OrderFulfillmentApproveMutation,
  OrderFulfillmentCancelMutation,
  OrderFulfillmentUpdateTrackingMutation,
  OrderLineDeleteMutation,
  OrderLinesAddMutation,
  OrderLineUpdateMutation,
  OrderMarkAsPaidMutation,
  OrderShippingMethodUpdateMutation,
  OrderUpdateMutation,
  OrderVoidMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { orderUrl, OrderUrlQueryParams } from "../../urls";

interface OrderDetailsMessages {
  children: (props: {
    handleDraftCancel: (data: OrderDraftCancelMutation) => void;
    handleDraftFinalize: (data: OrderDraftFinalizeMutation) => void;
    handleDraftUpdate: (data: OrderDraftUpdateMutation) => void;
    handleNoteAdd: (data: OrderAddNoteMutation) => void;
    handleOrderCancel: (data: OrderCancelMutation) => void;
    handleOrderFulfillmentApprove: (
      data: OrderFulfillmentApproveMutation,
    ) => void;
    handleOrderFulfillmentCancel: (
      data: OrderFulfillmentCancelMutation,
    ) => void;
    handleOrderFulfillmentUpdate: (
      data: OrderFulfillmentUpdateTrackingMutation,
    ) => void;
    handleOrderLinesAdd: (data: OrderLinesAddMutation) => void;
    handleOrderLineDelete: (data: OrderLineDeleteMutation) => void;
    handleOrderLineUpdate: (data: OrderLineUpdateMutation) => void;
    handleOrderMarkAsPaid: (data: OrderMarkAsPaidMutation) => void;
    handleOrderVoid: (data: OrderVoidMutation) => void;
    handlePaymentCapture: (data: OrderCaptureMutation) => void;
    handleShippingMethodUpdate: (
      data: OrderShippingMethodUpdateMutation,
    ) => void;
    handleUpdate: (data: OrderUpdateMutation) => void;
    handleInvoiceGeneratePending: (data: InvoiceRequestMutation) => void;
    handleInvoiceGenerateFinished: (data: InvoiceRequestMutation) => void;
    handleInvoiceSend: (data: InvoiceEmailSendMutation) => void;
  }) => React.ReactElement;
  id: string;
  params: OrderUrlQueryParams;
}

export const OrderDetailsMessages: React.FC<OrderDetailsMessages> = ({
  children,
  id,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [, closeModal] = createDialogActionHandlers(
    navigate,
    params => orderUrl(id, params),
    params,
  );

  const handlePaymentCapture = (data: OrderCaptureMutation) => {
    const errs = data.orderCapture?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "9RCuN3",
          defaultMessage: "Payment successfully captured",
        }),
      });
      closeModal();
    }
  };
  const handleOrderMarkAsPaid = (data: OrderMarkAsPaidMutation) => {
    const errs = data.orderMarkAsPaid?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "lL1HTg",
          defaultMessage: "Order marked as paid",
        }),
      });
      closeModal();
    }
  };
  const handleOrderCancel = (data: OrderCancelMutation) => {
    const errs = data.orderCancel?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "W/Es0H",
          defaultMessage: "Order successfully cancelled",
        }),
      });
      closeModal();
    }
  };
  const handleDraftCancel = (data: OrderDraftCancelMutation) => {
    const errs = data.draftOrderDelete?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "W/Es0H",
          defaultMessage: "Order successfully cancelled",
        }),
      });
      closeModal();
    }
  };
  const handleOrderVoid = (data: OrderVoidMutation) => {
    const errs = data.orderVoid?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "L87bp7",
          defaultMessage: "Order payment successfully voided",
        }),
      });
      closeModal();
    }
  };
  const handleNoteAdd = (data: OrderAddNoteMutation) => {
    const errs = data.orderAddNote?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "KmPicj",
          defaultMessage: "Note successfully added",
        }),
      });
    }
  };
  const handleUpdate = (data: OrderUpdateMutation) => {
    const errs = data.orderUpdate?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "j2fPVo",
          defaultMessage: "Order successfully updated",
        }),
      });
      closeModal();
    }
  };
  const handleDraftUpdate = (data: OrderDraftUpdateMutation) => {
    const errs = data.draftOrderUpdate?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "j2fPVo",
          defaultMessage: "Order successfully updated",
        }),
      });
      closeModal();
    }
  };
  const handleShippingMethodUpdate = (
    data: OrderShippingMethodUpdateMutation,
  ) => {
    const errs = data.orderUpdateShipping?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "7U8GRy",
          defaultMessage: "Shipping method successfully updated",
        }),
      });
      closeModal();
    }
  };
  const handleOrderLineDelete = (data: OrderLineDeleteMutation) => {
    const errs = data.orderLineDelete?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "9OtpHt",
          defaultMessage: "Order line deleted",
        }),
      });
    }
  };
  const handleOrderLinesAdd = (data: OrderLinesAddMutation) => {
    const errs = data.orderLinesCreate?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "HlCkMT",
          defaultMessage: "Order line added",
        }),
      });
      closeModal();
    }
  };
  const handleOrderLineUpdate = (data: OrderLineUpdateMutation) => {
    const errs = data.orderLineUpdate?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "Fn3bE0",
          defaultMessage: "Order line updated",
        }),
      });
    } else {
      errs.forEach(error =>
        notify({
          status: "error",
          text: getOrderErrorMessage(error, intl),
        }),
      );
    }
  };
  const handleOrderFulfillmentApprove = (
    data: OrderFulfillmentApproveMutation,
  ) => {
    const errs = data.orderFulfillmentApprove?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "+sX7yS",
          defaultMessage: "Fulfillment successfully approved",
        }),
      });
      closeModal();
    } else {
      if (!errs.every(err => err.code === OrderErrorCode.INSUFFICIENT_STOCK)) {
        handleNestedMutationErrors({ data, intl, notify });
      }
    }
  };
  const handleOrderFulfillmentCancel = (
    data: OrderFulfillmentCancelMutation,
  ) => {
    const errs = data.orderFulfillmentCancel?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "uMpv1v",
          defaultMessage: "Fulfillment successfully cancelled",
        }),
      });
      closeModal();
    }
  };
  const handleOrderFulfillmentUpdate = (
    data: OrderFulfillmentUpdateTrackingMutation,
  ) => {
    const errs = data.orderFulfillmentUpdateTracking?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "CZmloB",
          defaultMessage: "Fulfillment successfully updated",
        }),
      });
      closeModal();
    }
  };
  const handleDraftFinalize = (data: OrderDraftFinalizeMutation) => {
    const errs = data.draftOrderComplete?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "c4gbXr",
          defaultMessage: "Draft order successfully finalized",
        }),
      });
    }
  };
  const handleInvoiceGeneratePending = (data: InvoiceRequestMutation) => {
    const errs = data.invoiceRequest?.errors;
    if (errs.length === 0) {
      notify({
        text: intl.formatMessage({
          id: "ND5x+V",
          defaultMessage:
            "We’re generating the invoice you requested. Please wait a couple of moments",
        }),
        title: intl.formatMessage({
          id: "PKJqcq",
          defaultMessage: "Invoice is Generating",
        }),
      });
      closeModal();
    }
  };
  const handleInvoiceGenerateFinished = (data: InvoiceRequestMutation) => {
    const errs = data.invoiceRequest?.errors;
    if (errs.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(messages.invoiceGenerateFinishedText),
        title: intl.formatMessage(messages.invoiceGenerateFinishedTitle),
      });
      closeModal();
    }
  };
  const handleInvoiceSend = (data: InvoiceEmailSendMutation) => {
    const errs = data.invoiceSendNotification?.errors;
    if (errs.length === 0) {
      notify({
        text: intl.formatMessage({
          id: "3u+4NZ",
          defaultMessage: "Invoice email sent",
        }),
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
    handleOrderFulfillmentApprove,
    handleOrderFulfillmentCancel,
    handleOrderFulfillmentUpdate,
    handleOrderLineDelete,
    handleOrderLineUpdate,
    handleOrderLinesAdd,
    handleOrderMarkAsPaid,
    handleOrderVoid,
    handlePaymentCapture,
    handleShippingMethodUpdate,
    handleUpdate,
  });
};
