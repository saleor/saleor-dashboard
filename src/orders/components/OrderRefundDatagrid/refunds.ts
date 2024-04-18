import {
  AppAvatarFragment,
  OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  StaffMemberAvatarFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { refundGridMessages } from "./messages";

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
