import {
  OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { refundGridMessages, refundStatuses } from "./messages";
import { DatagridRefund } from "./refunds";

export const getGrantedRefundStatusMessage = (
  status: OrderGrantedRefundStatusEnum,
  intl: IntlShape,
): string => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.FAILURE:
      return intl.formatMessage(refundStatuses.failure);
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return intl.formatMessage(refundStatuses.success);
    case OrderGrantedRefundStatusEnum.PENDING:
      return intl.formatMessage(refundStatuses.pending);
    case OrderGrantedRefundStatusEnum.NONE:
      return intl.formatMessage(refundStatuses.draft);
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = status;

      return _exhaustiveCheck;
  }
};

const isRefundManual = (refund?: DatagridRefund) => {
  if (!refund) {
    return false;
  }

  return refund.type === "manual";
};

const isRefundSuccessful = (refund?: DatagridRefund) => {
  if (!refund) {
    return false;
  }

  return refund.status === OrderGrantedRefundStatusEnum.SUCCESS;
};

const isRefundPending = (refund?: DatagridRefund) => {
  if (!refund) {
    return false;
  }

  return refund.status === OrderGrantedRefundStatusEnum.PENDING;
};

export const isRefundEditable = (refund?: DatagridRefund) => {
  if (!refund) {
    return false;
  }

  return !(isRefundSuccessful(refund) || isRefundPending(refund) || isRefundManual(refund));
};

export const getNotEditabledRefundMessage = (refund?: DatagridRefund) => {
  if (isRefundManual(refund)) {
    return refundGridMessages.notEditableManual;
  }

  if (isRefundSuccessful(refund)) {
    return refundGridMessages.notEditableSuccessfully;
  }

  return refundGridMessages.notEditablePending;
};

interface CanAddRefund {
  canRefund: boolean;
  reason?: string;
}

export const canAddRefund = ({
  transactions,
  intl,
}: {
  transactions: OrderDetailsFragment["transactions"];
  intl: IntlShape;
}): CanAddRefund => {
  if (transactions.length === 0) {
    return {
      canRefund: false,
      reason: intl.formatMessage(refundGridMessages.noTransactionsToRefund),
    };
  }

  if (
    transactions.every(transaction => !transaction.actions.includes(TransactionActionEnum.REFUND))
  ) {
    return {
      canRefund: false,
      reason: intl.formatMessage(refundGridMessages.allTransactionsNonRefundable),
    };
  }

  return {
    canRefund: true,
  };
};
