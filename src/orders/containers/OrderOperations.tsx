import {
  type CreateManualTransactionCaptureMutation,
  type CreateManualTransactionCaptureMutationVariables,
  type InvoiceEmailSendMutation,
  type InvoiceEmailSendMutationVariables,
  type InvoiceRequestMutation,
  type InvoiceRequestMutationVariables,
  type OrderCancelMutation,
  type OrderCancelMutationVariables,
  type OrderCaptureMutation,
  type OrderCaptureMutationVariables,
  type OrderDraftCancelMutation,
  type OrderDraftCancelMutationVariables,
  type OrderDraftFinalizeMutation,
  type OrderDraftFinalizeMutationVariables,
  type OrderDraftUpdateMutation,
  type OrderDraftUpdateMutationVariables,
  type OrderFulfillmentApproveMutation,
  type OrderFulfillmentApproveMutationVariables,
  type OrderFulfillmentCancelMutation,
  type OrderFulfillmentCancelMutationVariables,
  type OrderFulfillmentUpdateTrackingMutation,
  type OrderFulfillmentUpdateTrackingMutationVariables,
  type OrderLineDeleteMutation,
  type OrderLineDeleteMutationVariables,
  type OrderLinesAddMutation,
  type OrderLinesAddMutationVariables,
  type OrderLineUpdateMutation,
  type OrderLineUpdateMutationVariables,
  type OrderMarkAsPaidMutation,
  type OrderMarkAsPaidMutationVariables,
  type OrderNoteAddMutation,
  type OrderNoteAddMutationVariables,
  type OrderNoteUpdateMutation,
  type OrderNoteUpdateMutationVariables,
  type OrderShippingMethodUpdateMutation,
  type OrderShippingMethodUpdateMutationVariables,
  type OrderTransactionRequestActionMutation,
  type OrderTransactionRequestActionMutationVariables,
  type OrderUpdateMutation,
  type OrderUpdateMutationVariables,
  type OrderVoidMutation,
  type OrderVoidMutationVariables,
  useCreateManualTransactionCaptureMutation,
  useInvoiceEmailSendMutation,
  useInvoiceRequestMutation,
  useOrderCancelMutation,
  useOrderCaptureMutation,
  useOrderDraftCancelMutation,
  useOrderDraftFinalizeMutation,
  useOrderDraftUpdateMutation,
  useOrderFulfillmentApproveMutation,
  useOrderFulfillmentCancelMutation,
  useOrderFulfillmentUpdateTrackingMutation,
  useOrderLineDeleteMutation,
  useOrderLinesAddMutation,
  useOrderLineUpdateMutation,
  useOrderMarkAsPaidMutation,
  useOrderNoteAddMutation,
  useOrderNoteUpdateMutation,
  useOrderShippingMethodUpdateMutation,
  useOrderTransactionRequestActionMutation,
  useOrderUpdateMutation,
  useOrderVoidMutation,
} from "@dashboard/graphql";
import type * as React from "react";

import { getMutationProviderData } from "../../misc";
import { type PartialMutationProviderOutput } from "../../types";

