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
  sendMutations: (formData: OrderReturnFormData, order: OrderDetailsFragment) => SubmitPromise;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  grantRefundResponseOrderData: OrderDetailsFragment | null | undefined;
}

export interface GrantRefundInputLine {
  id: string;
  quantity: number;
  reason?: string | null;
  reasonReference?: string | null;
}

function buildFulfillmentLineReasonMap(order: OrderDetailsFragment) {
  const map: Record<string, { reason: string | null; reasonReference: string | null }> = {};

  for (const fulfillment of order.fulfillments) {
    if (!fulfillment.lines) continue;

    for (const line of fulfillment.lines) {
      map[line.id] = {
        reason: line.reason,
        reasonReference: line.reasonReference?.id ?? null,
      };
    }
  }

  return map;
}

function getFulfillmentRootReason(
  order: OrderDetailsFragment,
  fulfillmentLineIds: string[],
): { reason: string | null; reasonReference: string | null } | undefined {
  for (const fulfillment of order.fulfillments) {
    if (!fulfillment.lines) continue;

    const hasReturnedLine = fulfillment.lines.some(line => fulfillmentLineIds.includes(line.id));

    if (hasReturnedLine && (fulfillment.reason || fulfillment.reasonReference)) {
      return {
        reason: fulfillment.reason,
        reasonReference: fulfillment.reasonReference?.id ?? null,
      };
    }
  }

  return undefined;
}

export function useRefundWithinReturn({
  orderId,
  transactionId,
}: UseReturnWithinReturnOpts): UseReturnWithinReturnResult {
  const [grantRefund, grantRefundOpts] = useOrderGrantRefundAddWithOrderMutation();
  const [sendRefund, sendRefundOpts] = useOrderSendRefundForGrantedRefundMutation();
  const sendMutations = async (formData: OrderReturnFormData, order: OrderDetailsFragment) => {
    const lineReasonMap = buildFulfillmentLineReasonMap(order);
    const returnedFulfillmentLineIds = formData.fulfilledItemsQuantities
      .filter(line => line.value > 0)
      .map(line => line.id);
    const fulfillmentRootReason = getFulfillmentRootReason(order, returnedFulfillmentLineIds);

    const grantRefundData = formData.autoGrantRefund
      ? await grantRefund({
          variables: {
            orderId,
            amount: formData.amount,
            transactionId: formData.transactionId,
            reason: formData.reason || fulfillmentRootReason?.reason || "",
            reasonReferenceId:
              formData.reasonReference || fulfillmentRootReason?.reasonReference || undefined,
            lines: squashLines([
              ...formData.fulfilledItemsQuantities.map(line => ({
                id: line.data.orderLineId,
                quantity: line.value,
                reason:
                  formData.lineReasons[line.id]?.reason ||
                  lineReasonMap[line.id]?.reason ||
                  undefined,
                reasonReference:
                  formData.lineReasons[line.id]?.reasonReference ||
                  lineReasonMap[line.id]?.reasonReference ||
                  undefined,
              })),
              ...formData.unfulfilledItemsQuantities.map(({ id, value }) => ({
                id,
                quantity: value,
                reason: formData.lineReasons[id]?.reason || undefined,
                reasonReference: formData.lineReasons[id]?.reasonReference || undefined,
              })),
            ]),
            grantRefundForShipping: formData.refundShipmentCosts,
          },
        })
      : null;
    const grantRefundErrors = grantRefundData?.data?.orderGrantRefundCreate?.errors ?? [];
    const grantedRefundId = grantRefundData?.data?.orderGrantRefundCreate?.grantedRefund?.id;
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
  const grantRefundResponseOrderData = grantRefundOpts.data?.orderGrantRefundCreate?.order;

  return {
    sendMutations,
    grantRefundErrors: grantRefundOpts.data?.orderGrantRefundCreate?.errors ?? [],
    sendRefundErrors: sendRefundOpts.data?.transactionRequestRefundForGrantedRefund?.errors ?? [],
    grantRefundResponseOrderData,
  };
}

export const squashLines = (items: GrantRefundInputLine[]): GrantRefundInputLine[] =>
  Object.values(
    items.reduce<Record<string, GrantRefundInputLine>>(
      (acc, item) => ({
        ...acc,
        [item.id]: acc[item.id]
          ? {
              ...item,
              quantity: acc[item.id].quantity + item.quantity,
              reason: acc[item.id].reason || item.reason,
              reasonReference: acc[item.id].reasonReference || item.reasonReference,
            }
          : item,
      }),
      {},
    ),
  );
