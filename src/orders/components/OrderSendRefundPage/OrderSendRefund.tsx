import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Hr from "@dashboard/components/Hr";
import Skeleton from "@dashboard/components/Skeleton";
import {
  CreateManualTransactionRefundMutationVariables,
  OrderDetailsFragment,
} from "@dashboard/graphql/transactions";
import { orderUrl } from "@dashboard/orders/urls";
import { Card, CardContent } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { DataLine } from "./components/DataLine";
import { DataLineMoney } from "./components/DataLineMoney";
import { DataLineSettled } from "./components/DataLineSettled";
import { ManualRefundCard } from "./components/ManualRefundCard";
import { TransactionCard } from "./components/TransactionCard";
import { refundPageMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderSendRefundPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
  onAddManualRefund: (
    args: CreateManualTransactionRefundMutationVariables,
  ) => void;
  addManualRefundState: ConfirmButtonTransitionState;
  addManualRefundError: string | undefined;
}

const OrderSendRefundPage: React.FC<OrderSendRefundPageProps> = ({
  order,
  loading,
  onAddManualRefund,
  addManualRefundState,
  addManualRefundError,
}) => {
  const classes = useStyles();

  const currency = order?.totalBalance?.currency || "";
  const transactions = order?.transactions ?? [];

  return (
    <DetailedContent>
      <TopNav
        href={orderUrl(order?.id)}
        title={<FormattedMessage {...refundPageMessages.pageSubtitle} />}
      />
      <Content>
        {loading && transactions.length === 0 && (
          <>
            <Card>
              <CardContent className={classes.cardLoading} />
            </Card>
            <CardSpacer />
          </>
        )}
        {transactions.map(transaction => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            totalRemainingGrant={order?.totalRemainingGrant}
            orderId={order?.id}
          />
        ))}
        <ManualRefundCard
          currency={currency}
          submitState={addManualRefundState}
          error={addManualRefundError}
          onAddTransaction={({ amount, description, pspReference }) => {
            onAddManualRefund({
              currency,
              description,
              amount,
              orderId: order?.id,
              pspReference,
            });
          }}
        />
      </Content>
      <RightSidebar>
        <Card>
          <CardTitle
            title={<FormattedMessage {...refundPageMessages.refundBalance} />}
          />
          <CardContent>
            <ul className={classes.dataList}>
              <DataLine
                label={
                  <FormattedMessage {...refundPageMessages.totalCaptured} />
                }
              >
                <DataLineMoney money={order?.totalCharged} />
              </DataLine>
              <DataLine
                label={
                  <FormattedMessage {...refundPageMessages.grantedRefund} />
                }
              >
                <DataLineMoney money={order?.totalGrantedRefund} />
              </DataLine>
              <DataLine
                label={
                  <FormattedMessage {...refundPageMessages.pendingRefunds} />
                }
              >
                <DataLineMoney money={order?.totalRefundPending} />
              </DataLine>
            </ul>
          </CardContent>
          <Hr />
          <CardTitle
            title={
              <FormattedMessage {...refundPageMessages.balanceAfterRequests} />
            }
          />
          <CardContent>
            {loading && <Skeleton />}
            <ul className={classes.dataList}>
              {order?.transactions.map(transaction => (
                <DataLine label={transaction.type}>
                  <DataLineMoney money={transaction.refundedAmount} />
                </DataLine>
              ))}
              <DataLine
                label={<FormattedMessage {...refundPageMessages.result} />}
              >
                <DataLineSettled unsettledMoney={order?.totalRemainingGrant} />
              </DataLine>
            </ul>
          </CardContent>
        </Card>
      </RightSidebar>
    </DetailedContent>
  );
};

export default OrderSendRefundPage;
