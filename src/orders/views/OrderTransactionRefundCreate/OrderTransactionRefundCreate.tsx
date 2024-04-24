import {
  OrderGrantRefundCreateErrorCode,
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundAddMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import OrderTransactionRefundPage, {
  OrderTransactionRefundError,
  OrderTransactionRefundPageFormData,
} from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import React, { useState } from "react";

interface OrderTransactionRefundCreateProps {
  orderId: string;
}

const OrderTransactionRefund: React.FC<OrderTransactionRefundCreateProps> = ({
  orderId,
}) => {
  const notify = useNotifier();
  const navigate = useNavigator();

  const [linesErrors, setLinesErrors] = useState<OrderTransactionRefundError[]>(
    [],
  );

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
      if (submitData?.orderGrantRefundCreate?.errors.length) {
        const { errors } = submitData.orderGrantRefundCreate;
        const errorLines: OrderTransactionRefundError[] = [];
        errors.forEach(err => {
          if (err.code !== OrderGrantRefundCreateErrorCode.REQUIRED) {
            notify({
              status: "error",
              text: err.message,
            });
          }

          errorLines.push({
            code: err.code,
            field: err.field,
            lines: err.lines,
            message: err.message,
          } as OrderTransactionRefundError);
        });

        setLinesErrors(errorLines);
      }
    },
    disableErrorHandling: true,
  });

  const handleCreateRefund = async (
    submitData: OrderTransactionRefundPageFormData,
  ) => {
    if (!data?.order) {
      return;
    }
    const { amount, reason, linesToRefund, includeShipping, transactionId } =
      submitData;

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
