import { type OrderDetailsFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { OrderManualTransactionDialog } from "@dashboard/orders/components/OrderManualTransactionDialog";
import { OrderRefundDialog } from "@dashboard/orders/components/OrderRefundDialog/OrderRefundDialog";
import { OrderTransactionActionDialog } from "@dashboard/orders/components/OrderTransactionActionDialog/OrderTransactionActionDialog";
import { type OrderRefundNavigationAdapter } from "@dashboard/orders/orderRefundNavigation";
import { type ReactElement, useMemo } from "react";

import { OrderCaptureDialog } from "../../../components/OrderCaptureDialog/OrderCaptureDialog";
import { orderManualTransactionRefundUrl, type OrderUrlQueryParams } from "../../../urls";
import { MarkAsPaidDialog } from "../MarkAsPaidDialog";
import { type useTransactionOrderOperations } from "../operations/useTransactionOrderOperations";

interface TransactionPaymentDialogsProps {
  orderId: string;
  order: OrderDetailsFragment | null | undefined;
  params: OrderUrlQueryParams;
  onClose: () => void;
  operations: ReturnType<typeof useTransactionOrderOperations>;
  refundNavigation: OrderRefundNavigationAdapter;
}

/**
 * Transactions API dialogs. Only TransactionOrderDetails renders these, so a
 * legacy order can never open a transaction-action or grant-refund flow.
 */
export const TransactionPaymentDialogs = ({
  orderId,
  order,
  params,
  onClose,
  operations,
  refundNavigation,
}: TransactionPaymentDialogsProps): ReactElement => {
  const navigate = useNavigator();
  const { orderTransactionAction, orderAddManualTransaction, orderPaymentMarkAsPaid } = operations;
  const selectedTransaction = useMemo(
    () => order?.transactions?.find(transaction => transaction.id === params.id),
    [order?.transactions, params.id],
  );
  // A transaction action always targets a specific transaction with a specific
  // action type; without both there is nothing to confirm.
  const transactionTarget =
    params.type && params.id ? { action: params.type, transactionId: params.id } : null;

  const currency = order?.totalBalance?.currency ?? "";

  return (
    <>
      <MarkAsPaidDialog
        orderId={orderId}
        open={params.action === "mark-paid"}
        onClose={onClose}
        mutation={orderPaymentMarkAsPaid}
      />
      {/* Transaction Capture Dialog - for CHARGE action */}
      {params.action === "transaction-charge-action" &&
        order &&
        selectedTransaction &&
        transactionTarget && (
          <OrderCaptureDialog
            key={params.id}
            confirmButtonState={orderTransactionAction.opts.status}
            errors={orderTransactionAction.opts.data?.transactionRequestAction?.errors ?? []}
            orderTotal={order.total.gross}
            authorizedAmount={selectedTransaction.authorizedAmount}
            chargedAmount={selectedTransaction.chargedAmount}
            orderBalance={order.totalBalance}
            onClose={onClose}
            onSubmit={amount =>
              orderTransactionAction
                .mutate({ ...transactionTarget, amount })
                .finally(() => onClose())
            }
          />
        )}
      {/* Transaction Action Dialog - for other actions like CANCEL */}
      {transactionTarget && (
        <OrderTransactionActionDialog
          confirmButtonState={orderTransactionAction.opts.status}
          onClose={onClose}
          open={params.action === "transaction-action"}
          action={transactionTarget.action}
          onSubmit={() => orderTransactionAction.mutate(transactionTarget).finally(() => onClose())}
        />
      )}
      {order && (
        <OrderManualTransactionDialog
          dialogProps={{ open: params.action === "add-manual-transaction", onClose }}
          submitState={orderAddManualTransaction.opts.status}
          error={
            orderAddManualTransaction.opts?.error?.message ||
            orderAddManualTransaction.opts?.data?.transactionCreate?.errors?.[0]?.message ||
            undefined
          }
          currency={currency}
          onAddTransaction={({ amount, description, pspReference }) =>
            orderAddManualTransaction.mutate({
              currency,
              orderId,
              amount,
              description,
              pspReference,
            })
          }
        />
      )}
      <OrderRefundDialog
        open={params.action === "add-refund"}
        onClose={onClose}
        onStandardRefund={() => navigate(refundNavigation.getNavigation().url, { replace: true })}
        onManualRefund={() => navigate(orderManualTransactionRefundUrl(orderId), { replace: true })}
      />
    </>
  );
};
