import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  OrderDetailsWithMetadataDocument,
  PermissionEnum,
  useOrderSendRefundMutation,
} from "@dashboard/graphql";

interface OrderSendRefundProps {
  transactionId: string;
  orderId: string;
  amount: number;
}

export const useOrderSendRefund = ({ transactionId, orderId, amount }: OrderSendRefundProps) => {
  const user = useUser();
  const hasManageProducts = hasPermissions(user?.user?.userPermissions ?? [], [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);
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