interface OrderOperationsProps {
  order: string;
  children: (props: {
    orderAddNote: PartialMutationProviderOutput<
      OrderNoteAddMutation,
      OrderNoteAddMutationVariables
    >;
    orderUpdateNote: PartialMutationProviderOutput<
      OrderNoteUpdateMutation,
      OrderNoteUpdateMutationVariables
    >;
    orderCancel: PartialMutationProviderOutput<OrderCancelMutation, OrderCancelMutationVariables>;
    orderFulfillmentApprove: PartialMutationProviderOutput<
      OrderFulfillmentApproveMutation,
      OrderFulfillmentApproveMutationVariables
    >;
    orderFulfillmentCancel: PartialMutationProviderOutput<
      OrderFulfillmentCancelMutation,
      OrderFulfillmentCancelMutationVariables
    >;
    orderFulfillmentUpdateTracking: PartialMutationProviderOutput<
      OrderFulfillmentUpdateTrackingMutation,
      OrderFulfillmentUpdateTrackingMutationVariables
    >;
    orderPaymentCapture: PartialMutationProviderOutput<
      OrderCaptureMutation,
      OrderCaptureMutationVariables
    >;
    orderPaymentMarkAsPaid: PartialMutationProviderOutput<
      OrderMarkAsPaidMutation,
      OrderMarkAsPaidMutationVariables
    >;
    orderVoid: PartialMutationProviderOutput<OrderVoidMutation, OrderVoidMutationVariables>;
    orderUpdate: PartialMutationProviderOutput<OrderUpdateMutation, OrderUpdateMutationVariables>;
    orderDraftCancel: PartialMutationProviderOutput<
      OrderDraftCancelMutation,
      OrderDraftCancelMutationVariables
    >;
    orderDraftFinalize: PartialMutationProviderOutput<
      OrderDraftFinalizeMutation,
      OrderDraftFinalizeMutationVariables
    >;
    orderDraftUpdate: PartialMutationProviderOutput<
      OrderDraftUpdateMutation,
      OrderDraftUpdateMutationVariables
    >;
    orderShippingMethodUpdate: PartialMutationProviderOutput<
      OrderShippingMethodUpdateMutation,
      OrderShippingMethodUpdateMutationVariables
    >;
    orderLineDelete: PartialMutationProviderOutput<
      OrderLineDeleteMutation,
      OrderLineDeleteMutationVariables
    >;
    orderLinesAdd: PartialMutationProviderOutput<
      OrderLinesAddMutation,
      OrderLinesAddMutationVariables
    >;
    orderLineUpdate: PartialMutationProviderOutput<
      OrderLineUpdateMutation,
      OrderLineUpdateMutationVariables
    >;
    orderInvoiceRequest: PartialMutationProviderOutput<
      InvoiceRequestMutation,
      InvoiceRequestMutationVariables
    >;
    orderInvoiceSend: PartialMutationProviderOutput<
      InvoiceEmailSendMutation,
      InvoiceEmailSendMutationVariables
    >;
    orderTransactionAction: PartialMutationProviderOutput<
      OrderTransactionRequestActionMutation,
      OrderTransactionRequestActionMutationVariables
    >;
    orderAddManualTransaction: PartialMutationProviderOutput<
      CreateManualTransactionCaptureMutation,
      CreateManualTransactionCaptureMutationVariables
    >;
  }) => React.ReactNode;
  onOrderFulfillmentApprove: (data: OrderFulfillmentApproveMutation) => void;
  onOrderFulfillmentCancel: (data: OrderFulfillmentCancelMutation) => void;
  onOrderFulfillmentUpdate: (data: OrderFulfillmentUpdateTrackingMutation) => void;
  onOrderCancel: (data: OrderCancelMutation) => void;
  onOrderVoid: (data: OrderVoidMutation) => void;
  onOrderMarkAsPaid: (data: OrderMarkAsPaidMutation) => void;
  onNoteAdd: (data: OrderNoteAddMutation) => void;
  onNoteUpdate: (data: OrderNoteUpdateMutation) => void;
  onPaymentCapture: (data: OrderCaptureMutation) => void;
  onUpdate: (data: OrderUpdateMutation) => void;
  onDraftCancel: (data: OrderDraftCancelMutation) => void;
  onDraftFinalize: (data: OrderDraftFinalizeMutation) => void;
  onDraftUpdate: (data: OrderDraftUpdateMutation) => void;
  onShippingMethodUpdate: (data: OrderShippingMethodUpdateMutation) => void;
  onOrderLineDelete: (data: OrderLineDeleteMutation) => void;
  onOrderLinesAdd: (data: OrderLinesAddMutation) => void;
  onOrderLineUpdate: (data: OrderLineUpdateMutation) => void;
  onInvoiceRequest: (data: InvoiceRequestMutation) => void;
  onInvoiceSend: (data: InvoiceEmailSendMutation) => void;
  onTransactionActionSend: (data: OrderTransactionRequestActionMutation) => void;
  onManualTransactionAdded: (data: CreateManualTransactionCaptureMutation) => void;
}

