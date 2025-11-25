// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  TransactionActionEnum,
} from "@dashboard/graphql/types.generated";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import OrderAddTransaction from "../OrderAddTransaction";
import { OrderDetailsRefundTable } from "../OrderDetailsRefundTable/OrderDetailsRefundTable";
import OrderTransaction from "../OrderTransaction";
import OrderTransactionGiftCard from "../OrderTransactionGiftCard";
import OrderTransactionPayment from "../OrderTransactionPayment";
import { getFilteredPayments } from "./utils";

interface OrderTransactionsSectionProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => any;
  onPaymentCapture: () => any;
  onPaymentVoid: () => any;
  onAddManualTransaction: () => any;
  onRefundAdd: () => void;
}

export const OrderTransactionsSection = ({
  order,
  shop,
  onTransactionAction,
  onPaymentCapture,
  onPaymentVoid,
  onAddManualTransaction,
  onRefundAdd,
}: OrderTransactionsSectionProps): JSX.Element => {
  const filteredPayments = useMemo(() => getFilteredPayments(order), [order]);

  const hasAnyTransactions = [order?.transactions, filteredPayments, order?.giftCards].some(
    arr => arr?.length > 0,
  );

  return (
    <>
      <OrderDetailsRefundTable orderId={order?.id} order={order} onRefundAdd={onRefundAdd} />
      <CardSpacer />

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

        {order?.transactions?.map((transaction, index) => (
          <OrderTransaction
            key={transaction.id}
            transaction={{
              ...transaction,
              index,
            }}
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
