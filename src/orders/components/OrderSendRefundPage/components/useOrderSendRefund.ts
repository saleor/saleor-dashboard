import { OrderDetailsWithMetadataDocument, useOrderSendRefundMutation } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";

interface OrderSendRefundProps {
  transactionId: string;
  orderId: string;
  amount: number;
}

export const useOrderSendRefund = ({ transactionId, orderId, amount }: OrderSendRefundProps) => {
  const hasManageProducts = useHasManageProductsPermission();
  const [sendRefund, { status, loading, error, data }] = useOrderSendRefundMutation({
    refetchQueries: [
      {
        query: OrderDetailsWithMetadataDocument,
        variables: { id: orderId, hasManageProducts },
      },
    ],
    variables: {
      transactionId,
      amount,
    },
  });

  return {
    sendRefund,
    status,
    loading,
    error,
    data,
  };
};
