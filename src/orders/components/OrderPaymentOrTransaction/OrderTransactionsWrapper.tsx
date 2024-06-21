// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import { useFlag } from "@dashboard/featureFlags";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  TransactionActionEnum,
} from "@dashboard/graphql/types.generated";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import OrderAddTransaction from "../OrderAddTransaction";
import { useStyles } from "../OrderDetailsPage/styles";
import { OrderDetailsRefundTable } from "../OrderDetailsRefundTable/OrderDetailsRefundTable";
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
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => any;
  onPaymentCapture: () => any;
  onMarkAsPaid: () => any;
  onPaymentVoid: () => any;
  onAddManualTransaction: () => any;
  onRefundAdd: () => void;
}

export const OrderTransactionsWrapper: React.FC<OrderTransactionsWrapper> = ({
  order,
  shop,
  onTransactionAction,
  onPaymentCapture,
  onMarkAsPaid,
  onPaymentVoid,
  onAddManualTransaction,
  onRefundAdd,
}) => {
  const classes = useStyles();
  const filteredPayments = React.useMemo(() => getFilteredPayments(order), [order]);
  const { enabled } = useFlag("improved_refunds");

  const hasAnyTransactions = [order?.transactions, filteredPayments, order?.giftCards].some(
    arr => arr?.length > 0,
  );

  return (
    <>
      <div className={classes.cardGrid}>
        <OrderSummaryCard order={order} />
        <OrderPaymentSummaryCard order={order} onMarkAsPaid={onMarkAsPaid} />
      </div>
      <CardSpacer />
      <>
        {enabled && (
          <>
            <OrderDetailsRefundTable orderId={order?.id} order={order} onRefundAdd={onRefundAdd} />
            <CardSpacer />
          </>
        )}
        {order?.grantedRefunds?.length !== 0 && !enabled && (
          <>
            <OrderGrantedRefunds order={order} />
            <CardSpacer />
          </>
        )}
      </>

      <Box paddingTop={6}>
        <Box
          as="header"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingX={6}
        >
          <Text size={5} fontWeight="bold">
            <FormattedMessage defaultMessage="Transactions" id="/jJLYy" />
          </Text>
          <OrderAddTransaction order={order} onAddTransaction={onAddManualTransaction} />
        </Box>

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
          <OrderTransactionGiftCard key={giftCard.id} order={order} giftCard={giftCard} />
        ))}

        {!hasAnyTransactions && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text size={2} color="default2">
              <FormattedMessage
                defaultMessage="No transactions made for this order."
                description="empty state message"
                id="7QPLu0"
              />
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};