const OrderOperations = ({
  children,
  onDraftUpdate,
  onNoteAdd,
  onNoteUpdate,
  onOrderCancel,
  onOrderLinesAdd,
  onOrderLineDelete,
  onOrderLineUpdate,
  onOrderVoid,
  onPaymentCapture,
  onShippingMethodUpdate,
  onUpdate,
  onDraftCancel,
  onDraftFinalize,
  onOrderFulfillmentApprove,
  onOrderFulfillmentCancel,
  onOrderFulfillmentUpdate,
  onOrderMarkAsPaid,
  onInvoiceRequest,
  onInvoiceSend,
  onTransactionActionSend,
  onManualTransactionAdded,
}: OrderOperationsProps) => {
  const orderVoid = useOrderVoidMutation({
    onCompleted: onOrderVoid,
  });
  const orderCancel = useOrderCancelMutation({
    onCompleted: onOrderCancel,
  });
  const paymentCapture = useOrderCaptureMutation({
    onCompleted: onPaymentCapture,
  });
  const addNote = useOrderNoteAddMutation({
    onCompleted: onNoteAdd,
  });
  const updateNote = useOrderNoteUpdateMutation({
    onCompleted: onNoteUpdate,
  });
  const update = useOrderUpdateMutation({
    onCompleted: onUpdate,
  });
  const updateDraft = useOrderDraftUpdateMutation({
    onCompleted: onDraftUpdate,
  });
  const updateShippingMethod = useOrderShippingMethodUpdateMutation({
    onCompleted: onShippingMethodUpdate,
  });
  const deleteOrderLine = useOrderLineDeleteMutation({
    onCompleted: onOrderLineDelete,
  });
  const addOrderLine = useOrderLinesAddMutation({
    onCompleted: onOrderLinesAdd,
  });
  const updateOrderLine = useOrderLineUpdateMutation({
    onCompleted: onOrderLineUpdate,
  });
  const approveFulfillment = useOrderFulfillmentApproveMutation({
    onCompleted: onOrderFulfillmentApprove,
    disableErrorHandling: true,
  });
  const cancelFulfillment = useOrderFulfillmentCancelMutation({
    onCompleted: onOrderFulfillmentCancel,
  });
  const updateTrackingNumber = useOrderFulfillmentUpdateTrackingMutation({
    onCompleted: onOrderFulfillmentUpdate,
  });
  const finalizeDraft = useOrderDraftFinalizeMutation({
    onCompleted: onDraftFinalize,
  });
  const cancelDraft = useOrderDraftCancelMutation({
    onCompleted: onDraftCancel,
  });
  const markAsPaid = useOrderMarkAsPaidMutation({
    onCompleted: onOrderMarkAsPaid,
  });
  const invoiceRequest = useInvoiceRequestMutation({
    onCompleted: onInvoiceRequest,
  });
  const invoiceEmailSend = useInvoiceEmailSendMutation({
    onCompleted: onInvoiceSend,
  });
  const transactionActionSend = useOrderTransactionRequestActionMutation({
    onCompleted: onTransactionActionSend,
  });
  const addManualTransaction = useCreateManualTransactionCaptureMutation({
    onCompleted: onManualTransactionAdded,
  });

  return (
    <>
      {children({
        orderAddNote: getMutationProviderData(...addNote),
        orderUpdateNote: getMutationProviderData(...updateNote),
        orderCancel: getMutationProviderData(...orderCancel),
        orderDraftCancel: getMutationProviderData(...cancelDraft),
        orderDraftFinalize: getMutationProviderData(...finalizeDraft),
        orderDraftUpdate: getMutationProviderData(...updateDraft),
        orderFulfillmentApprove: getMutationProviderData(...approveFulfillment),
        orderFulfillmentCancel: getMutationProviderData(...cancelFulfillment),
        orderFulfillmentUpdateTracking: getMutationProviderData(...updateTrackingNumber),
        orderInvoiceRequest: getMutationProviderData(...invoiceRequest),
        orderInvoiceSend: getMutationProviderData(...invoiceEmailSend),
        orderLineDelete: getMutationProviderData(...deleteOrderLine),
        orderLineUpdate: getMutationProviderData(...updateOrderLine),
        orderLinesAdd: getMutationProviderData(...addOrderLine),
        orderPaymentCapture: getMutationProviderData(...paymentCapture),
        orderPaymentMarkAsPaid: getMutationProviderData(...markAsPaid),
        orderShippingMethodUpdate: getMutationProviderData(...updateShippingMethod),
        orderUpdate: getMutationProviderData(...update),
        orderVoid: getMutationProviderData(...orderVoid),
        orderTransactionAction: getMutationProviderData(...transactionActionSend),
        orderAddManualTransaction: getMutationProviderData(...addManualTransaction),
      })}
    </>
  );
};

export default OrderOperations;
