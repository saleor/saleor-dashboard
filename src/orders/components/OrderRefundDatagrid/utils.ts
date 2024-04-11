import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { PillStatusType } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { refundStatuses } from "./messages";

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
