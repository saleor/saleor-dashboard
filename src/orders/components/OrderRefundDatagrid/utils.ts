import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { PillStatusType } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { refundGridMessages, refundStatuses } from "./messages";
import { DatagridRefund } from "./refunds";

export const getGrantedRefundStatus = (
  status: OrderGrantedRefundStatusEnum,
): PillStatusType => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.FAILURE:
      return "error";
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return "success";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "info";
    case OrderGrantedRefundStatusEnum.NONE:
      return "warning";
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
};

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

  return !(
    isRefundSuccessful(refund) ||
    isRefundPending(refund) ||
    isRefundManual(refund)
  );
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
