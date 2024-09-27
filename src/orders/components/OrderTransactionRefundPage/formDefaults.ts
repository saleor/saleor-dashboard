import { OrderDetailsGrantRefundFragment, TransactionActionEnum } from "@dashboard/graphql";

import { OrderTransactionRefundPageFormData } from "./OrderTransactionRefundPage";

export const getRefundFormDefaultValues = ({
  order,
  draftRefund,
}: {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
}) => {
  if (!draftRefund) {
    return getRefundCreateDefaultValues(order);
  }

  return getRefundEditDefaultValues(order, draftRefund);
};

const getRefundCreateDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
): OrderTransactionRefundPageFormData => ({
  linesToRefund: getRefundCreateOrderLinesToRefund(order) ?? [],
  transactionId: getDefaultTransaction(order?.transactions),
  includeShipping: false,
  amount: 0,
  reason: "",
});

const getRefundEditDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0],
): OrderTransactionRefundPageFormData => {
  return {
    linesToRefund: getRefundEditOrderLinesToRefund(order, draftRefund) ?? [],
    transactionId: draftRefund.transaction?.id ?? getDefaultTransaction(order?.transactions),
    includeShipping: draftRefund.shippingCostsIncluded,
    amount: draftRefund.amount.amount,
    reason: draftRefund.reason ?? "",
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
      };
    }

    return {
      quantity: "",
      reason: "",
    };
  });
};

const getRefundCreateOrderLinesToRefund = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
) => {
  return order?.lines.map(() => ({
    quantity: "",
    reason: "",
  }));
};

const getDefaultTransaction = (
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined,
) =>
  transactions?.find(transaction => transaction.actions.includes(TransactionActionEnum.REFUND))?.id;
