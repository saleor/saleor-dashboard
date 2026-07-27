import {
  type CreateManualTransactionCaptureMutation,
  type InvoiceEmailSendMutation,
  type InvoiceRequestMutation,
  type OrderCancelMutation,
  type OrderCaptureMutation,
  type OrderDraftCancelMutation,
  type OrderDraftFinalizeMutation,
  type OrderDraftUpdateMutation,
  type OrderFulfillmentApproveMutation,
  type OrderFulfillmentCancelMutation,
  type OrderFulfillmentUpdateTrackingMutation,
  type OrderLineDeleteMutation,
  type OrderLinesAddMutation,
  type OrderLineUpdateMutation,
  type OrderMarkAsPaidMutation,
  type OrderNoteAddMutation,
  type OrderNoteUpdateMutation,
  type OrderShippingMethodUpdateMutation,
  type OrderTransactionRequestActionMutation,
  type OrderUpdateMutation,
  type OrderVoidMutation,
} from "@dashboard/graphql";

/**
 * Completion handlers for every order mutation, built once at the route and
 * passed to the focused operation hooks. Each hook uses only its own slice, so
 * this single object can be handed to any of them.
 */
export interface OrderOperationHandlers {
  onNoteAdd: (data: OrderNoteAddMutation) => void;
  onNoteUpdate: (data: OrderNoteUpdateMutation) => void;
  onOrderCancel: (data: OrderCancelMutation) => void;
  onUpdate: (data: OrderUpdateMutation) => void;
  onOrderFulfillmentApprove: (data: OrderFulfillmentApproveMutation) => void;
  onOrderFulfillmentCancel: (data: OrderFulfillmentCancelMutation) => void;
  onOrderFulfillmentUpdate: (data: OrderFulfillmentUpdateTrackingMutation) => void;
  onInvoiceRequest: (data: InvoiceRequestMutation) => void;
  onInvoiceSend: (data: InvoiceEmailSendMutation) => void;
  onOrderLineDelete: (data: OrderLineDeleteMutation) => void;
  onOrderLinesAdd: (data: OrderLinesAddMutation) => void;
  onOrderLineUpdate: (data: OrderLineUpdateMutation) => void;
  onShippingMethodUpdate: (data: OrderShippingMethodUpdateMutation) => void;
  onPaymentCapture: (data: OrderCaptureMutation) => void;
  onOrderVoid: (data: OrderVoidMutation) => void;
  onOrderMarkAsPaid: (data: OrderMarkAsPaidMutation) => void;
  onTransactionActionSend: (data: OrderTransactionRequestActionMutation) => void;
  onManualTransactionAdded: (data: CreateManualTransactionCaptureMutation) => void;
  onDraftUpdate: (data: OrderDraftUpdateMutation) => void;
  onDraftCancel: (data: OrderDraftCancelMutation) => void;
  onDraftFinalize: (data: OrderDraftFinalizeMutation) => void;
}
