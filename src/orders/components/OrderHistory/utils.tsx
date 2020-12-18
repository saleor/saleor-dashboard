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
  extendableEventStatuses: [
    OrderEventsEnum.FULFILLMENT_REFUNDED,
    OrderEventsEnum.FULFILLMENT_REPLACED,
    OrderEventsEnum.FULFILLMENT_RETURNED
  ],
  noteStatuses: [OrderEventsEnum.NOTE_ADDED],
  rawMessageEventStatuses: [
    OrderEventsEnum.OTHER,
    OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION
  ],
  secondaryTitleEventStatuses: [OrderEventsEnum.ORDER_MARKED_AS_PAID]
};

export const isOfType = (
  type: "extendable" | "secondaryTitle" | "rawMessage" | "note",
  eventType: OrderEventsEnum
) => !!timelineEventTypes[`${type}EventStatuses`]?.includes(eventType);
