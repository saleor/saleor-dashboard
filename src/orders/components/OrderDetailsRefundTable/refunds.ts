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

type EventsByPspReference = Record<string, TransactionEventFragment[]>;

const findLatestEventWithCreatedBy = (
  eventGroup: TransactionEventFragment[],
): TransactionEventFragment | null => {
  return eventGroup.find(event => !!event.createdBy) || null;
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
    const latestEventWithAuthor = findLatestEventWithCreatedBy(sortedEvents) || latestEvent;

    return {
      id: latestEvent.id,
      type: "manual" as const,
      status: mapEventToRefundStatus(latestEvent),
      amount: latestEvent.amount,
      createdAt: latestEvent.createdAt,
      user: {
        email: determineCreatorDisplay(latestEventWithAuthor.createdBy),
      },
      reason: intl.formatMessage(refundGridMessages.manualRefund),
    };
  });
};

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

  const eventsByPspReference = groupEventsByPspReference(manualRefundEvents);
  const datagridRefunds = mapEventGroupsToDatagridRefunds(eventsByPspReference, intl);

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
