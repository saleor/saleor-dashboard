// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { TransactionActionEnum } from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { ReactNode } from "react";

import { OrderTransactionCardTitle } from "./components";
import { TransactionEvents } from "./components/TransactionEvents";
import { ExtendedOrderTransaction } from "./types";
import { getTransactionEvents } from "./utils";

export interface OrderTransactionProps {
  transaction: ExtendedOrderTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => void;
  showActions?: boolean;
  cardFooter?: ReactNode;
  disabled?: boolean;
}

const OrderTransaction = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
  disabled = false,
}: OrderTransactionProps) => {
  const events = getTransactionEvents(transaction, fakeEvents);

  return (
    <DashboardCard __opacity={disabled ? "0.6" : "1"} data-test-id="orderTransactionsList">
      <DashboardCard.Header>
        <OrderTransactionCardTitle
          transaction={transaction}
          onTransactionAction={onTransactionAction}
          showActions={showActions}
        />
      </DashboardCard.Header>

      <DashboardCard.Content paddingX={0}>
        <TransactionEvents events={events} />
        {cardFooter}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderTransaction;
