import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, TransactionItemFragment, useModelsOfTypeQuery } from "@dashboard/graphql";
import { pageListUrl } from "@dashboard/modeling/urls";
import { ManualRefundForm } from "@dashboard/orders/components/OrderManualTransactionRefundPage/components/OrderManualTransactionRefundForm/manualRefundValidationSchema";
import { OrderTransactionReasonUi } from "@dashboard/orders/components/OrderTransactionRefundPage/components/OrderTransactionReason/RefundWithLinesOrderTransactionReason";
import { refundReasonSelectHelperMessages } from "@dashboard/orders/messages";
import { rippleNewRefundReasons } from "@dashboard/orders/ripples/newRefundReasons";
import { orderUrl } from "@dashboard/orders/urls";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Select, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

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

/**
 * This component can be written to be reused with Granted Refund, however, since we rewrite the Order page, it is not worth the effort now.
 * If edited before that time, remember to update both of them
 *
 */
const ModelsPicker = (props: { referenceModelTypeId: string; disabled: boolean }) => {
  const { control } = useFormContext<ManualRefundForm>();
  const { field } = useController({ name: "reasonReferenceId", control });
  const intl = useIntl();

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

  const optionsWithEmpty = [
    {
      value: "",
      label: intl.formatMessage({
        defaultMessage: "Select a reason type",
        id: "vSLaZ7",
      }),
    },
    ...options,
  ];

  return <Select {...field} disabled={props.disabled} options={optionsWithEmpty} />;
};

export const OrderManualTransactionRefundPage = ({
  orderId,
  transactions,
  currency,
  loading,
  modelForRefundReasonRefId,
}: OrderManualTransactionRefundProps) => {
  const intl = useIntl();
  const hasTransactionsToRefund = transactions.length > 0;

  const permissions = useUserPermissions();
  const canManageSettings = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_SETTINGS]);

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

            <Box marginBottom={12}>
              <DashboardCard>
                <DashboardCard.Header>
                  <DashboardCard.Title>Refund reason</DashboardCard.Title>
                  <Box marginLeft={4}>
                    <Ripple model={rippleNewRefundReasons} />
                  </Box>
                </DashboardCard.Header>
                <DashboardCard.Content>
                  <ModelsPicker
                    referenceModelTypeId={modelForRefundReasonRefId ?? ""}
                    disabled={!modelForRefundReasonRefId}
                  />
                  <Box marginTop={2}>
                    {canManageSettings && modelForRefundReasonRefId && (
                      <Link href={pageListUrl()}>
                        <Text color="inherit">
                          {intl.formatMessage(refundReasonSelectHelperMessages.manageReasons)}
                        </Text>
                      </Link>
                    )}
                    {canManageSettings && !modelForRefundReasonRefId && (
                      <Link href={refundsSettingsPath}>
                        <Text color="inherit">
                          {intl.formatMessage(
                            refundReasonSelectHelperMessages.enableReasonsInSettings,
                          )}
                        </Text>
                      </Link>
                    )}
                    {!canManageSettings && (
                      <Text color="default2">
                        {intl.formatMessage(refundReasonSelectHelperMessages.noPermissionsHint)}
                      </Text>
                    )}
                  </Box>
                </DashboardCard.Content>
              </DashboardCard>
            </Box>
            <Box marginBottom={"auto"}>
              <Reason />
            </Box>
            <DashboardCard.Content marginTop={4}>
              <OrderManualTransactionRefundWarning />
            </DashboardCard.Content>
          </Box>
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </OrderManualTransactionRefundForm>
  );
};
