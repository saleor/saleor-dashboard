import {
  InvoiceEmailSendMutation,
  InvoiceEmailSendMutationVariables,
  InvoiceRequestMutation,
  InvoiceRequestMutationVariables,
  OrderAddNoteMutation,
  OrderAddNoteMutationVariables,
  OrderCancelMutation,
  OrderCancelMutationVariables,
  OrderCaptureMutation,
  OrderCaptureMutationVariables,
  OrderDraftCancelMutation,
  OrderDraftCancelMutationVariables,
  OrderDraftFinalizeMutation,
  OrderDraftFinalizeMutationVariables,
  OrderDraftUpdateMutation,
  OrderDraftUpdateMutationVariables,
  OrderFulfillmentApproveMutation,
  OrderFulfillmentApproveMutationVariables,
  OrderFulfillmentCancelMutation,
  OrderFulfillmentCancelMutationVariables,
  OrderFulfillmentUpdateTrackingMutation,
  OrderFulfillmentUpdateTrackingMutationVariables,
  OrderLineDeleteMutation,
  OrderLineDeleteMutationVariables,
  OrderLinesAddMutation,
  OrderLinesAddMutationVariables,
  OrderLineUpdateMutation,
  OrderLineUpdateMutationVariables,
  OrderMarkAsPaidMutation,
  OrderMarkAsPaidMutationVariables,
  OrderShippingMethodUpdateMutation,
  OrderShippingMethodUpdateMutationVariables,
  OrderUpdateMutation,
  OrderUpdateMutationVariables,
  OrderVoidMutation,
  OrderVoidMutationVariables,
  useInvoiceEmailSendMutation,
  useInvoiceRequestMutation,
  useOrderAddNoteMutation,
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
  useOrderShippingMethodUpdateMutation,
  useOrderUpdateMutation,
  useOrderVoidMutation,
} from "@saleor/graphql";
import React from "react";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";

interface OrderOperationsProps {
  order: string;
  children: (props: {
    orderAddNote: PartialMutationProviderOutput<
      OrderAddNoteMutation,
      OrderAddNoteMutationVariables
    >;
    orderCancel: PartialMutationProviderOutput<
      OrderCancelMutation,
      OrderCancelMutationVariables
    >;
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
    orderVoid: PartialMutationProviderOutput<
      OrderVoidMutation,
      OrderVoidMutationVariables
    >;
    orderUpdate: PartialMutationProviderOutput<
      OrderUpdateMutation,
      OrderUpdateMutationVariables
    >;
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
  }) => React.ReactNode;
  onOrderFulfillmentApprove: (data: OrderFulfillmentApproveMutation) => void;
  onOrderFulfillmentCancel: (data: OrderFulfillmentCancelMutation) => void;
  onOrderFulfillmentUpdate: (
    data: OrderFulfillmentUpdateTrackingMutation,
  ) => void;
  onOrderCancel: (data: OrderCancelMutation) => void;
  onOrderVoid: (data: OrderVoidMutation) => void;
  onOrderMarkAsPaid: (data: OrderMarkAsPaidMutation) => void;
  onNoteAdd: (data: OrderAddNoteMutation) => void;
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
}

const OrderOperations: React.FC<OrderOperationsProps> = ({
  children,
  onDraftUpdate,
  onNoteAdd,
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
}) => {
  const orderVoid = useOrderVoidMutation({
    onCompleted: onOrderVoid,
  });
  const orderCancel = useOrderCancelMutation({
    onCompleted: onOrderCancel,
  });
  const paymentCapture = useOrderCaptureMutation({
    onCompleted: onPaymentCapture,
  });
  const addNote = useOrderAddNoteMutation({
    onCompleted: onNoteAdd,
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

  return (
    <>
      {children({
        orderAddNote: getMutationProviderData(...addNote),
        orderCancel: getMutationProviderData(...orderCancel),
        orderDraftCancel: getMutationProviderData(...cancelDraft),
        orderDraftFinalize: getMutationProviderData(...finalizeDraft),
        orderDraftUpdate: getMutationProviderData(...updateDraft),
        orderFulfillmentApprove: getMutationProviderData(...approveFulfillment),
        orderFulfillmentCancel: getMutationProviderData(...cancelFulfillment),
        orderFulfillmentUpdateTracking: getMutationProviderData(
          ...updateTrackingNumber,
        ),
        orderInvoiceRequest: getMutationProviderData(...invoiceRequest),
        orderInvoiceSend: getMutationProviderData(...invoiceEmailSend),
        orderLineDelete: getMutationProviderData(...deleteOrderLine),
        orderLineUpdate: getMutationProviderData(...updateOrderLine),
        orderLinesAdd: getMutationProviderData(...addOrderLine),
        orderPaymentCapture: getMutationProviderData(...paymentCapture),
        orderPaymentMarkAsPaid: getMutationProviderData(...markAsPaid),
        orderShippingMethodUpdate: getMutationProviderData(
          ...updateShippingMethod,
        ),
        orderUpdate: getMutationProviderData(...update),
        orderVoid: getMutationProviderData(...orderVoid),
      })}
    </>
  );
};
export default OrderOperations;
