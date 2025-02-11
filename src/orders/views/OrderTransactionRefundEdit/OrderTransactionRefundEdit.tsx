import {
  OrderDetailsGrantRefundDocument,
  OrderDetailsGrantRefundFragment,
  OrderGrantRefundUpdateErrorCode,
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
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  checkAmountExceedsChargedAmount,
  handleAmountExceedsChargedAmount,
  prepareRefundAddLines,
} from "../OrderTransactionRefundCreate/handlers";
import { handleRefundEditComplete } from "./handlers";
import { transactionRefundEditMessages } from "./messages";

interface OrderTransactionRefundProps {
  orderId: string;
  refundId: string;
}

const OrderTransactionRefund = ({ orderId, refundId }: OrderTransactionRefundProps) => {
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
      handleRefundEditComplete({
        submitData,
        notify,
        setLinesErrors,
        intl,
        orderId,
      });
    },
    disableErrorHandling: true,
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

    const draftRefundLines = draftRefund.lines ?? [];
    const toRemove = draftRefundLines.map(line => line.id);
    const toAdd = prepareRefundAddLines({ linesToRefund, data });

    updateRefund({
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
