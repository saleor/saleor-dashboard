import {
  useOrderCaptureMutation,
  useOrderMarkAsPaidMutation,
  useOrderVoidMutation,
} from "@dashboard/graphql";

import { getMutationProviderData } from "../../../../misc";
import { type OrderOperationHandlers } from "./handlers";

/**
 * Legacy Payments API mutations. Instantiated only by LegacyOrderDetails, so
 * transaction orders never create capture/void hooks. Mark-as-paid is owned
 * here (legacy orders support it) rather than hidden in the common hook.
 */
export const useLegacyOrderOperations = (handlers: OrderOperationHandlers) => {
  const paymentCapture = useOrderCaptureMutation({ onCompleted: handlers.onPaymentCapture });
  const orderVoid = useOrderVoidMutation({ onCompleted: handlers.onOrderVoid });
  const markAsPaid = useOrderMarkAsPaidMutation({ onCompleted: handlers.onOrderMarkAsPaid });

  return {
    orderPaymentCapture: getMutationProviderData(...paymentCapture),
    orderVoid: getMutationProviderData(...orderVoid),
    orderPaymentMarkAsPaid: getMutationProviderData(...markAsPaid),
  };
};
