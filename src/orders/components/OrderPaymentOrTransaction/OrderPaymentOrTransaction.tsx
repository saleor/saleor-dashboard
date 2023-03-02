import CardSpacer from "@dashboard/components/CardSpacer";
import { TransactionActionEnum } from "@dashboard/graphql/transactions";
import { useFlags } from "@dashboard/hooks/useFlags";
import {
  OrderBothTypes,
  orderChannelUseTransactions,
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
  const { orderTransactions } = useFlags(["orderTransactions"]);

  if (orderChannelUseTransactions(order, orderTransactions.enabled)) {
    return (
      <OrderTransactionsWrapper
        order={order}
        shop={shop as ShopWithTransactions}
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
