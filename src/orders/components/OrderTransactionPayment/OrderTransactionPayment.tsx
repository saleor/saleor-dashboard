import {
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionItemFragment,
} from "@saleor/graphql";
import React from "react";

import OrderTransaction from "../OrderTransaction/OrderTransaction";
import {
  findMethodName,
  getTransactionAmount,
  mapTransactionsToEvents,
} from "./utils";

interface OrderTransactionPaymentProps {
  payment: OrderPaymentFragment;
  allPaymentMethods: PaymentGatewayFragment[];
}

const OrderTransactionPayment: React.FC<OrderTransactionPaymentProps> = ({
  payment,
  allPaymentMethods,
}) => {
  const currency = payment.total.currency;
  const total = payment?.total?.amount ?? 0;
  const captured = payment?.capturedAmount?.amount ?? 0;
  const authorized = payment?.availableCaptureAmount?.amount ?? 0;

  const refunded = total - captured - authorized;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const events = React.useMemo(() => mapTransactionsToEvents(payment), [
    payment.transactions,
  ]);

  const transactionFromPayment: TransactionItemFragment = {
    id: payment.id,
    type: findMethodName(payment.gateway, allPaymentMethods),
    events,
    actions: [], // TODO: Add support for payment actions (?) - handled in order actions for now
    reference: "",
    chargedAmount: getTransactionAmount(payment.capturedAmount, currency),
    authorizedAmount: getTransactionAmount(
      payment.availableCaptureAmount,
      currency,
    ),
    refundedAmount: {
      currency,
      amount: refunded > 0 ? refunded : 0,
      __typename: "Money",
    },
    __typename: "TransactionItem",
  };

  console.dir(payment);
  console.dir(transactionFromPayment);
  return (
    <OrderTransaction
      transaction={transactionFromPayment}
      onTransactionAction={() => undefined} // TODO: Add support for payment actions
    />
  );
};

export default OrderTransactionPayment;
