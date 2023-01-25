import CardSpacer from "@dashboard/components/CardSpacer";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  TransactionActionEnum,
} from "@dashboard/graphql/transactions";
import { useFlags } from "@dashboard/hooks/useFlags";
import React from "react";

import OrderAddTransaction from "../OrderAddTransaction";
import { useStyles } from "../OrderDetailsPage/styles";
import OrderGrantedRefunds from "../OrderGrantedRefunds";
import OrderPayment from "../OrderPayment/OrderPayment";
import OrderPaymentSummaryCard from "../OrderPaymentSummaryCard";
import OrderSummaryCard from "../OrderSummaryCard";
import OrderTransaction from "../OrderTransaction";
import OrderTransactionGiftCard from "../OrderTransactionGiftCard";
import OrderTransactionPayment from "../OrderTransactionPayment";

interface OrderPaymentOrTransactionProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
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
  const classes = useStyles();

  const filteredPayments = React.useMemo(
    () =>
      (order?.payments ?? []).filter(
        payment => payment.isActive || payment.transactions.length > 0,
      ),
    [order?.payments],
  );

  if (orderTransactions.enabled) {
    return (
      <>
        <div className={classes.cardGrid}>
          <OrderSummaryCard order={order} />
          <OrderPaymentSummaryCard order={order} onMarkAsPaid={onPaymentPaid} />
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
