import placeholderImage from "@assets/images/placeholder60x60.png";
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderDetailsPage, {
  OrderDetailsPageProps,
} from "../../../orders/components/OrderDetailsPage";
import {
  order as orderFixture,
  shop as shopFixture,
  transactions,
} from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture(placeholderImage);

const props: Omit<OrderDetailsPageProps, "classes"> = {
  disabled: false,
  onBillingAddressEdit: undefined,
  onTransactionAction: () => undefined,
  onFulfillmentApprove: () => undefined,
  onFulfillmentCancel: () => undefined,
  onFulfillmentTrackingNumberUpdate: () => undefined,
  onInvoiceClick: () => undefined,
  onInvoiceGenerate: () => undefined,
  onInvoiceSend: () => undefined,
  onNoteAdd: undefined,
  onOrderCancel: undefined,
  onOrderFulfill: undefined,
  onOrderReturn: () => undefined,
  onPaymentCapture: undefined,
  onPaymentPaid: undefined,
  onPaymentRefund: undefined,
  onPaymentVoid: undefined,
  onProductClick: undefined,
  onProfileView: () => undefined,
  onShippingAddressEdit: undefined,
  onSubmit: () => undefined,
  order,
  errors: [],
  shop: shopFixture,
  saveButtonBarState: "default",
};

storiesOf("Views / Orders / Order details / payments", module)
  .addDecorator(Decorator)
  .add("pending", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ))
  .add("error", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ))
  .add("confirmed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      }}
    />
  ))
  .add("no payment", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: null,
      }}
    />
  ))
  .add("refunded", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED,
      }}
    />
  ))
  .add("rejected", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ));

storiesOf("Views / Orders / Order details / transactions", module)
  .addDecorator(Decorator)
  .add("preauthorized", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.preauthorized }}
    />
  ))
  .add("pending", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.pendingCharge }}
    />
  ))
  .add("success", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.chargeSuccess }}
    />
  ))
  .add("failed", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.chargeFail }}
    />
  ))
  .add("refund requested", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.refundRequested }}
    />
  ))
  .add("refund completed", () => (
    <OrderDetailsPage
      {...props}
      order={{ ...props.order, transactions: transactions.refundCompleted }}
    />
  ));

storiesOf("Views / Orders / Order details", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderDetailsPage {...props} />)
  .add("loading", () => <OrderDetailsPage {...props} order={undefined} />)
  .add("cancelled", () => (
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
  ))
  .add("fulfilled", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        status: OrderStatus.FULFILLED,
      }}
    />
  ))
  .add("partially fulfilled", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        status: OrderStatus.PARTIALLY_FULFILLED,
      }}
    />
  ))
  .add("unfulfilled", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        status: OrderStatus.UNFULFILLED,
      }}
    />
  ))
  .add("no shipping address", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        shippingAddress: null,
      }}
    />
  ))
  .add("no customer note", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        customerNote: "",
      }}
    />
  ));
