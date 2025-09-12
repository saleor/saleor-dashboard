import {
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundAddMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import OrderTransactionRefundPage, {
  OrderTransactionRefundError,
  OrderTransactionRefundPageFormData,
} from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  checkAmountExceedsChargedAmount,
  handleAmountExceedsChargedAmount,
  handleRefundCreateComplete,
  prepareRefundAddLines,
} from "./handlers";

interface OrderTransactionRefundCreateProps {
  orderId: string;
}

const OrderTransactionRefund = ({ orderId }: OrderTransactionRefundCreateProps) => {
  const notify = useNotifier();
  const navigate = useNavigator();
  const intl = useIntl();

  const [linesErrors, setLinesErrors] = useState<OrderTransactionRefundError[]>([]);

  const { data, loading } = useOrderDetailsGrantRefundQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [createRefund, createRefundOpts] = useOrderGrantRefundAddMutation({
    onCompleted: submitData =>
      handleRefundCreateComplete({
        submitData,
        navigate,
        notify,
        setLinesErrors,
        intl,
        orderId,
      }),
    disableErrorHandling: true,
  });

  const handleCreateRefund = async (submitData: OrderTransactionRefundPageFormData) => {
    if (!data?.order) {
      return;
    }

    const { amount, reason, linesToRefund, includeShipping, transactionId } = submitData;

    if (
      checkAmountExceedsChargedAmount({
        amount,
        order: data.order,
        transactionId,
      })
    ) {
      handleAmountExceedsChargedAmount({ setLinesErrors, intl });

      return;
    }

    createRefund({
      variables: {
        orderId,
        amount,
        reason,
        lines: prepareRefundAddLines({ linesToRefund, data }),
        grantRefundForShipping: includeShipping,
        transactionId,
      },
    });
  };

  return (
    <OrderTransactionRefundPage
      disabled={loading}
      errors={linesErrors}
      order={data?.order}
      onSaveDraft={handleCreateRefund}
      onSaveDraftState={createRefundOpts.status}
    />
  );
};

export default OrderTransactionRefund;
