import { OrderStatus, TransactionActionEnum } from "@dashboard/graphql";
import { TransactionsApiButtons } from "@dashboard/orders/components/OrderSummary/TransactionsApiButtons";
import { OrderTransactionsSection } from "@dashboard/orders/components/OrderTransactionsSection/OrderTransactionsSection";
import {
  createTransactionRefundNavigationAdapter,
  OrderRefundNavigationProvider,
} from "@dashboard/orders/orderRefundNavigation";
import { type ReactElement, useMemo } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
import { useCommonOrderOperations } from "../operations/useCommonOrderOperations";
import { useTransactionOrderOperations } from "../operations/useTransactionOrderOperations";
import { OrderNormalDetails } from "../OrderNormalDetails";
import { OrderUnconfirmedDetails } from "../OrderUnconfirmedDetails";
import { useOrderTransactionPolling } from "../useOrderTransactionPolling";
import { TransactionPaymentDialogs } from "./TransactionPaymentDialogs";

export interface TransactionOrderDetailsProps extends NonDraftOrderDetailsProps {
  startPolling: (interval: number) => void;
  stopPolling: () => void;
  refetch: () => Promise<unknown>;
}

/**
 * Transactions API order view.
 *
 * Owns transaction polling, the transactions section, the transaction summary
 * actions, the transaction/manual-transaction/grant-refund dialogs and the
 * transaction refund destination, and instantiates only common + transaction
 * operation hooks — never legacy capture/void hooks.
 *
 * Lifecycle rendering is delegated to the payment-neutral Normal/Unconfirmed
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
  const { id, params, openModal, closeModal } = context;
  const refundNavigation = useMemo(
    () => (order ? createTransactionRefundNavigationAdapter(order) : null),
    [order],
  );

  const viewProps = {
    ...context,
    common,
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

  const view = (
    <>
      {order?.status === OrderStatus.UNCONFIRMED ? (
        <OrderUnconfirmedDetails {...viewProps} />
      ) : (
        <OrderNormalDetails {...viewProps} />
      )}
      {refundNavigation && (
        <TransactionPaymentDialogs
          orderId={id}
          order={order}
          params={params}
          onClose={closeModal}
          operations={transaction}
          refundNavigation={refundNavigation}
        />
      )}
    </>
  );

  if (!refundNavigation) {
    return view;
  }

  return (
    <OrderRefundNavigationProvider adapter={refundNavigation}>{view}</OrderRefundNavigationProvider>
  );
};
