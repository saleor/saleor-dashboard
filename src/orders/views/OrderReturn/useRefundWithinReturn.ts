import {
  OrderDetailsFragment,
  OrderGrantRefundCreateErrorFragment,
  TransactionRequestRefundForGrantedRefundErrorFragment,
  useOrderGrantRefundAddWithOrderMutation,
  useOrderSendRefundForGrantedRefundMutation,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { extractMutationErrors } from "@dashboard/misc";
import { OrderReturnFormData } from "@dashboard/orders/components/OrderReturnPage/form";

interface UseReturnWithinReturnOpts {
  orderId: string;
  transactionId: string | undefined;
}
interface UseReturnWithinReturnResult {
  sendMutations: (formData: OrderReturnFormData) => SubmitPromise;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  grantRefundResponseOrderData: OrderDetailsFragment | null | undefined;
}

export function useReturnWithinReturn({
  orderId,
  transactionId,
}: UseReturnWithinReturnOpts): UseReturnWithinReturnResult {
  const [grantRefund, grantRefundOpts] =
    useOrderGrantRefundAddWithOrderMutation();

  const [sendRefund, sendRefundOpts] =
    useOrderSendRefundForGrantedRefundMutation();

  const sendMutations = async (formData: OrderReturnFormData) => {
    const grantRefundData = formData.autoGrantRefund
      ? await grantRefund({
          variables: {
            orderId,
            amount: formData.amount,
            reason: "",
            lines: [
              ...formData.fulfilledItemsQuantities.map(line => ({
                id: line.data.orderLineId,
                quantity: line.value,
              })),
              ...formData.unfulfilledItemsQuantities.map(({ id, value }) => ({
                id,
                quantity: value,
              })),
            ],
            grantRefundForShipping: formData.refundShipmentCosts,
          },
        })
      : null;

    const grantRefundErrors =
      grantRefundData?.data?.orderGrantRefundCreate?.errors ?? [];
    const grantedRefundId =
      grantRefundData?.data?.orderGrantRefundCreate?.grantedRefund?.id;
    const isSendRefund = grantedRefundId && formData.autoSendRefund;

    const sendRefundErrors =
      isSendRefund && transactionId
        ? await extractMutationErrors(
            sendRefund({
              variables: {
                transactionId,
                grantedRefundId,
              },
            }),
          )
        : [];

    return { grantRefundErrors, sendRefundErrors };
  };

  const grantRefundResponseOrderData =
    grantRefundOpts.data?.orderGrantRefundCreate?.order;

  return {
    sendMutations,
    grantRefundErrors:
      grantRefundOpts.data?.orderGrantRefundCreate?.errors ?? [],
    sendRefundErrors:
      sendRefundOpts.data?.transactionRequestRefundForGrantedRefund?.errors ??
      [],
    grantRefundResponseOrderData,
  };
}
