import {
  OrderTransactionRequestActionMutation,
  TransactionActionEnum,
  useOrderManualRefundQuery,
  useOrderTransactionRequestActionMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { OrderManualTransationRefundPage } from "@dashboard/orders/components/OrderManualTransationRefundPage";
import {
  getOrderTransactionErrorMessage,
  transactionRequestMessages,
} from "@dashboard/utils/errors/transaction";
import React from "react";
import { useIntl } from "react-intl";

const OrderManualTransationRefund = ({ orderId }) => {
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useOrderManualRefundQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  const [manualRefund, manualRefundOpts] =
    useOrderTransactionRequestActionMutation({
      onCompleted: (data: OrderTransactionRequestActionMutation) => {
        const {
          transactionRequestAction: { errors },
        } = data;
        const isError = !!errors.length;

        if (isError) {
          notify({
            status: "error",
            text: getOrderTransactionErrorMessage(errors[0], intl),
          });
        } else {
          notify({
            status: "success",
            text: intl.formatMessage(transactionRequestMessages.success),
          });
        }
      },
    });

  const handleSubmit = (transactionId: string, amount: number) => {
    manualRefund({
      variables: {
        action: TransactionActionEnum.REFUND,
        transactionId,
        amount,
      },
    });
  };

  return (
    <OrderManualTransationRefundPage
      data={data}
      loading={loading}
      submitLoading={manualRefundOpts.loading}
      onSubmit={handleSubmit}
    />
  );
};

export default OrderManualTransationRefund;
