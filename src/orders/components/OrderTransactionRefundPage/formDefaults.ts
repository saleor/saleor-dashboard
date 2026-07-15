import { type OrderDetailsGrantRefundFragment, TransactionActionEnum } from "@dashboard/graphql";

import { type OrderTransactionRefundPageFormData } from "./OrderTransactionRefundPage";
import { getMaxQtyToRefund } from "./utils";

export const getRefundFormDefaultValues = ({
  order,
  draftRefund,
  prefilledOrderLineId,
}: {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
  prefilledOrderLineId?: string;
}) => {
  if (!draftRefund) {
    return getRefundCreateDefaultValues(order, prefilledOrderLineId);
  }

  return getRefundEditDefaultValues(order, draftRefund);
};

const getRefundCreateDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  prefilledOrderLineId?: string,
): OrderTransactionRefundPageFormData => ({
  linesToRefund: getRefundCreateOrderLinesToRefund(order, prefilledOrderLineId) ?? [],
  transactionId: getDefaultTransaction(order?.transactions) ?? "",
  includeShipping: false,
  amount: 0,
  reason: "",
  reasonReference: "",
});

const getRefundEditDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0],
): OrderTransactionRefundPageFormData => {
  return {
    linesToRefund: getRefundEditOrderLinesToRefund(order, draftRefund) ?? [],
    transactionId: draftRefund.transaction?.id ?? getDefaultTransaction(order?.transactions) ?? "",
    includeShipping: draftRefund.shippingCostsIncluded,
    amount: draftRefund.amount.amount,
    reason: draftRefund.reason ?? "",
    reasonReference: draftRefund.reasonReference?.id ?? "",
  };
};

export const getRefundEditOrderLinesToRefund = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
) => {
  return order?.lines.map(line => {
    const refundLine = draftRefund?.lines?.find(refundLine => refundLine.orderLine.id === line.id);

    if (refundLine) {
      return {
        quantity: refundLine.quantity,
        reason: refundLine.reason ?? "",
        reasonReference: refundLine.reasonReference?.id ?? "",
      };
    }

    return {
      quantity: "",
      reason: "",
      reasonReference: "",
    };
  });
};

const getRefundCreateOrderLinesToRefund = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  prefilledOrderLineId?: string,
) => {
  return order?.lines.map(line => {
    if (line.id !== prefilledOrderLineId) {
      return {
        quantity: "",
        reason: "",
        reasonReference: "",
      };
    }

    const maxQuantity = getMaxQtyToRefund({
      rowData: line,
      order,
      draftRefund: undefined,
    });

    return {
      quantity: maxQuantity > 0 ? maxQuantity : "",
      reason: "",
      reasonReference: "",
    };
  });
};

const getDefaultTransaction = (
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined,
) =>
  transactions?.find(transaction => transaction.actions.includes(TransactionActionEnum.REFUND))?.id;
