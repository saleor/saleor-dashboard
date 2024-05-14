import {
  OrderDetailsGrantRefundDocument,
  OrderDetailsGrantRefundFragment,
  OrderGrantRefundUpdateErrorCode,
  OrderGrantRefundUpdateLineAddInput,
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundEditMutation,
  useOrderSendRefundForGrantedRefundMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderTransactionRefundPage, {
  OrderTransactionRefundError,
  OrderTransactionRefundPageFormData,
} from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { orderUrl } from "@dashboard/orders/urls";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { transactionRefundEditMessages } from "./messages";

interface OrderTransactionRefundProps {
  orderId: string;
  refundId: string;
}

const OrderTransactionRefund: React.FC<OrderTransactionRefundProps> = ({ orderId, refundId }) => {
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

  const [updateRefund, updateRefundOpts] = useOrderGrantRefundEditMutation({
    onCompleted: submitData => {
      if (submitData.orderGrantRefundUpdate?.errors.length === 0) {
        notify({
          status: "success",
          text: "Saved draft",
        });
        setLinesErrors([]);
      }
    },
    update(cache, { data }) {
      if (data?.orderGrantRefundUpdate?.errors?.length === 0) {
        cache.writeQuery({
          query: OrderDetailsGrantRefundDocument,
          data: {
            order: data.orderGrantRefundUpdate.order,
          },
        });
      }
    },
  });

  const handleUpdateRefund = async (submitData: OrderTransactionRefundPageFormData) => {
    if (!data?.order || !draftRefund) {
      return;
    }

    if (submitData.amount === 0) {
      setLinesErrors([
        {
          code: OrderGrantRefundUpdateErrorCode.REQUIRED,
          field: "amount",
          message: intl.formatMessage(transactionRefundEditMessages.noAmountError),
          lines: [],
        },
      ]);

      return;
    }

    const { amount, reason, linesToRefund, includeShipping, transactionId } = submitData;

    const draftRefundLines = draftRefund.lines ?? [];
    const toRemove = draftRefundLines.map(line => line.id);
    const toAdd = linesToRefund.reduce<OrderGrantRefundUpdateLineAddInput[]>((acc, line, ix) => {
      if (typeof line.quantity === "number" && line.quantity > 0) {
        acc.push({
          id: data.order!.lines[ix].id,
          quantity: line.quantity,
          reason: line.reason,
        });
      }

      return acc;
    }, []);

    const result = await updateRefund({
      variables: {
        refundId,
        amount,
        reason,
        addLines: toAdd,
        removeLines: toRemove,
        grantRefundForShipping: includeShipping,
        transactionId,
      },
    });

    const errors = result.data?.orderGrantRefundUpdate?.errors;

    if (errors?.length) {
      setLinesErrors(
        errors.map(err => ({
          code: err.code,
          field: err.field,
          message: err.message,
          lines: err.addLines,
        })) as OrderTransactionRefundError[],
      );
    }
  };

  const draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined =
    data?.order?.grantedRefunds.find(refund => refund.id === refundId);

  const [transferFunds, transferFundsOpts] = useOrderSendRefundForGrantedRefundMutation({
    onCompleted: submitData => {
      if (submitData.transactionRequestRefundForGrantedRefund?.errors.length === 0) {
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
      errors={linesErrors}
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
