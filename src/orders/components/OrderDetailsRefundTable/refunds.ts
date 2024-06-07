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
    firstName: string;
    lastName: string;
  } | null;
}

type EventsByPspReference = Record<string, TransactionEventFragment[]>;

const findLatestEventWithUserAuthor = (
  eventGroup: TransactionEventFragment[],
): TransactionEventFragment | null => {
  return eventGroup.find(event => event.createdBy?.__typename === "User") || null;
};

const mapEventToRefundStatus = (event: TransactionEventFragment): OrderGrantedRefundStatusEnum => {
  switch (event.type) {
    case TransactionEventTypeEnum.REFUND_SUCCESS:
      return OrderGrantedRefundStatusEnum.SUCCESS;
    case TransactionEventTypeEnum.REFUND_FAILURE:
      return OrderGrantedRefundStatusEnum.FAILURE;
    case TransactionEventTypeEnum.REFUND_REQUEST:
      return OrderGrantedRefundStatusEnum.PENDING;
    default:
      return OrderGrantedRefundStatusEnum.NONE;
  }
};

const SUPPORTED_REFUNDS = new Set([
  TransactionEventTypeEnum.REFUND_SUCCESS,
  TransactionEventTypeEnum.REFUND_FAILURE,
  TransactionEventTypeEnum.REFUND_REQUEST,
]);

const groupEventsByPspReference = (events: TransactionEventFragment[]): EventsByPspReference => {
  return events?.reduce<EventsByPspReference>((acc, event) => {
    if (!acc[event.pspReference]) {
      acc[event.pspReference] = [];
    }

    acc[event.pspReference].push(event);

    return acc;
  }, {});
};

const mapEventGroupsToDatagridRefunds = (
  eventsByPspReference: EventsByPspReference,
  intl: IntlShape,
): DatagridRefund[] => {
  return Object.values(eventsByPspReference).map(eventGroup => {
    const sortedEvents = eventGroup.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestEvent = sortedEvents[0];
    const latestEventWithAuthor = findLatestEventWithUserAuthor(sortedEvents) || latestEvent;

    return {
      id: latestEvent.id,
      type: "manual" as const,
      status: mapEventToRefundStatus(latestEvent),
      amount: latestEvent.amount,
      createdAt: latestEvent.createdAt,
      user: determineCreatorDisplay(latestEventWithAuthor.createdBy),
      reason: intl.formatMessage(refundGridMessages.manualRefund),
    };
  });
};

export const manualRefundsExtractor = (
  order: OrderDetailsFragment,
  intl: IntlShape,
): DatagridRefund[] => {
  // Extract all events from all transactions
  const events = order.transactions.flatMap(transaction => transaction.events);

  // Filter for supported refund events
  const refundEvents = events.filter(event => event.type && SUPPORTED_REFUNDS.has(event.type));

  // Collect IDs of events associated with granted refunds
  const idsOfEventsAssociatedToGrantedRefunds = new Set(
    order.grantedRefunds.flatMap(gr => gr.transactionEvents?.map(te => te.id)),
  );

  // Filter out refunds that are already granted
  const manualRefundEvents =
    refundEvents?.filter(event => !idsOfEventsAssociatedToGrantedRefunds.has(event.id)) ?? [];

  const eventsByPspReference = groupEventsByPspReference(manualRefundEvents);
  const datagridRefunds = mapEventGroupsToDatagridRefunds(eventsByPspReference, intl);

  return datagridRefunds;
};

type RefundCreator = AppAvatarFragment | StaffMemberAvatarFragment;

function determineCreatorDisplay(creator: RefundCreator | null): DatagridRefund["user"] | null {
  if (creator?.__typename === "User") {
    return {
      email: creator.email,
      firstName: creator.firstName,
      lastName: creator.lastName,
    };
  }

  return null;
}

export const mergeRefunds = (
  grantedRefunds: OrderDetailsFragment["grantedRefunds"],
  manualRefunds: DatagridRefund[],
): DatagridRefund[] => {
  return [...prepareGrantedRefunds(grantedRefunds), ...manualRefunds].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
};

const prepareGrantedRefunds = (
  grantedRefunds: OrderDetailsFragment["grantedRefunds"],
): DatagridRefund[] => grantedRefunds.map(refund => ({ ...refund, type: "standard" }));
