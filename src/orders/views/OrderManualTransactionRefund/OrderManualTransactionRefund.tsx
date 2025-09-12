import { useOrderTransactionsDataQuery } from "@dashboard/graphql";
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

  return (
    <OrderManualTransactionRefundPage
      orderId={data?.order?.id ?? ""}
      transactions={data?.order?.transactions ?? []}
      loading={loading}
      currency={data?.order?.total?.gross?.currency ?? ""}
    />
  );
};

export default OrderManualTransactionRefund;
