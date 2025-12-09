import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";

// Date group labels - keys are used internally, labels are internationalized in component
export type DateGroupKey =
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "OLDER"
  | "UNKNOWN";

// Helper to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

// Helper to get start of day
const startOfDay = (date: Date): Date => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

// Helper to get date group key - smart grouping based on age
export const getDateGroupKey = (date: string | null): DateGroupKey => {
  if (!date) {
    return "UNKNOWN";
  }

  const eventDate = new Date(date);
  const currentDate = new Date();
  const today = startOfDay(currentDate);
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const diffInMs = currentDate.getTime() - eventDate.getTime();
  const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Daily precision for last 48 hours
  if (isSameDay(eventDate, today)) {
    return "TODAY";
  } else if (isSameDay(eventDate, yesterday)) {
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
): Array<[DateGroupKey, OrderEventFragment[]]> => {
  const groups: Array<[DateGroupKey, OrderEventFragment[]]> = [];
  const groupMap = new Map<DateGroupKey, number>();

  events.forEach(event => {
    const key = getDateGroupKey(event.date);

    if (!groupMap.has(key)) {
      groupMap.set(key, groups.length);
      groups.push([key, []]);
    }

    const index = groupMap.get(key)!;

    groups[index][1].push(event);
  });

  return groups;
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
    OrderEventsEnum.ORDER_DISCOUNT_ADDED,
    OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED,
    OrderEventsEnum.ORDER_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED,
  ],
  note: [OrderEventsEnum.NOTE_ADDED],
  note_updated: [OrderEventsEnum.NOTE_UPDATED],
};

export const isTimelineEventOfType = (
  type: "extendable" | "note" | "note_updated" | "discount",
  eventType: OrderEventsEnum,
) => !!timelineEventTypes[type]?.includes(eventType);

export const isTimelineEventOfDiscountType = (eventType: OrderEventsEnum) =>
  isTimelineEventOfType("discount", eventType);

export const hasOrderLineDiscountWithNoPreviousValue = ({ type, lines }: OrderEventFragment) =>
  type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED &&
  lines?.[0]?.discount &&
  !lines?.[0].discount?.oldValue;

export const getOrderNumberLink = (event: OrderEventFragment) => {
  if (!event.relatedOrder) {
    return null;
  }

  const { id, number } = event.relatedOrder;

  return getOrderNumberLinkObject({ id, number });
};

export const getOrderNumberLinkObject = ({ id, number }: { id: string; number: string }) => ({
  link: orderUrl(id),
  text: `#${number}`,
});
