import { OrderStatus, TransactionActionEnum } from "@dashboard/graphql";
import { TransactionsApiButtons } from "@dashboard/orders/components/OrderSummary/TransactionsApiButtons";
import { OrderTransactionsSection } from "@dashboard/orders/components/OrderTransactionsSection/OrderTransactionsSection";
import { type ReactElement } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
import { noopOrderMutation } from "../operations/noopOrderMutation";
import { useCommonOrderOperations } from "../operations/useCommonOrderOperations";
import { useTransactionOrderOperations } from "../operations/useTransactionOrderOperations";
import { OrderNormalDetails } from "../OrderNormalDetails";
import { OrderUnconfirmedDetails } from "../OrderUnconfirmedDetails";
import { useOrderTransactionPolling } from "../useOrderTransactionPolling";

export interface TransactionOrderDetailsProps extends NonDraftOrderDetailsProps {
  startPolling: (interval: number) => void;
  stopPolling: () => void;
  refetch: () => Promise<unknown>;
}

/**
 * Transactions API order view.
 *
 * Owns transaction polling, the transactions section and the transaction
 * summary actions, and instantiates only common + transaction operation hooks —
 * never legacy capture/void hooks. The legacy props the shared lifecycle views
 * still require are filled with inert no-op mutations (T10 removes this once
 * those views are payment-neutral).
 *
 * T8: still delegates lifecycle rendering to the shared Normal/Unconfirmed
 * views. Must not call resolveOrderPaymentMode.
 */
export const TransactionOrderDetails = ({
  handlers,
  startPolling,
  stopPolling,
  refetch,
  ...context
}: TransactionOrderDetailsProps): ReactElement => {
  useOrderTransactionPolling({
    order: context.data?.order,
    startPolling,
    stopPolling,
    refetch,
  });

  const common = useCommonOrderOperations(handlers);
  const transaction = useTransactionOrderOperations(handlers);
  const order = context.data?.order;
  const { openModal } = context;

  const viewProps = {
    ...context,
    ...common,
    ...transaction,
    // Transaction orders never open legacy capture/void dialogs; inert
    // placeholders satisfy the shared views' prop contract without creating
    // legacy hooks.
    orderPaymentCapture: noopOrderMutation(),
    orderVoid: noopOrderMutation(),
    paymentActions: order ? (
      <TransactionsApiButtons order={order} onMarkAsPaid={() => openModal("mark-paid")} />
    ) : null,
    paymentSection: order ? (
      <OrderTransactionsSection
        order={order}
        shop={context.data?.shop}
        onTransactionAction={(transactionId, action) => {
          const dialog =
            action === TransactionActionEnum.CHARGE
              ? "transaction-charge-action"
              : "transaction-action";

          openModal(dialog, { type: action, id: transactionId, action: dialog });
        }}
        onAddManualTransaction={() => openModal("add-manual-transaction")}
        onRefundAdd={() => openModal("add-refund")}
      />
    ) : null,
  };

  return context.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...viewProps} />
  ) : (
    <OrderNormalDetails {...viewProps} />
  );
};
