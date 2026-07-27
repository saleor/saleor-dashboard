import {
  useCreateManualTransactionCaptureMutation,
  useOrderMarkAsPaidMutation,
  useOrderTransactionRequestActionMutation,
} from "@dashboard/graphql";

import { getMutationProviderData } from "../../../../misc";
import { type OrderOperationHandlers } from "./handlers";

/**
 * Transactions API mutations. Instantiated only by TransactionOrderDetails, so
 * legacy orders never create transaction-request / manual-transaction hooks.
 * Mark-as-paid is owned here (transaction orders support it) rather than hidden
 * in the common hook.
 */
export const useTransactionOrderOperations = (handlers: OrderOperationHandlers) => {
  const transactionActionSend = useOrderTransactionRequestActionMutation({
    onCompleted: handlers.onTransactionActionSend,
  });
  const addManualTransaction = useCreateManualTransactionCaptureMutation({
    onCompleted: handlers.onManualTransactionAdded,
  });
  const markAsPaid = useOrderMarkAsPaidMutation({ onCompleted: handlers.onOrderMarkAsPaid });

  return {
    orderTransactionAction: getMutationProviderData(...transactionActionSend),
    orderAddManualTransaction: getMutationProviderData(...addManualTransaction),
    orderPaymentMarkAsPaid: getMutationProviderData(...markAsPaid),
  };
};
