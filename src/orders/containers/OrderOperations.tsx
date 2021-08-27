import React from "react";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedInvoiceEmailSendMutation,
  TypedInvoiceRequestMutation,
  TypedOrderAddNoteMutation,
  TypedOrderCancelMutation,
  TypedOrderCaptureMutation,
  TypedOrderDraftCancelMutation,
  TypedOrderDraftFinalizeMutation,
  TypedOrderDraftUpdateMutation,
  TypedOrderFulfillmentCancelMutation,
  TypedOrderFulfillmentUpdateTrackingMutation,
  TypedOrderLineDeleteMutation,
  TypedOrderLinesAddMutation,
  TypedOrderLineUpdateMutation,
  TypedOrderMarkAsPaidMutation,
  TypedOrderShippingMethodUpdateMutation,
  TypedOrderUpdateMutation,
  TypedOrderVoidMutation,
  TypedPaymentCaptureMutation,
  TypedPaymentVoidMutation
} from "../mutations";
import {
  InvoiceEmailSend,
  InvoiceEmailSendVariables
} from "../types/InvoiceEmailSend";
import {
  InvoiceRequest,
  InvoiceRequestVariables
} from "../types/InvoiceRequest";
import { OrderAddNote, OrderAddNoteVariables } from "../types/OrderAddNote";
import { OrderCancel, OrderCancelVariables } from "../types/OrderCancel";
import { OrderCapture, OrderCaptureVariables } from "../types/OrderCapture";
import {
  OrderDraftCancel,
  OrderDraftCancelVariables
} from "../types/OrderDraftCancel";
import {
  OrderDraftFinalize,
  OrderDraftFinalizeVariables
} from "../types/OrderDraftFinalize";
import {
  OrderDraftUpdate,
  OrderDraftUpdateVariables
} from "../types/OrderDraftUpdate";
import {
  OrderFulfillmentCancel,
  OrderFulfillmentCancelVariables
} from "../types/OrderFulfillmentCancel";
import {
  OrderFulfillmentUpdateTracking,
  OrderFulfillmentUpdateTrackingVariables
} from "../types/OrderFulfillmentUpdateTracking";
import {
  OrderLineDelete,
  OrderLineDeleteVariables
} from "../types/OrderLineDelete";
import { OrderLinesAdd, OrderLinesAddVariables } from "../types/OrderLinesAdd";
import {
  OrderLineUpdate,
  OrderLineUpdateVariables
} from "../types/OrderLineUpdate";
import {
  OrderMarkAsPaid,
  OrderMarkAsPaidVariables
} from "../types/OrderMarkAsPaid";
import {
  OrderShippingMethodUpdate,
  OrderShippingMethodUpdateVariables
} from "../types/OrderShippingMethodUpdate";
import { OrderUpdate, OrderUpdateVariables } from "../types/OrderUpdate";
import { OrderVoid, OrderVoidVariables } from "../types/OrderVoid";
import {
  PaymentCapture,
  PaymentCaptureVariables
} from "../types/PaymentCapture";
import { PaymentVoid, PaymentVoidVariables } from "../types/PaymentVoid";

