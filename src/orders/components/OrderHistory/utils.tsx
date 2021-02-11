import { OrderDetails_order_events } from "@saleor/orders/types/OrderDetails";
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
  extendable: [
    OrderEventsEnum.FULFILLMENT_REFUNDED,
    OrderEventsEnum.FULFILLMENT_REPLACED,
    OrderEventsEnum.FULFILLMENT_RETURNED,
    OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE,
    OrderEventsEnum.ORDER_MARKED_AS_PAID
  ],
  linked: [OrderEventsEnum.ORDER_REPLACEMENT_CREATED],
  note: [OrderEventsEnum.NOTE_ADDED],
  rawMessage: [
    OrderEventsEnum.OTHER,
    OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION
  ],
  secondaryTitle: [OrderEventsEnum.ORDER_MARKED_AS_PAID]
};

export const isTimelineEventOfType = (
  type: "extendable" | "secondaryTitle" | "rawMessage" | "note" | "linked",
  eventType: OrderEventsEnum
) => !!timelineEventTypes[type]?.includes(eventType);
