import {
  useInvoiceEmailSendMutation,
  useInvoiceRequestMutation,
  useOrderCancelMutation,
  useOrderFulfillmentApproveMutation,
  useOrderFulfillmentCancelMutation,
  useOrderFulfillmentUpdateTrackingMutation,
  useOrderLineDeleteMutation,
  useOrderLinesAddMutation,
  useOrderLineUpdateMutation,
  useOrderNoteAddMutation,
  useOrderNoteUpdateMutation,
  useOrderShippingMethodUpdateMutation,
  useOrderUpdateMutation,
} from "@dashboard/graphql";

import { getMutationProviderData } from "../../../../misc";
import { type OrderOperationHandlers } from "./handlers";

/**
 * Mutations shared by every non-draft order regardless of payment mode: notes,
 * cancel, order/address update, fulfillment, invoices, and the line/shipping
 * edits an unconfirmed order still needs.
 */
export const useCommonOrderOperations = (handlers: OrderOperationHandlers) => {
  const addNote = useOrderNoteAddMutation({ onCompleted: handlers.onNoteAdd });
  const updateNote = useOrderNoteUpdateMutation({ onCompleted: handlers.onNoteUpdate });
  const orderCancel = useOrderCancelMutation({ onCompleted: handlers.onOrderCancel });
  const update = useOrderUpdateMutation({
    onCompleted: handlers.onUpdate,
    // Order address edit dialogs surface validation errors inline on AddressEdit
    // fields. Suppress the global per-error toast from makeMutation.
    disableErrorHandling: true,
  });
  const approveFulfillment = useOrderFulfillmentApproveMutation({
    onCompleted: handlers.onOrderFulfillmentApprove,
    disableErrorHandling: true,
  });
  const cancelFulfillment = useOrderFulfillmentCancelMutation({
    onCompleted: handlers.onOrderFulfillmentCancel,
  });
  const updateTrackingNumber = useOrderFulfillmentUpdateTrackingMutation({
    onCompleted: handlers.onOrderFulfillmentUpdate,
  });
  const invoiceRequest = useInvoiceRequestMutation({ onCompleted: handlers.onInvoiceRequest });
  const invoiceEmailSend = useInvoiceEmailSendMutation({ onCompleted: handlers.onInvoiceSend });
  const deleteOrderLine = useOrderLineDeleteMutation({ onCompleted: handlers.onOrderLineDelete });
  const addOrderLine = useOrderLinesAddMutation({ onCompleted: handlers.onOrderLinesAdd });
  const updateOrderLine = useOrderLineUpdateMutation({ onCompleted: handlers.onOrderLineUpdate });
  const updateShippingMethod = useOrderShippingMethodUpdateMutation({
    onCompleted: handlers.onShippingMethodUpdate,
  });

  return {
    orderAddNote: getMutationProviderData(...addNote),
    orderUpdateNote: getMutationProviderData(...updateNote),
    orderCancel: getMutationProviderData(...orderCancel),
    orderUpdate: getMutationProviderData(...update),
    orderFulfillmentApprove: getMutationProviderData(...approveFulfillment),
    orderFulfillmentCancel: getMutationProviderData(...cancelFulfillment),
    orderFulfillmentUpdateTracking: getMutationProviderData(...updateTrackingNumber),
    orderInvoiceRequest: getMutationProviderData(...invoiceRequest),
    orderInvoiceSend: getMutationProviderData(...invoiceEmailSend),
    orderLineDelete: getMutationProviderData(...deleteOrderLine),
    orderLinesAdd: getMutationProviderData(...addOrderLine),
    orderLineUpdate: getMutationProviderData(...updateOrderLine),
    orderShippingMethodUpdate: getMutationProviderData(...updateShippingMethod),
  };
};

export type CommonOrderOperations = ReturnType<typeof useCommonOrderOperations>;
