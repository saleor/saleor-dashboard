import {
  OrderTransactionRequestActionMutation,
  TransactionActionEnum,
  useOrderTransactionRequestActionMutation,
  useOrderTransationsDataQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { OrderManualTransationRefundPage } from "@dashboard/orders/components/OrderManualTransationRefundPage";
import { orderUrl } from "@dashboard/orders/urls";
import {
  getOrderTransactionErrorMessage,
  transactionRequestMessages,
} from "@dashboard/utils/errors/transaction";
import React from "react";
import { useIntl } from "react-intl";

import { filterRefundTransactions } from "./filter";

interface OrderManualTransationRefundProps {
  orderId: string;
}

const OrderManualTransationRefund = ({
  orderId,
}: OrderManualTransationRefundProps) => {
  const notify = useNotifier();
  const navigate = useNavigator();
  const intl = useIntl();

  const { data, loading } = useOrderTransationsDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  const [manualRefund, manualRefundOpts] =
    useOrderTransactionRequestActionMutation({
      onCompleted: (data: OrderTransactionRequestActionMutation) => {
        if (data.transactionRequestAction?.errors?.length) {
          notify({
            status: "error",
            text: getOrderTransactionErrorMessage(
              data.transactionRequestAction?.errors[0],
              intl,
            ),
          });
        } else {
          notify({
            status: "success",
            text: intl.formatMessage(transactionRequestMessages.success),
          });
          navigate(orderUrl(orderId));
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
      orderId={data?.order?.id ?? ""}
      transactions={filterRefundTransactions(data?.order?.transactions ?? [])}
      loading={loading}
      submitLoading={manualRefundOpts.loading}
      onSubmit={handleSubmit}
      currency={data?.order?.total?.gross?.currency ?? ""}
    />
  );
};

export default OrderManualTransationRefund;
