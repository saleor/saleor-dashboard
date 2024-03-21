// @ts-strict-ignore
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import {
  order,
  payments,
  prepareMoney,
  shop,
} from "@dashboard/orders/fixtures";
import React from "react";

import OrderDetailsPage, { OrderDetailsPageProps } from "./OrderDetailsPage";

const props: Omit<OrderDetailsPageProps, "classes"> = {
  loading: false,
  onBillingAddressEdit: undefined,
  onTransactionAction: () => undefined,
  onFulfillmentApprove: () => undefined,
  onFulfillmentCancel: () => undefined,
  onFulfillmentTrackingNumberUpdate: () => undefined,
  onInvoiceClick: () => undefined,
  onInvoiceGenerate: () => undefined,
  onInvoiceSend: () => undefined,
  onShowMetadata: () => undefined,
  onNoteAdd: undefined,
  onOrderCancel: undefined,
  onOrderFulfill: undefined,
  onOrderReturn: () => undefined,
  onPaymentCapture: undefined,
  onMarkAsPaid: undefined,
  onPaymentVoid: undefined,
  onPaymentRefund: undefined,
  onProductClick: undefined,
  onProfileView: () => undefined,
  onShippingAddressEdit: undefined,
  onSubmit: () => undefined,
  onAddManualTransaction: () => undefined,
  onRefundAdd: () => undefined,
  order: order(null),
  errors: [],
  shop,
  saveButtonBarState: "default",
};

export default {
  title: "Orders / Order details",
};

export const Pending = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      payments: [payments.pending],
    }}
  />
);

export const Authorized = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      payments: [payments.authorized],
    }}
  />
);

export const Completed = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      payments: [payments.completed],
    }}
  />
);

export const NoPayment = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      payments: [],
      totalAuthorized: prepareMoney(0),
    }}
  />
);

export const Refunded = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED,
      payments: [payments.refunded],
    }}
  />
);

export const PartialRefund = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
      payments: [payments.partialRefund],
    }}
  />
);

export const Rejected = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      transactions: [],
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      payments: [payments.rejected],
    }}
  />
);

export const Default = () => <OrderDetailsPage {...props} />;

export const Loading = () => <OrderDetailsPage {...props} order={undefined} />;

export const Cancelled = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      fulfillments: props.order.fulfillments.map(fulfillment => ({
        ...fulfillment,
        status: FulfillmentStatus.CANCELED,
      })),
      status: OrderStatus.CANCELED,
    }}
  />
);

export const Fulfilled = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      status: OrderStatus.FULFILLED,
    }}
  />
);

export const PartiallyFulfilled = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      status: OrderStatus.PARTIALLY_FULFILLED,
    }}
  />
);

export const Unfulfilled = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      status: OrderStatus.UNFULFILLED,
    }}
  />
);

export const NoShippingAddress = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      shippingAddress: null,
    }}
  />
);

export const NoCustomerNote = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      customerNote: "",
    }}
  />
);
