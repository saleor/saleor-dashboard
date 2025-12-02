// @ts-strict-ignore
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import moment from "moment-timezone";
import { MessageDescriptor } from "react-intl";

// Date group labels - keys are used internally, labels are internationalized in component
export type DateGroupKey =
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "OLDER"
  | "UNKNOWN";

// Helper to get date group key - smart grouping based on age
export const getDateGroupKey = (date: string | null, now?: moment.Moment): DateGroupKey => {
  if (!date) {
    return "UNKNOWN";
  }

  const eventDate = moment(date);
  const currentMoment = now || moment();
  const today = currentMoment.clone().startOf("day");
  const yesterday = currentMoment.clone().subtract(1, "day").startOf("day");
  const daysAgo = currentMoment.diff(eventDate, "days");

  // Daily precision for last 48 hours
  if (eventDate.isSame(today, "day")) {
    return "TODAY";
  } else if (eventDate.isSame(yesterday, "day")) {
    return "YESTERDAY";
  }

  // Progressive broader buckets for older events
  if (daysAgo < 7) {
    return "LAST_7_DAYS";
  } else if (daysAgo < 30) {
    return "LAST_30_DAYS";
  } else {
    return "OLDER";
  }
};

// Group events by date - preserves insertion order
export const groupEventsByDate = (
  events: OrderEventFragment[],
  now?: moment.Moment,
): Array<[DateGroupKey, OrderEventFragment[]]> => {
  const groups: Array<[DateGroupKey, OrderEventFragment[]]> = [];
  const groupMap = new Map<DateGroupKey, number>();

  events.forEach(event => {
    const key = getDateGroupKey(event.date, now);

    if (!groupMap.has(key)) {
      groupMap.set(key, groups.length);
      groups.push([key, []]);
    }

    const index = groupMap.get(key)!;

    groups[index][1].push(event);
  });

  return groups;
};

export const getEventSecondaryTitle = (event: OrderEventFragment): [MessageDescriptor, any?] => {
  switch (event.type) {
    case OrderEventsEnum.ORDER_MARKED_AS_PAID: {
      return [
        {
          defaultMessage: "Transaction Reference {transactionReference}",
          description: "transaction reference",
          id: "transaction-reference-order-history",
        },
        { transactionReference: event.transactionReference },
      ];
    }
  }
};

const timelineEventTypes = {
  discount: [
    OrderEventsEnum.ORDER_DISCOUNT_ADDED,
    OrderEventsEnum.ORDER_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED,
  ],
  extendable: [
    OrderEventsEnum.FULFILLMENT_REFUNDED,
    OrderEventsEnum.FULFILLMENT_REPLACED,
    OrderEventsEnum.FULFILLMENT_RETURNED,
    OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE,
    OrderEventsEnum.ORDER_MARKED_AS_PAID,
    OrderEventsEnum.ORDER_DISCOUNT_ADDED,
    OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED,
    OrderEventsEnum.ORDER_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED,
  ],
  linked: [
    OrderEventsEnum.ORDER_REPLACEMENT_CREATED,
    OrderEventsEnum.ORDER_DISCOUNT_DELETED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED,
  ],
  note: [OrderEventsEnum.NOTE_ADDED],
  note_updated: [OrderEventsEnum.NOTE_UPDATED],
  rawMessage: [
    OrderEventsEnum.OTHER,
    OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION,
    OrderEventsEnum.TRANSACTION_EVENT,
  ],
  secondaryTitle: [OrderEventsEnum.ORDER_MARKED_AS_PAID],
};

export const isTimelineEventOfType = (
  type:
    | "extendable"
    | "secondaryTitle"
    | "rawMessage"
    | "note"
    | "note_updated"
    | "linked"
    | "discount",
  eventType: OrderEventsEnum,
) => !!timelineEventTypes[type]?.includes(eventType);

export const isTimelineEventOfDiscountType = (eventType: OrderEventsEnum) =>
  isTimelineEventOfType("discount", eventType);

export const hasOrderLineDiscountWithNoPreviousValue = ({ type, lines }: OrderEventFragment) =>
  type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED &&
  lines?.[0]?.discount &&
  !lines?.[0].discount?.oldValue;

export const getOrderNumberLink = (event: OrderEventFragment) => {
  if (!hasEnsuredOrderEventFields(event, ["relatedOrder"])) {
    return null;
  }

  const { id, number } = event.relatedOrder;

  return getOrderNumberLinkObject({ id, number });
};

const hasEnsuredOrderEventFields = (
  event: OrderEventFragment,
  fields: Array<keyof OrderEventFragment>,
) => !fields.some((field: keyof OrderEventFragment) => !event[field]);

export const getOrderNumberLinkObject = ({ id, number }: { id: string; number: string }) => ({
  link: orderUrl(id),
  text: `#${number}`,
});
