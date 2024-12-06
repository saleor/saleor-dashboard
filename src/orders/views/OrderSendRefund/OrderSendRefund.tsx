// @ts-strict-ignore
import {
  OrderDetailsDocument,
  useCreateManualTransactionRefundMutation,
  useOrderDetailsQuery,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import OrderSendRefundPage from "@dashboard/orders/components/OrderSendRefundPage";
import { getTransactionCreateErrorMessage } from "@dashboard/utils/errors/transaction";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

interface OrderSendRefund {
  orderId: string;
}

const messages = defineMessages({
  successAddTransaction: {
    defaultMessage: "Manual refund was created successfully",
    id: "p1D4Ok",
    description: "order send refund, manual transaction refund was created",
  },
});
const OrderSendRefund = ({ orderId }: OrderSendRefund) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { data, loading } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });
  const [createRefundTransaction, { status: createRefundStatus, error, data: createRefundData }] =
    useCreateManualTransactionRefundMutation({
      refetchQueries: [{ query: OrderDetailsDocument, variables: { id: orderId } }],
      onCompleted: ({ transactionCreate: { errors } }) => {
        const isError = errors.length > 0;

        notify({
          status: isError ? "error" : "success",
          text: isError
            ? getTransactionCreateErrorMessage(errors[0], intl)
            : intl.formatMessage(messages.successAddTransaction),
        });
      },
    });

  return (
    <OrderSendRefundPage
      loading={loading}
      order={data?.order}
      onAddManualRefund={args => createRefundTransaction({ variables: args })}
      addManualRefundState={createRefundStatus}
      addManualRefundError={
        createRefundData?.transactionCreate?.errors?.[0]?.message ?? error?.message
      }
    />
  );
};

export default OrderSendRefund;