interface OrderOperationsProps {
  order: string;
  children: (props: {
    orderAddNote: PartialMutationProviderOutput<
      OrderAddNote,
      OrderAddNoteVariables
    >;
    orderCancel: PartialMutationProviderOutput<
      OrderCancel,
      OrderCancelVariables
    >;
    orderFulfillmentCancel: PartialMutationProviderOutput<
      OrderFulfillmentCancel,
      OrderFulfillmentCancelVariables
    >;
    orderFulfillmentUpdateTracking: PartialMutationProviderOutput<
      OrderFulfillmentUpdateTracking,
      OrderFulfillmentUpdateTrackingVariables
    >;
    orderCapture: PartialMutationProviderOutput<
      OrderCapture,
      OrderCaptureVariables
    >;
    paymentCapture: PartialMutationProviderOutput<
      PaymentCapture,
      PaymentCaptureVariables
    >;
    orderPaymentMarkAsPaid: PartialMutationProviderOutput<
      OrderMarkAsPaid,
      OrderMarkAsPaidVariables
    >;
    orderVoid: PartialMutationProviderOutput<OrderVoid, OrderVoidVariables>;
    paymentVoid: PartialMutationProviderOutput<
      PaymentVoid,
      PaymentVoidVariables
    >;
    orderUpdate: PartialMutationProviderOutput<
      OrderUpdate,
      OrderUpdateVariables
    >;
    orderDraftCancel: PartialMutationProviderOutput<
      OrderDraftCancel,
      OrderDraftCancelVariables
    >;
    orderDraftFinalize: PartialMutationProviderOutput<
      OrderDraftFinalize,
      OrderDraftFinalizeVariables
    >;
    orderDraftUpdate: PartialMutationProviderOutput<
      OrderDraftUpdate,
      OrderDraftUpdateVariables
    >;
    orderShippingMethodUpdate: PartialMutationProviderOutput<
      OrderShippingMethodUpdate,
      OrderShippingMethodUpdateVariables
    >;
    orderLineDelete: PartialMutationProviderOutput<
      OrderLineDelete,
      OrderLineDeleteVariables
    >;
    orderLinesAdd: PartialMutationProviderOutput<
      OrderLinesAdd,
      OrderLinesAddVariables
    >;
    orderLineUpdate: PartialMutationProviderOutput<
      OrderLineUpdate,
      OrderLineUpdateVariables
    >;
    orderInvoiceRequest: PartialMutationProviderOutput<
      InvoiceRequest,
      InvoiceRequestVariables
    >;
    orderInvoiceSend: PartialMutationProviderOutput<
      InvoiceEmailSend,
      InvoiceEmailSendVariables
    >;
  }) => React.ReactNode;
  onOrderFulfillmentCancel: (data: OrderFulfillmentCancel) => void;
  onOrderFulfillmentUpdate: (data: OrderFulfillmentUpdateTracking) => void;
  onOrderCancel: (data: OrderCancel) => void;
  onOrderVoid: (data: OrderVoid) => void;
  onPaymentVoid: (data: PaymentVoid) => void;
  onOrderMarkAsPaid: (data: OrderMarkAsPaid) => void;
  onNoteAdd: (data: OrderAddNote) => void;
  onOrderCapture: (data: OrderCapture) => void;
  onPaymentCapture: (data: PaymentCapture) => void;
  onUpdate: (data: OrderUpdate) => void;
  onDraftCancel: (data: OrderDraftCancel) => void;
  onDraftFinalize: (data: OrderDraftFinalize) => void;
  onDraftUpdate: (data: OrderDraftUpdate) => void;
  onShippingMethodUpdate: (data: OrderShippingMethodUpdate) => void;
  onOrderLineDelete: (data: OrderLineDelete) => void;
  onOrderLinesAdd: (data: OrderLinesAdd) => void;
  onOrderLineUpdate: (data: OrderLineUpdate) => void;
  onInvoiceRequest: (data: InvoiceRequest) => void;
  onInvoiceSend: (data: InvoiceEmailSend) => void;
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
  onPaymentVoid,
  onOrderCapture,
  onPaymentCapture,
  onShippingMethodUpdate,
  onUpdate,
  onDraftCancel,
  onDraftFinalize,
  onOrderFulfillmentCancel,
  onOrderFulfillmentUpdate,
  onOrderMarkAsPaid,
  onInvoiceRequest,
  onInvoiceSend
}) => (
  <TypedPaymentVoidMutation onCompleted={onPaymentVoid}>
    {(...paymentVoid) => (
      <TypedOrderVoidMutation onCompleted={onOrderVoid}>
        {(...orderVoid) => (
          <TypedOrderCancelMutation onCompleted={onOrderCancel}>
            {(...orderCancel) => (
              <TypedOrderCaptureMutation onCompleted={onOrderCapture}>
                {(...orderCapture) => (
                  <TypedPaymentCaptureMutation onCompleted={onPaymentCapture}>
                    {(...paymentCapture) => (
                      <TypedOrderAddNoteMutation onCompleted={onNoteAdd}>
                        {(...addNote) => (
                          <TypedOrderUpdateMutation onCompleted={onUpdate}>
                            {(...update) => (
                              <TypedOrderDraftUpdateMutation
                                onCompleted={onDraftUpdate}
                              >
                                {(...updateDraft) => (
                                  <TypedOrderShippingMethodUpdateMutation
                                    onCompleted={onShippingMethodUpdate}
                                  >
                                    {(...updateShippingMethod) => (
                                      <TypedOrderLineDeleteMutation
                                        onCompleted={onOrderLineDelete}
                                      >
                                        {(...deleteOrderLine) => (
                                          <TypedOrderLinesAddMutation
                                            onCompleted={onOrderLinesAdd}
                                          >
                                            {(...addOrderLine) => (
                                              <TypedOrderLineUpdateMutation
                                                onCompleted={onOrderLineUpdate}
                                              >
                                                {(...updateOrderLine) => (
                                                  <TypedOrderFulfillmentCancelMutation
                                                    onCompleted={
                                                      onOrderFulfillmentCancel
                                                    }
                                                  >
                                                    {(...cancelFulfillment) => (
                                                      <TypedOrderFulfillmentUpdateTrackingMutation
                                                        onCompleted={
                                                          onOrderFulfillmentUpdate
                                                        }
                                                      >
                                                        {(
                                                          ...updateTrackingNumber
                                                        ) => (
                                                          <TypedOrderDraftFinalizeMutation
                                                            onCompleted={
                                                              onDraftFinalize
                                                            }
                                                          >
                                                            {(
                                                              ...finalizeDraft
                                                            ) => (
                                                              <TypedOrderDraftCancelMutation
                                                                onCompleted={
                                                                  onDraftCancel
                                                                }
                                                              >
                                                                {(
                                                                  ...cancelDraft
                                                                ) => (
                                                                  <TypedOrderMarkAsPaidMutation
                                                                    onCompleted={
                                                                      onOrderMarkAsPaid
                                                                    }
                                                                  >
                                                                    {(
                                                                      ...markAsPaid
                                                                    ) => (
                                                                      <TypedInvoiceRequestMutation
                                                                        onCompleted={
                                                                          onInvoiceRequest
                                                                        }
                                                                      >
                                                                        {(
                                                                          ...invoiceRequest
                                                                        ) => (
                                                                          <TypedInvoiceEmailSendMutation
                                                                            onCompleted={
                                                                              onInvoiceSend
                                                                            }
                                                                          >
                                                                            {(
                                                                              ...invoiceEmailSend
                                                                            ) =>
                                                                              children(
                                                                                {
                                                                                  orderAddNote: getMutationProviderData(
                                                                                    ...addNote
                                                                                  ),
                                                                                  orderCancel: getMutationProviderData(
                                                                                    ...orderCancel
                                                                                  ),
                                                                                  orderDraftCancel: getMutationProviderData(
                                                                                    ...cancelDraft
                                                                                  ),
                                                                                  orderDraftFinalize: getMutationProviderData(
                                                                                    ...finalizeDraft
                                                                                  ),
                                                                                  orderDraftUpdate: getMutationProviderData(
                                                                                    ...updateDraft
                                                                                  ),
                                                                                  orderFulfillmentCancel: getMutationProviderData(
                                                                                    ...cancelFulfillment
                                                                                  ),
                                                                                  orderFulfillmentUpdateTracking: getMutationProviderData(
                                                                                    ...updateTrackingNumber
                                                                                  ),
                                                                                  orderInvoiceRequest: getMutationProviderData(
                                                                                    ...invoiceRequest
                                                                                  ),
                                                                                  orderInvoiceSend: getMutationProviderData(
                                                                                    ...invoiceEmailSend
                                                                                  ),
                                                                                  orderLineDelete: getMutationProviderData(
                                                                                    ...deleteOrderLine
                                                                                  ),
                                                                                  orderLineUpdate: getMutationProviderData(
                                                                                    ...updateOrderLine
                                                                                  ),
                                                                                  orderLinesAdd: getMutationProviderData(
                                                                                    ...addOrderLine
                                                                                  ),
                                                                                  orderCapture: getMutationProviderData(
                                                                                    ...orderCapture
                                                                                  ),
                                                                                  paymentCapture: getMutationProviderData(
                                                                                    ...paymentCapture
                                                                                  ),
                                                                                  orderPaymentMarkAsPaid: getMutationProviderData(
                                                                                    ...markAsPaid
                                                                                  ),
                                                                                  orderShippingMethodUpdate: getMutationProviderData(
                                                                                    ...updateShippingMethod
                                                                                  ),
                                                                                  orderUpdate: getMutationProviderData(
                                                                                    ...update
                                                                                  ),
                                                                                  orderVoid: getMutationProviderData(
                                                                                    ...orderVoid
                                                                                  ),
                                                                                  paymentVoid: getMutationProviderData(
                                                                                    ...paymentVoid
                                                                                  )
                                                                                }
                                                                              )
                                                                            }
                                                                          </TypedInvoiceEmailSendMutation>
                                                                        )}
                                                                      </TypedInvoiceRequestMutation>
                                                                    )}
                                                                  </TypedOrderMarkAsPaidMutation>
                                                                )}
                                                              </TypedOrderDraftCancelMutation>
                                                            )}
                                                          </TypedOrderDraftFinalizeMutation>
                                                        )}
                                                      </TypedOrderFulfillmentUpdateTrackingMutation>
                                                    )}
                                                  </TypedOrderFulfillmentCancelMutation>
                                                )}
                                              </TypedOrderLineUpdateMutation>
                                            )}
                                          </TypedOrderLinesAddMutation>
                                        )}
                                      </TypedOrderLineDeleteMutation>
                                    )}
                                  </TypedOrderShippingMethodUpdateMutation>
                                )}
                              </TypedOrderDraftUpdateMutation>
                            )}
                          </TypedOrderUpdateMutation>
                        )}
                      </TypedOrderAddNoteMutation>
                    )}
                  </TypedPaymentCaptureMutation>
                )}
              </TypedOrderCaptureMutation>
            )}
          </TypedOrderCancelMutation>
        )}
      </TypedOrderVoidMutation>
    )}
  </TypedPaymentVoidMutation>
);
export default OrderOperations;
