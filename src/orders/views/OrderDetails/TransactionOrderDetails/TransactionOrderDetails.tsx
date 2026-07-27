import { OrderStatus } from "@dashboard/graphql";
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
 * Owns transaction polling and instantiates only common + transaction operation
 * hooks — never legacy capture/void hooks. The legacy props the shared lifecycle
 * views still require are filled with inert no-op mutations (T10 removes this
 * once those views are payment-neutral).
 *
 * T7: still delegates lifecycle rendering to the shared Normal/Unconfirmed
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

  const viewProps = {
    ...context,
    ...common,
    ...transaction,
    // Transaction orders never open legacy capture/void dialogs; inert
    // placeholders satisfy the shared views' prop contract without creating
    // legacy hooks.
    orderPaymentCapture: noopOrderMutation(),
    orderVoid: noopOrderMutation(),
  };

  return context.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...viewProps} />
  ) : (
    <OrderNormalDetails {...viewProps} />
  );
};
