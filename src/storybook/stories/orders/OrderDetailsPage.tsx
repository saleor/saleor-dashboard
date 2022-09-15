import placeholderImage from "@assets/images/placeholder60x60.png";
import {
  FulfillmentStatus,
  OrderAction,
  OrderDetailsFragment,
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
  ORDER_AMOUNT,
  prepareMoney,
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

const getLegacyPaymentsOrder = (
  actions: OrderAction[] = [],
): OrderDetailsFragment => ({
  ...props.order,
  transactions: [],
  payments: [{ __typename: "Payment", actions, id: "HFDDSVCGFGFHFD654DFDS" }],
});

storiesOf("Views / Orders / Order details / payments", module)
  .addDecorator(Decorator)
  .add("pending", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...getLegacyPaymentsOrder(),
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ))
  .add("error", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...getLegacyPaymentsOrder([OrderAction.CAPTURE]),
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ))
  .add("confirmed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...getLegacyPaymentsOrder([OrderAction.REFUND]),
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
        ...getLegacyPaymentsOrder([OrderAction.CAPTURE]),
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      }}
    />
  ));

storiesOf("Views / Orders / Order details / transactions", module)
  .addDecorator(Decorator)
  .add("preauthorized", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: false,
        totalAuthorized: prepareMoney(),
        totalCaptured: prepareMoney(0),
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
        transactions: transactions.preauthorized,
      }}
    />
  ))
  .add("pending", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: false,
        paymentStatus: PaymentChargeStatusEnum.PENDING,
        transactions: transactions.pendingCharge,
      }}
    />
  ))
  .add("success", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(),
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
        transactions: transactions.chargeSuccess,
      }}
    />
  ))
  .add("partial capture", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        totalAuthorized: prepareMoney(ORDER_AMOUNT - 10),
        totalCaptured: prepareMoney(10),
        paymentStatus: PaymentChargeStatusEnum.PARTIALLY_CHARGED,
        transactions: transactions.chargePartial,
      }}
    />
  ))
  .add("failed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: false,
        paymentStatus: PaymentChargeStatusEnum.REFUSED,
        transactions: transactions.chargeFail,
      }}
    />
  ))
  .add("refund requested", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(),
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
        transactions: transactions.refundRequested,
      }}
    />
  ))
  .add("refund completed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(0),
        paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED,
        transactions: transactions.refundCompleted,
      }}
    />
  ))
  .add("partial refund completed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(ORDER_AMOUNT - 10),
        paymentStatus: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
        transactions: transactions.refundPartial,
      }}
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
