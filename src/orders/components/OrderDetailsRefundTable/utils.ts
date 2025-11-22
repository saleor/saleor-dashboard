import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { OrderRefundDisplay } from "@dashboard/orders/utils/OrderRefundsViewModel";
import { IntlShape } from "react-intl";

import { refundGridMessages, refundStatuses } from "./messages";

export const getGrantedRefundStatusMessage = (
  status: OrderGrantedRefundStatusEnum,
  intl: IntlShape,
): string => {
  switch (status) {
    case "FAILURE":
      return intl.formatMessage(refundStatuses.failure);
    case "SUCCESS":
      return intl.formatMessage(refundStatuses.success);
    case "PENDING":
      return intl.formatMessage(refundStatuses.pending);
    case "NONE":
      return intl.formatMessage(refundStatuses.draft);
    default:
      const _exhaustiveCheck: never = status;

      return _exhaustiveCheck;
  }
};

const isRefundManual = (refund?: OrderRefundDisplay) => {
  if (!refund) {
    return false;
  }

  return refund.type === "manual";
};

const isRefundSuccessful = (refund?: OrderRefundDisplay) => {
  if (!refund) {
    return false;
  }

  return refund.status === "SUCCESS";
};

export const getNotEditableRefundMessage = (refund?: OrderRefundDisplay) => {
  if (isRefundManual(refund)) {
    return refundGridMessages.notEditableManual;
  }

  if (isRefundSuccessful(refund)) {
    return refundGridMessages.notEditableSuccessfully;
  }

  return refundGridMessages.notEditablePending;
};
