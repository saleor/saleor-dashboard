import {
  OrderDetailsDocument,
  useCreateManualTransactionRefundMutation,
  useOrderDetailsQuery,
} from "@saleor/graphql/hooks.generated";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderSendRefundPage from "@saleor/orders/components/OrderSendRefundPage";
import { getTransactionCreateErrorMessage } from "@saleor/utils/errors/transaction";
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

const OrderSendRefund: React.FC<OrderSendRefund> = ({ orderId }) => {
  const intl = useIntl();
  const notify = useNotifier();

  const { data } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [
    createRefundTransaction,
    { status: createRefundStatus, error, data: createRefundData },
  ] = useCreateManualTransactionRefundMutation({
    refetchQueries: [
      { query: OrderDetailsDocument, variables: { id: orderId } },
    ],
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
      order={data?.order}
      onAddManualRefund={args => createRefundTransaction({ variables: args })}
      addManualRefundState={createRefundStatus}
      addManualRefundError={
        createRefundData?.transactionCreate?.errors?.[0]?.message ??
        error?.message
      }
    />
  );
};

export default OrderSendRefund;
