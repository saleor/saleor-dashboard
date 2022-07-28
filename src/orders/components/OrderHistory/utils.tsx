import { OrderEventFragment, OrderEventsEnum } from "@saleor/graphql";
import { getFullName } from "@saleor/misc";
import { orderUrl } from "@saleor/orders/urls";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import { MessageDescriptor } from "react-intl";

export const getEventSecondaryTitle = (
  event: OrderEventFragment,
): [MessageDescriptor, any?] => {
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
    | "linked"
    | "discount",
  eventType: OrderEventsEnum,
) => !!timelineEventTypes[type]?.includes(eventType);

export const isTimelineEventOfDiscountType = (eventType: OrderEventsEnum) =>
  isTimelineEventOfType("discount", eventType);

const selectEmployeeName = ({
  firstName,
  lastName,
  email,
}: OrderEventFragment["user"]) => {
  if (!!firstName) {
    return getFullName({ firstName, lastName }).trim();
  }

  return email;
};

export const getEmployeeNameLink = (event: OrderEventFragment) => {
  if (!hasEnsuredOrderEventFields(event, ["user"])) {
    return null;
  }

  const { id } = event.user;

  return {
    link: staffMemberDetailsUrl(id),
    text: selectEmployeeName(event.user),
  };
};

export const hasOrderLineDiscountWithNoPreviousValue = ({
  type,
  lines,
}: OrderEventFragment) =>
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

export const getOrderNumberLinkObject = ({
  id,
  number,
}: {
  id: string;
  number: string;
}) => ({
  link: orderUrl(id),
  text: `#${number}`,
});
