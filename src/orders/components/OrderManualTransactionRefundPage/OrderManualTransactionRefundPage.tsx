import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TransactionItemFragment } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderManualTransactionRefundAmount } from "./components/OrderManualTransactionRefundAmount";
import { OrderManualTransactionRefundForm } from "./components/OrderManualTransactionRefundForm";
import { OrderManualTransactionRefundTiles } from "./components/OrderManualTransactionRefundTiles";
import { OrderManualTransactionRefundWarning } from "./components/OrderManualTransactionRefundWarning/OrderManualTransactionRefundWarning";
import { messages } from "./messages";

interface OrderManualTransactionRefundProps {
  orderId: string;
  transactions: TransactionItemFragment[];
  loading: boolean;
  currency: string;
}

export const OrderManualTransactionRefundPage = ({
  orderId,
  transactions,
  currency,
  loading,
}: OrderManualTransactionRefundProps) => {
  const hasTransactionsToRefund = transactions.length > 0;

  return (
    <OrderManualTransactionRefundForm
      disabled={loading || !hasTransactionsToRefund}
      orderId={orderId}
      initialValues={{
        amount: 0,
        transationId: transactions?.[0]?.id ?? "",
      }}
      transactions={transactions}
    >
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav href={orderUrl(orderId)} title={<FormattedMessage {...messages.title} />} />

        <DetailPageLayout.Content>
          <DashboardCard>
            <DashboardCard.Content>
              <Text size={4} marginY={5} display="block" fontWeight="bold">
                <FormattedMessage {...messages.selectTransaction} />
              </Text>

              <OrderManualTransactionRefundTiles loading={loading} transactions={transactions} />
            </DashboardCard.Content>
          </DashboardCard>
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar>
          <Box __maxWidth={400}>
            <DashboardCard>
              <DashboardCard.Title>
                <FormattedMessage {...messages.refundAmount} />
              </DashboardCard.Title>
              <DashboardCard.Content>
                <OrderManualTransactionRefundWarning />
                <OrderManualTransactionRefundAmount currency={currency} />
              </DashboardCard.Content>
            </DashboardCard>
          </Box>
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </OrderManualTransactionRefundForm>
  );
};
