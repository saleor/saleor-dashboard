import {
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundAddMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderTransactionRefundPage, {
  OrderTransactionRefundPageFormData,
} from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import React from "react";

interface OrderTransactionRefundCreateProps {
  orderId: string;
}

const OrderTransactionRefund: React.FC<OrderTransactionRefundCreateProps> = ({
  orderId,
}) => {
  //   const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();

  const { data, loading } = useOrderDetailsGrantRefundQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [createRefund, createRefundOpts] = useOrderGrantRefundAddMutation({
    onCompleted: submitData => {
      if (submitData?.orderGrantRefundCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: "Saved draft",
        });
        navigate(
          orderTransactionRefundEditUrl(
            orderId,
            submitData.orderGrantRefundCreate.grantedRefund!.id,
          ),
        );
      }
    },
  });

  const handleCreateRefund = async (
    submitData: OrderTransactionRefundPageFormData,
  ) => {
    if (!data?.order) {
      return;
    }
    const { amount, reason, linesToRefund, includeShipping, transactionId } =
      submitData;

    extractMutationErrors(
      createRefund({
        variables: {
          orderId,
          amount,
          reason,
          lines: linesToRefund.map(line => ({
            quantity: line.quantity,
            reason: line.reason,
            id: data.order!.lines[line.row].id,
          })),
          grantRefundForShipping: includeShipping,
          transactionId,
        },
      }),
    );
  };

  return (
    <OrderTransactionRefundPage
      disabled={loading}
      order={data?.order}
      onSaveDraft={handleCreateRefund}
      onSaveDraftState={createRefundOpts.status}
    />
  );
};

export default OrderTransactionRefund;
