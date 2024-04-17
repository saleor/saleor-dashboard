import {
  AppAvatarFragment,
  OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  StaffMemberAvatarFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { PillStatusType } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { refundGridMessages, refundStatuses } from "./messages";

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

export interface DatagridRefund {
  id: string;
  type: "standard" | "manual";
  status: OrderGrantedRefundStatusEnum;
  amount: {
    amount: number;
    currency: string;
  };
  reason: string | null;
  createdAt: string;
  user: {
    email: string;
  } | null;
}

const SUPPORTED_REFUNDS = new Set([
  TransactionEventTypeEnum.REFUND_SUCCESS,
  TransactionEventTypeEnum.REFUND_FAILURE,
]);

export const manualRefundsExtractor = (
  order: OrderDetailsFragment | undefined,
  intl: IntlShape,
): DatagridRefund[] | undefined => {
  // Extract all events from all transactions
  const events = order?.transactions.flatMap(transaction => transaction.events);

  // Filter for supported refund events
  const refundEvents = events?.filter(
    event => event.type && SUPPORTED_REFUNDS.has(event.type),
  );

  // Collect IDs of events associated with granted refunds
  const idsOfEventsAssociatedToGrantedRefunds = new Set(
    order?.grantedRefunds.flatMap(gr => gr.transactionEvents?.map(te => te.id)),
  );

  // Filter out refunds that are already granted
  const manualRefundEvents = refundEvents?.filter(
    event => !idsOfEventsAssociatedToGrantedRefunds.has(event.id),
  );

  // Map filtered events to DatagridRefund objects
  return manualRefundEvents?.map(event => ({
    id: event.id,
    type: "manual",
    status:
      event.type === "REFUND_SUCCESS"
        ? OrderGrantedRefundStatusEnum.SUCCESS
        : OrderGrantedRefundStatusEnum.FAILURE,
    amount: event.amount,
    createdAt: event.createdAt,
    user: {
      email: determineCreatorDisplay(event.createdBy),
    },
    reason: intl.formatMessage(refundGridMessages.manualRefund),
  }));
};

type RefundCreator = AppAvatarFragment | StaffMemberAvatarFragment;

function determineCreatorDisplay(creator: RefundCreator | null): string {
  if (creator?.__typename === "User") {
    return creator.email;
  }
  return "";
}

export const mergeRefunds = (
  grantedRefunds: OrderDetailsFragment["grantedRefunds"] | undefined,
  manualRefunds: DatagridRefund[] | undefined,
): DatagridRefund[] | undefined => {
  if (!grantedRefunds || !manualRefunds) {
    return undefined;
  }
  return [...prepareGrantedRefunds(grantedRefunds), ...manualRefunds].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt),
  );
};

const prepareGrantedRefunds = (
  grantedRefunds: OrderDetailsFragment["grantedRefunds"],
): DatagridRefund[] =>
  grantedRefunds.map(refund => ({ ...refund, type: "standard" }));
