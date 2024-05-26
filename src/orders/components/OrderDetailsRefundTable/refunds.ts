import {
  AppAvatarFragment,
  OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  StaffMemberAvatarFragment,
  TransactionEventFragment,
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

const findLatestEventWithCreatedBy = (
  eventGroup: TransactionEventFragment[],
): TransactionEventFragment | null => {
  return eventGroup.find(event => !!event.createdBy) || null;
};

const SUPPORTED_REFUNDS = new Set([
  TransactionEventTypeEnum.REFUND_SUCCESS,
  TransactionEventTypeEnum.REFUND_FAILURE,
  TransactionEventTypeEnum.REFUND_REQUEST,
]);

export const manualRefundsExtractor = (
  order: OrderDetailsFragment | undefined,
  intl: IntlShape,
): DatagridRefund[] | undefined => {
  if (!order) {
    return;
  }

  // Extract all events from all transactions
  const events = order?.transactions.flatMap(transaction => transaction.events);

  // Filter for supported refund events
  const refundEvents = events?.filter(event => event.type && SUPPORTED_REFUNDS.has(event.type));

  // Collect IDs of events associated with granted refunds
  const idsOfEventsAssociatedToGrantedRefunds = new Set(
    order?.grantedRefunds.flatMap(gr => gr.transactionEvents?.map(te => te.id)),
  );

  // Filter out refunds that are already granted
  const manualRefundEvents = refundEvents?.filter(
    event => !idsOfEventsAssociatedToGrantedRefunds.has(event.id),
  );

  // Group events by pspReference
  const eventsByPspReference = manualRefundEvents?.reduce<
    Record<string, TransactionEventFragment[]>
  >((acc, event) => {
    if (!acc[event.pspReference]) {
      acc[event.pspReference] = [];
    }

    acc[event.pspReference].push(event);

    return acc;
  }, {});

  // Map grouped events to DatagridRefund objects, taking the latest status
  const datagridRefunds = Object.values(eventsByPspReference).map(eventGroup => {
    const sortedEvents = eventGroup.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestEvent = sortedEvents[0];
    const latestEventWithAuthor = findLatestEventWithCreatedBy(sortedEvents) || latestEvent;

    return {
      id: latestEvent.id,
      type: "manual" as const,
      status:
        latestEvent.type === "REFUND_SUCCESS"
          ? OrderGrantedRefundStatusEnum.SUCCESS
          : latestEvent.type === "REFUND_FAILURE"
            ? OrderGrantedRefundStatusEnum.FAILURE
            : OrderGrantedRefundStatusEnum.PENDING,
      amount: latestEvent.amount,
      createdAt: latestEvent.createdAt,
      user: {
        email: determineCreatorDisplay(latestEventWithAuthor.createdBy),
      },
      reason: intl.formatMessage(refundGridMessages.manualRefund),
    };
  });

  return datagridRefunds;
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

  return [...prepareGrantedRefunds(grantedRefunds), ...manualRefunds].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
};

const prepareGrantedRefunds = (
  grantedRefunds: OrderDetailsFragment["grantedRefunds"],
): DatagridRefund[] => grantedRefunds.map(refund => ({ ...refund, type: "standard" }));
