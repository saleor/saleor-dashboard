// @ts-strict-ignore
import { type OrderPaymentFragment, type PaymentGatewayFragment } from "@dashboard/graphql";
import OrderTransaction from "@dashboard/orders/components/OrderTransaction/OrderTransaction";
import { type FakeTransaction } from "@dashboard/orders/types";
import { prepareMoney } from "@dashboard/orders/utils/data";
import { useMemo } from "react";

import { findMethodName, getTransactionAmount, mapPaymentToTransactionEvents } from "./utils";

interface OrderTransactionPaymentProps {
  payment: OrderPaymentFragment;
  allPaymentMethods: PaymentGatewayFragment[];
}

/**
 * Read-only compatibility view of a historical legacy payment shown inside the
 * Transactions API view. It renders no actions on purpose: a transactions order
 * must not regain legacy capture/void mutation ownership through this adapter.
 */
const OrderTransactionPayment = ({ payment, allPaymentMethods }: OrderTransactionPaymentProps) => {
  const currency = payment.total.currency;
  const total = payment?.total?.amount ?? 0;
  const captured = payment?.capturedAmount?.amount ?? 0;
  const authorized = payment?.availableCaptureAmount?.amount ?? 0;
  const refunded = total - captured - authorized;

  const fakeEvents = useMemo(() => mapPaymentToTransactionEvents(payment), [payment.transactions]);
  const transactionFromPayment: FakeTransaction = {
    id: payment.id,
    name: findMethodName(payment.gateway, allPaymentMethods),
    actions: [],
    pspReference: "",
    externalUrl: null,
    chargedAmount: getTransactionAmount(payment.capturedAmount, currency),
    authorizedAmount: getTransactionAmount(payment.availableCaptureAmount, currency),
    refundedAmount: prepareMoney(refunded > 0 ? refunded : 0, currency),
    // Fake amounts
    refundPendingAmount: prepareMoney(0, currency),
    canceledAmount: prepareMoney(0, currency),
    authorizePendingAmount: prepareMoney(0, currency),
    chargePendingAmount: prepareMoney(0, currency),
    cancelPendingAmount: prepareMoney(0, currency),
    createdAt: fakeEvents[0]?.createdAt,
    createdBy: null,
    paymentMethodDetails: null,
    __typename: "FakeTransaction",
  };

  return (
    <OrderTransaction
      transaction={transactionFromPayment}
      fakeEvents={fakeEvents}
      onTransactionAction={() => undefined}
    />
  );
};

export default OrderTransactionPayment;
