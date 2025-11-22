// @ts-strict-ignore
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { orderUrl } from "@dashboard/orders/urls";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { IntlShape, MessageDescriptor } from "react-intl";

export const getEventSecondaryTitle = (event: OrderEventFragment): [MessageDescriptor, any?] => {
  switch (event.type) {
    case "ORDER_MARKED_AS_PAID": {
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
    "ORDER_DISCOUNT_ADDED",
    "ORDER_DISCOUNT_UPDATED",
    "ORDER_LINE_DISCOUNT_UPDATED",
    "ORDER_DISCOUNT_AUTOMATICALLY_UPDATED",
  ],
  extendable: [
    "FULFILLMENT_REFUNDED",
    "FULFILLMENT_REPLACED",
    "FULFILLMENT_RETURNED",
    "DRAFT_CREATED_FROM_REPLACE",
    "ORDER_MARKED_AS_PAID",
    "ORDER_DISCOUNT_ADDED",
    "ORDER_DISCOUNT_AUTOMATICALLY_UPDATED",
    "ORDER_DISCOUNT_UPDATED",
    "ORDER_LINE_DISCOUNT_UPDATED",
  ],
  linked: [
    "ORDER_REPLACEMENT_CREATED",
    "ORDER_DISCOUNT_DELETED",
    "ORDER_LINE_DISCOUNT_REMOVED",
  ],
  note: ["NOTE_ADDED"],
  note_updated: ["NOTE_UPDATED"],
  rawMessage: [
    "OTHER",
    "EXTERNAL_SERVICE_NOTIFICATION",
    "TRANSACTION_EVENT",
  ],
  secondaryTitle: ["ORDER_MARKED_AS_PAID"],
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

const selectEmployeeName = ({ firstName, lastName, email }: OrderEventFragment["user"]) => {
  if (firstName) {
    return getFullName({ firstName, lastName }).trim();
  }

  return email;
};

export const getEmployeeNameLink = (event: OrderEventFragment, intl: IntlShape) => {
  if (!hasEnsuredOrderEventFields(event, ["user"])) {
    return null;
  }

  const { id } = event.user;

  return {
    link: staffMemberDetailsUrl(id),
    text:
      selectEmployeeName(event.user) ||
      intl.formatMessage({
        defaultMessage: "Unknown user",
        id: "kv1DqJ",
        description: "unknown user display name",
      }),
  };
};

export const hasOrderLineDiscountWithNoPreviousValue = ({ type, lines }: OrderEventFragment) =>
  type === "ORDER_LINE_DISCOUNT_UPDATED" &&
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
