import {
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
} from "@saleor/graphql";
import { OrderTransactionProps } from "@saleor/orders/components/OrderTransaction/OrderTransaction";
import { FakeTransaction } from "@saleor/orders/types";
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
  const fakeEvents = React.useMemo(
    () => mapPaymentToTransactionEvents(payment),
    [payment.transactions],
  );

  const transactionFromPayment: FakeTransaction = {
    id: payment.id,
    type: findMethodName(payment.gateway, allPaymentMethods),
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
    __typename: "FakeTransaction",
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
      fakeEvents={fakeEvents}
      onTransactionAction={handleTransactionAction}
    />
  );
};

export default OrderTransactionPayment;
