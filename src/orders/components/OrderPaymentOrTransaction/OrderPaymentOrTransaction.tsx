import CardSpacer from "@dashboard/components/CardSpacer";
import { TransactionActionEnum } from "@dashboard/graphql/transactions";
import { useFlags } from "@dashboard/hooks/useFlags";
import {
  isOrderWithTransactions,
  OrderBothTypes,
  ShopBothTypes,
  ShopWithTransactions,
} from "@dashboard/orders/types";
import React from "react";

import OrderPayment from "../OrderPayment/OrderPayment";
import { OrderTransactionsWrapper } from "./OrderTransactionsWrapper";

interface OrderPaymentOrTransactionProps {
  order: OrderBothTypes;
  shop: ShopBothTypes;
  onTransactionAction(transactionId: string, actionType: TransactionActionEnum);
  onPaymentCapture();
  onPaymentPaid();
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
  onPaymentPaid,
  onPaymentVoid,
  onPaymentRefund,
  onMarkAsPaid,
  onAddManualTransaction,
}) => {
  const { orderTransactions } = useFlags(["orderTransactions"]);

  if (isOrderWithTransactions(order, orderTransactions.enabled)) {
    return (
      <OrderTransactionsWrapper
        order={order}
        shop={shop as ShopWithTransactions}
        onTransactionAction={onTransactionAction}
        onPaymentCapture={onPaymentCapture}
        onPaymentPaid={onPaymentPaid}
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
