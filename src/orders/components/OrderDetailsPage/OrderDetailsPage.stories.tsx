import placeholderImage from "@assets/images/placeholder60x60.png";
import {
  FulfillmentStatus,
  GiftCardEventsEnum,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@saleor/graphql";
import {
  grantedRefunds,
  order as orderFixture,
  ORDER_AMOUNT,
  payments,
  prepareMoney,
  shop as shopFixture,
  transactions,
} from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderDetailsPage, { OrderDetailsPageProps } from "./OrderDetailsPage";

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
  onPaymentVoid: undefined,
  onProductClick: undefined,
  onProfileView: () => undefined,
  onShippingAddressEdit: undefined,
  onSubmit: () => undefined,
  onAddManualTransaction: () => undefined,
  order,
  errors: [],
  shop: shopFixture,
  saveButtonBarState: "default",
};

storiesOf("Orders / Order details", module)
  .addDecorator(Decorator)
  .add("pending", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
        payments: [payments.pending],
      }}
    />
  ))
  .add("authorized", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
        payments: [payments.authorized],
      }}
    />
  ))
  .add("completed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
        payments: [payments.completed],
      }}
    />
  ))
  .add("no payment", () => (
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
  ))
  .add("refunded", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED,
        payments: [payments.refunded],
      }}
    />
  ))
  .add("partial refund", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
        payments: [payments.partialRefund],
      }}
    />
  ))
  .add("rejected", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
        payments: [payments.rejected],
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
  .add("refund granted", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        grantedRefunds,
        totalGrantedRefund: prepareMoney(),
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(),
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
        transactions: transactions.chargeSuccess,
      }}
    />
  ))
  .add("refund completed", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        grantedRefunds,
        totalRefunded: prepareMoney(),
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
        grantedRefunds,
        totalRefunded: prepareMoney(10),
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(ORDER_AMOUNT - 10),
        paymentStatus: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
        transactions: transactions.refundPartial,
      }}
    />
  ))
  .add("paid with giftcard", () => (
    <OrderDetailsPage
      {...props}
      order={{
        ...props.order,
        isPaid: true,
        transactions: [],
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
        // gift cards are treated as dicounts
        total: {
          net: prepareMoney(0),
          gross: prepareMoney(0),
          tax: prepareMoney(0),
          __typename: "TaxedMoney",
        },
        giftCards: [
          {
            __typename: "GiftCard",
            id: "R2lmdENhcmQ6Ng==",
            last4CodeChars: "43FA",
            events: [
              {
                __typename: "GiftCardEvent",
                id: "R2lmdENhcmRFdmVudDo1",
                type: GiftCardEventsEnum.ISSUED,
                orderId: null,
                date: "2022-09-20T13:00:42.676174+00:00",
                balance: {
                  __typename: "GiftCardEventBalance",
                  initialBalance: prepareMoney(),
                  currentBalance: prepareMoney(),
                  oldInitialBalance: null,
                  oldCurrentBalance: null,
                },
              },
              {
                __typename: "GiftCardEvent",
                id: "R2lmdENhcmRFdmVudDo2",
                type: GiftCardEventsEnum.USED_IN_ORDER,
                orderId: props.order.id,
                date: "2022-09-20T13:04:20.017419+00:00",
                balance: {
                  __typename: "GiftCardEventBalance",
                  initialBalance: null,
                  currentBalance: prepareMoney(0),
                  oldInitialBalance: null,
                  oldCurrentBalance: prepareMoney(),
                },
              },
            ],
          },
        ],
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
