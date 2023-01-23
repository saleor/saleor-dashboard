import {
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import { OrderTransactionProps } from "@dashboard/orders/components/OrderTransaction/OrderTransaction";
import React from "react";

import OrderTransaction from "../OrderTransaction/OrderTransaction";
import {
  findMethodName,
  getTransactionAmount,
  mapOrderActionsToTransactionActions,
  mapPaymentToTransactionEvents,
} from "./utils";

interface OrderTransactionPaymentProps {
  payment: OrderPaymentFragment;
  allPaymentMethods: PaymentGatewayFragment[];
  onCapture: () => void;
  onVoid: () => void;
}

const OrderTransactionPayment: React.FC<OrderTransactionPaymentProps> = ({
  payment,
  allPaymentMethods,
  onCapture,
  onVoid,
}) => {
  const currency = payment.total.currency;
  const total = payment?.total?.amount ?? 0;
  const captured = payment?.capturedAmount?.amount ?? 0;
  const authorized = payment?.availableCaptureAmount?.amount ?? 0;

  const refunded = total - captured - authorized;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const events = React.useMemo(() => mapPaymentToTransactionEvents(payment), [
    payment.transactions,
  ]);

  const transactionFromPayment: TransactionItemFragment = {
    id: payment.id,
    type: findMethodName(payment.gateway, allPaymentMethods),
    events,
    actions: mapOrderActionsToTransactionActions(payment.actions),
    pspReference: "",
    status: "",
    externalUrl: null,
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

  const handleTransactionAction: OrderTransactionProps["onTransactionAction"] = (
    _,
    action,
  ) => {
    if (action === TransactionActionEnum.CHARGE) {
      onCapture();
    }
    if (action === TransactionActionEnum.VOID) {
      onVoid();
    }
  };

  return (
    <OrderTransaction
      transaction={transactionFromPayment}
      onTransactionAction={handleTransactionAction}
    />
  );
};

export default OrderTransactionPayment;
