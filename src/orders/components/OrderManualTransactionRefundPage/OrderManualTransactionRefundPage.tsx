import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TransactionItemFragment } from "@dashboard/graphql";
import { ManualRefundForm } from "@dashboard/orders/components/OrderManualTransactionRefundPage/components/OrderManualTransactionRefundForm/manualRefundValidationSchema";
import {
  OrderTransactionReasonUi,
  RefundWithLinesOrderTransactionReason,
} from "@dashboard/orders/components/OrderTransactionRefundPage/components/OrderTransactionReason/RefundWithLinesOrderTransactionReason";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
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

const Reason = () => {
  const { control } = useFormContext<ManualRefundForm>();
  const { field } = useController({ name: "reason", control });

  return (
    <OrderTransactionReasonUi
      textAreaProps={{
        value: field.value,
        onChange: field.onChange,
      }}
    />
  );
};

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
        reason: "",
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
          <Box
            __maxWidth={400}
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <DashboardCard height="100%">
              <DashboardCard.Header>
                <DashboardCard.Title>
                  <FormattedMessage {...messages.refundAmount} />
                </DashboardCard.Title>
              </DashboardCard.Header>
              <DashboardCard.Content>
                <Box>
                  <Text as="p" paddingBottom={3}>
                    <FormattedMessage {...messages.amountDescription} />
                  </Text>
                  <OrderManualTransactionRefundAmount currency={currency} />
                </Box>
              </DashboardCard.Content>
            </DashboardCard>
            <Box marginTop="auto" marginBottom={3}>
              <Reason />
            </Box>
            <DashboardCard.Content>
              <OrderManualTransactionRefundWarning />
            </DashboardCard.Content>
          </Box>
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </OrderManualTransactionRefundForm>
  );
};
