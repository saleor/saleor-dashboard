import { OrderDetails_order_events } from "@saleor/orders/types/OrderDetails";
import { orderUrl } from "@saleor/orders/urls";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import { OrderEventsEnum } from "@saleor/types/globalTypes";
import { MessageDescriptor } from "react-intl";

export const getEventSecondaryTitle = (
  event: OrderDetails_order_events
): [MessageDescriptor, any?] => {
  switch (event.type) {
    case OrderEventsEnum.ORDER_MARKED_AS_PAID: {
      return [
        {
          defaultMessage: "Transaction Reference {transactionReference}",
          description: "transaction reference",
          id: "transaction-reference-order-history"
        },
        { transactionReference: event.transactionReference }
      ];
    }
  }
};

const timelineEventTypes = {
  discount: [
    OrderEventsEnum.ORDER_DISCOUNT_ADDED,
    OrderEventsEnum.ORDER_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED,
    OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED
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
    OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED
  ],
  linked: [
    OrderEventsEnum.ORDER_REPLACEMENT_CREATED,
    OrderEventsEnum.ORDER_DISCOUNT_DELETED,
    OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED
  ],
  note: [OrderEventsEnum.NOTE_ADDED],
  rawMessage: [
    OrderEventsEnum.OTHER,
    OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION
  ],
  secondaryTitle: [OrderEventsEnum.ORDER_MARKED_AS_PAID]
};

export const isTimelineEventOfType = (
  type:
    | "extendable"
    | "secondaryTitle"
    | "rawMessage"
    | "note"
    | "linked"
    | "discount",
  eventType: OrderEventsEnum
) => !!timelineEventTypes[type]?.includes(eventType);

export const isTimelineEventOfDiscountType = (eventType: OrderEventsEnum) =>
  isTimelineEventOfType("discount", eventType);

export const getEmployeeNameLink = (event: OrderDetails_order_events) => {
  if (!hasEnsuredOrderEventFields(event, ["user"])) {
    return null;
  }

  const { id, firstName, lastName } = event.user;

  const employeeName = `${firstName} ${lastName}`;

  return { link: staffMemberDetailsUrl(id), text: employeeName };
};

export const getOrderNumberLink = (event: OrderDetails_order_events) => {
  if (!hasEnsuredOrderEventFields(event, ["relatedOrder"])) {
    return null;
  }

  const { id, number } = event.relatedOrder;

  return {
    link: orderUrl(id),
    text: `#${number}`
  };
};

const hasEnsuredOrderEventFields = (
  event,
  fields: Array<keyof OrderDetails_order_events>
) => !fields.some((field: keyof OrderDetails_order_events) => !event[field]);
