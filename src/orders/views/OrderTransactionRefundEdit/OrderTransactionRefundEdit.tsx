import {
  OrderDetailsGrantRefundFragment,
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundEditMutation,
  useOrderSendRefundForGrantedRefundMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderTransactionRefundPage, {
  OrderTransactionRefundPageFormData,
} from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";

interface OrderTransactionRefundProps {
  orderId: string;
  refundId: string;
}

const OrderTransactionRefund: React.FC<OrderTransactionRefundProps> = ({
  orderId,
  refundId,
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

  const [updateRefund, updateRefundOpts] = useOrderGrantRefundEditMutation({
    onCompleted: submitData => {
      if (submitData.orderGrantRefundUpdate?.errors.length === 0) {
        notify({
          status: "success",
          text: "Saved draft",
        });
      }
    },
  });

  const handleUpdateRefund = async (
    submitData: OrderTransactionRefundPageFormData,
  ) => {
    if (!data?.order) {
      return;
    }
    const { amount, reason, qtyToRefund, includeShipping, transactionId } =
      submitData;

    extractMutationErrors(
      updateRefund({
        variables: {
          refundId,
          amount,
          reason,
          addLines: qtyToRefund.map(qty => ({
            quantity: qty.value,
            id: data.order!.lines[qty.row].id,
          })),
          grantRefundForShipping: includeShipping,
          transactionId,
        },
      }),
    );
  };

  const draftRefund:
    | OrderDetailsGrantRefundFragment["grantedRefunds"][0]
    | undefined = data?.order?.grantedRefunds.find(
    refund => refund.id === refundId,
  );

  const [transferFunds, transferFundsOpts] =
    useOrderSendRefundForGrantedRefundMutation({
      onCompleted: submitData => {
        if (
          submitData.transactionRequestRefundForGrantedRefund?.errors.length ===
          0
        ) {
          notify({
            status: "success",
            text: "Refund has been sent",
          });
          navigate(orderUrl(orderId));
        }
      },
    });

  const handleTransferFunds = async () => {
    if (!draftRefund?.transaction) {
      return;
    }
    extractMutationErrors(
      transferFunds({
        variables: {
          transactionId: draftRefund.transaction?.id,
          grantedRefundId: refundId,
        },
      }),
    );
  };

  return (
    <OrderTransactionRefundPage
      disabled={loading}
      order={data?.order}
      draftRefund={draftRefund}
      onSaveDraft={handleUpdateRefund}
      onTransferFunds={handleTransferFunds}
      onSaveDraftState={updateRefundOpts.status}
      onTransferFundsState={transferFundsOpts.status}
    />
  );
};

export default OrderTransactionRefund;
