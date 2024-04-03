import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TransactionItemFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderManualTransationRefundAmount } from "./components/OrderManualTransationRefundAmount";
import { OrderManualTransationRefundForm } from "./components/OrderManualTransationRefundForm";
import { OrderTransactionTiles } from "./components/OrderTransactionTile";
import { messages } from "./messages";

interface OrderManualTransationRefundProps {
  orderId: string;
  transactions: TransactionItemFragment[];
  loading: boolean;
  currency: string;
  submitLoading: boolean;
  onSubmit: (transationId: string, amount: number) => void;
}

export const OrderManualTransationRefundPage = ({
  orderId,
  transactions,
  currency,
  loading,
  submitLoading,
  onSubmit,
}: OrderManualTransationRefundProps) => {
  const navigate = useNavigator();

  const onCancel = () => navigate(orderUrl(orderId));

  return (
    <OrderManualTransationRefundForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={submitLoading}
      initialValues={{
        amount: 0,
        transationId: transactions?.[0]?.id ?? "",
      }}
    >
      <DetailPageLayout gridTemplateColumns={1}>
        <TopNav
          href={orderUrl(orderId)}
          title={<FormattedMessage {...messages.transactions} />}
        />

        <DetailPageLayout.Content>
          <DashboardCard>
            <DashboardCard.Content>
              <Text size={4} marginY={5} display="block" fontWeight="bold">
                <FormattedMessage {...messages.selectTransation} />
              </Text>

              <OrderTransactionTiles
                loading={loading}
                transactions={transactions}
              />
            </DashboardCard.Content>
          </DashboardCard>
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar>
          <Box __maxWidth={400}>
            <DashboardCard>
              <DashboardCard.Title>
                <FormattedMessage {...messages.sidebarTitle} />
              </DashboardCard.Title>
              <DashboardCard.Content>
                <Text marginBottom={6} as="p">
                  <FormattedMessage {...messages.sidebardDescription} />
                </Text>

                <OrderManualTransationRefundAmount currency={currency} />
              </DashboardCard.Content>
            </DashboardCard>
          </Box>
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </OrderManualTransationRefundForm>
  );
};
