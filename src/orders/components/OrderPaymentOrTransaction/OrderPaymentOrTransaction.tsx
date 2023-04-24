import CardSpacer from "@dashboard/components/CardSpacer";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { orderShouldUseTransactions } from "@dashboard/orders/types";
import React from "react";

import OrderPayment from "../OrderPayment/OrderPayment";
import { OrderTransactionsWrapper } from "./OrderTransactionsWrapper";

export interface OrderPaymentOrTransactionProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  onTransactionAction(transactionId: string, actionType: TransactionActionEnum);
  onPaymentCapture();
  onPaymentVoid();
  onPaymentRefund();
  onMarkAsPaid();
  onAddManualTransaction();
}

export const OrderPaymentOrTransaction: React.FC<
  OrderPaymentOrTransactionProps
> = ({
  order,
  shop,
  onTransactionAction,
  onPaymentCapture,
  onPaymentVoid,
  onPaymentRefund,
  onMarkAsPaid,
  onAddManualTransaction,
}) => {
  if (orderShouldUseTransactions(order)) {
    return (
      <OrderTransactionsWrapper
        order={order}
        shop={shop}
        onTransactionAction={onTransactionAction}
        onPaymentCapture={onPaymentCapture}
        onMarkAsPaid={onMarkAsPaid}
        onPaymentVoid={onPaymentVoid}
        onAddManualTransaction={onAddManualTransaction}
      />
    );
  }

  return (
    <>
      <OrderPayment
        order={order}
        onCapture={onPaymentCapture}
        onMarkAsPaid={onMarkAsPaid}
        onRefund={onPaymentRefund}
        onVoid={onPaymentVoid}
      />
      <CardSpacer />
    </>
  );
};
