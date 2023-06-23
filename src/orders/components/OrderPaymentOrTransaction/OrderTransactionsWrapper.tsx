// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  TransactionActionEnum,
} from "@dashboard/graphql/types.generated";
import React from "react";

import OrderAddTransaction from "../OrderAddTransaction";
import { useStyles } from "../OrderDetailsPage/styles";
import OrderGrantedRefunds from "../OrderGrantedRefunds";
import OrderPaymentSummaryCard from "../OrderPaymentSummaryCard";
import OrderSummaryCard from "../OrderSummaryCard";
import OrderTransaction from "../OrderTransaction";
import OrderTransactionGiftCard from "../OrderTransactionGiftCard";
import OrderTransactionPayment from "../OrderTransactionPayment";
import { getFilteredPayments } from "./utils";

interface OrderTransactionsWrapper {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  onTransactionAction(transactionId: string, actionType: TransactionActionEnum);
  onPaymentCapture();
  onMarkAsPaid();
  onPaymentVoid();
  onAddManualTransaction();
}

export const OrderTransactionsWrapper: React.FC<OrderTransactionsWrapper> = ({
  order,
  shop,
  onTransactionAction,
  onPaymentCapture,
  onMarkAsPaid,
  onPaymentVoid,
  onAddManualTransaction,
}) => {
  const classes = useStyles();

  const filteredPayments = React.useMemo(
    () => getFilteredPayments(order),
    [order],
  );
  return (
    <>
      <div className={classes.cardGrid}>
        <OrderSummaryCard order={order} />
        <OrderPaymentSummaryCard order={order} onMarkAsPaid={onMarkAsPaid} />
      </div>
      <CardSpacer />
      {order?.grantedRefunds?.length !== 0 ? (
        <>
          <OrderGrantedRefunds order={order} />
          <CardSpacer />
        </>
      ) : null}
      <div>
        {order?.transactions?.map(transaction => (
          <OrderTransaction
            key={transaction.id}
            transaction={transaction}
            onTransactionAction={onTransactionAction}
          />
        ))}
        {filteredPayments.map(payment => (
          <OrderTransactionPayment
            key={payment.id}
            payment={payment}
            allPaymentMethods={shop?.availablePaymentGateways}
            onCapture={onPaymentCapture}
            onVoid={onPaymentVoid}
          />
        ))}
        {order?.giftCards?.map(giftCard => (
          <OrderTransactionGiftCard
            key={giftCard.id}
            order={order}
            giftCard={giftCard}
          />
        ))}
      </div>
      <OrderAddTransaction
        order={order}
        onAddTransaction={onAddManualTransaction}
      />
    </>
  );
};
