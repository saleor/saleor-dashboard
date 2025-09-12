import { useOrderTransactionsDataQuery, useRefundSettingsQuery } from "@dashboard/graphql";
import { OrderManualTransactionRefundPage } from "@dashboard/orders/components/OrderManualTransactionRefundPage";

interface OrderManualTransactionRefundProps {
  orderId: string;
}

const OrderManualTransactionRefund = ({ orderId }: OrderManualTransactionRefundProps) => {
  const { data, loading } = useOrderTransactionsDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  const { data: refundSettings, loading: refundSettingsLoading } = useRefundSettingsQuery();
  const requiredModelForRefundReason = refundSettings?.refundSettings.reasonReferenceType;

  return (
    <OrderManualTransactionRefundPage
      orderId={data?.order?.id ?? ""}
      transactions={data?.order?.transactions ?? []}
      loading={loading || refundSettingsLoading}
      currency={data?.order?.total?.gross?.currency ?? ""}
      modelForRefundReasonRefId={requiredModelForRefundReason?.id ?? null}
    />
  );
};

export default OrderManualTransactionRefund;
