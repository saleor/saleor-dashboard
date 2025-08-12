import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TransactionItemFragment, useModelsOfTypeQuery } from "@dashboard/graphql";
import { ManualRefundForm } from "@dashboard/orders/components/OrderManualTransactionRefundPage/components/OrderManualTransactionRefundForm/manualRefundValidationSchema";
import { OrderTransactionReasonUi } from "@dashboard/orders/components/OrderTransactionRefundPage/components/OrderTransactionReason/RefundWithLinesOrderTransactionReason";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
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
  modelForRefundReasonRefId: string | null;
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

// todo extract to shared component with granted refund
const ModelsPicker = (props: { referenceModelTypeId: string }) => {
  const { control } = useFormContext<ManualRefundForm>();
  const { field } = useController({ name: "reasonReferenceId", control });

  // todo cache
  const { data, loading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: props.referenceModelTypeId,
    },
  });

  if (loading) {
    return <Skeleton />;
  }

  const options =
    data?.pages?.edges.map(model => ({
      value: model.node.id,
      label: model.node.title,
    })) ?? [];

  const optionsWithEmpty = [{ value: "", label: "Select a reason type" }, ...options];

  // how the hell this is working? todo
  return <Select {...field} options={optionsWithEmpty} />;
};

export const OrderManualTransactionRefundPage = ({
  orderId,
  transactions,
  currency,
  loading,
  modelForRefundReasonRefId,
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
        reasonReferenceId: "",
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
          <Box __maxWidth={400} height="100%" display="flex" flexDirection="column">
            <DashboardCard marginBottom={12}>
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

            {modelForRefundReasonRefId && (
              <Box marginBottom={12}>
                <DashboardCard>
                  <DashboardCard.Header>
                    <DashboardCard.Title>Refund reason type</DashboardCard.Title>
                  </DashboardCard.Header>
                  <DashboardCard.Content>
                    <ModelsPicker referenceModelTypeId={modelForRefundReasonRefId} />
                  </DashboardCard.Content>
                </DashboardCard>
              </Box>
            )}
            <Box marginBottom={"auto"}>
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
