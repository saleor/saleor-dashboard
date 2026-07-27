import { OrderStatus } from "@dashboard/graphql";
import { type ReactElement } from "react";

import { type NonDraftOrderDetailsProps } from "../nonDraftOrderDetailsProps";
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
 * Owns transaction polling: it is the React seam that keeps polling off for
 * legacy and draft orders (they never mount this component). No payment-mode
 * flag is passed to the polling hook.
 *
 * T5/T6: still delegates lifecycle rendering to the shared Normal/Unconfirmed
 * views. Remaining transaction ownership (dialogs, transactions section) moves
 * here in T7–T10. Must not call resolveOrderPaymentMode.
 */
export const TransactionOrderDetails = ({
  startPolling,
  stopPolling,
  refetch,
  ...props
}: TransactionOrderDetailsProps): ReactElement => {
  useOrderTransactionPolling({
    order: props.data?.order,
    startPolling,
    stopPolling,
    refetch,
  });

  return props.data?.order?.status === OrderStatus.UNCONFIRMED ? (
    <OrderUnconfirmedDetails {...props} />
  ) : (
    <OrderNormalDetails {...props} />
  );
};
