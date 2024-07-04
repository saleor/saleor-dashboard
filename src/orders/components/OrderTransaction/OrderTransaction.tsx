// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { TransactionActionEnum } from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import React from "react";

import { OrderTransactionCardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import { ExtendedOrderTransaction } from "./types";
import { getTransactionEvents } from "./utils";

export interface OrderTransactionProps {
  transaction: ExtendedOrderTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
  disabled?: boolean;
}

const OrderTransaction: React.FC<OrderTransactionProps> = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
  disabled = false,
}) => {
  const events = getTransactionEvents(transaction, fakeEvents);

  return (
    <DashboardCard
      // @ts-expect-error - there seems to be a TS bug when
      // `DashboardCard.Root` prop type is extended with `BoxProps`
      __opacity={disabled ? "0.6" : "1"}
      data-test-id="orderTransactionsList"
    >
      <DashboardCard.Title>
        <OrderTransactionCardTitle
          transaction={transaction}
          onTransactionAction={onTransactionAction}
          showActions={showActions}
        />
      </DashboardCard.Title>

      <DashboardCard.Content paddingX={0}>
        <TransactionEvents events={events} />
        {cardFooter}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderTransaction;
