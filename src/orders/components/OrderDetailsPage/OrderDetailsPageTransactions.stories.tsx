// @ts-strict-ignore
import {
  GiftCardEventsEnum,
  OrderDetailsFragment,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import {
  grantedRefunds,
  order,
  ORDER_AMOUNT,
  prepareMoney,
  shop,
  transactions,
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
  onRefundAdd: () => undefined,
  onAddManualTransaction: () => undefined,
  order: order(null),
  errors: [],
  shop,
  saveButtonBarState: "default",
};

export default {
  title: "Orders / Order details / transactions",
};

export const Preauthorized = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: false,
      totalAuthorized: prepareMoney(),
      totalCharged: prepareMoney(0),
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      transactions: transactions.preauthorized,
    }}
  />
);

export const Pending = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: false,
      paymentStatus: PaymentChargeStatusEnum.PENDING,
      transactions: transactions.pendingCharge,
    }}
  />
);

export const Success = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      totalAuthorized: prepareMoney(0),
      totalCharged: prepareMoney(),
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      transactions: transactions.chargeSuccess,
    }}
  />
);

export const PartialCapture = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      totalAuthorized: prepareMoney(ORDER_AMOUNT - 10),
      totalCharged: prepareMoney(10),
      paymentStatus: PaymentChargeStatusEnum.PARTIALLY_CHARGED,
      transactions: transactions.chargePartial,
    }}
  />
);

export const Failed = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: false,
      paymentStatus: PaymentChargeStatusEnum.REFUSED,
      transactions: transactions.chargeFail,
    }}
  />
);

export const RefundRequested = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      totalAuthorized: prepareMoney(0),
      totalCharged: prepareMoney(),
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      transactions: transactions.refundRequested,
    }}
  />
);

export const RefundGranted = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      grantedRefunds,
      totalGrantedRefund: prepareMoney(),
      totalAuthorized: prepareMoney(0),
      totalCharged: prepareMoney(),
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      transactions: transactions.chargeSuccess,
    }}
  />
);

export const RefundCompleted = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      grantedRefunds,
      totalRefunded: prepareMoney(),
      totalAuthorized: prepareMoney(0),
      totalCharged: prepareMoney(0),
      paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED,
      transactions: transactions.refundCompleted,
    }}
  />
);

export const PartialRefundCompleted = () => (
  <OrderDetailsPage
    {...props}
    order={{
      ...props.order,
      isPaid: true,
      grantedRefunds,
      totalRefunded: prepareMoney(10),
      totalAuthorized: prepareMoney(0),
      totalCharged: prepareMoney(ORDER_AMOUNT - 10),
      paymentStatus: PaymentChargeStatusEnum.PARTIALLY_REFUNDED,
      transactions: transactions.refundPartial,
    }}
  />
);

export const PaidWithGiftcard = () => (
  <OrderDetailsPage
    {...props}
    order={
      {
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
      } as OrderDetailsFragment
    }
  />
);
