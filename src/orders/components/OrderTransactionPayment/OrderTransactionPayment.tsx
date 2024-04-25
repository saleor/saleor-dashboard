// @ts-strict-ignore
import {
  OrderPaymentFragment,
  PaymentGatewayFragment,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { OrderTransactionProps } from "@dashboard/orders/components/OrderTransaction/OrderTransaction";
import { FakeTransaction } from "@dashboard/orders/types";
import { prepareMoney } from "@dashboard/orders/utils/data";
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
    name: findMethodName(payment.gateway, allPaymentMethods),
    actions: mapOrderActionsToTransactionActions(payment.actions),
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
    __typename: "FakeTransaction",
  };
  const handleTransactionAction: OrderTransactionProps["onTransactionAction"] = (_, action) => {
    if (action === TransactionActionEnum.CHARGE) {
      onCapture();
    }

    if (action === TransactionActionEnum.CANCEL) {
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
