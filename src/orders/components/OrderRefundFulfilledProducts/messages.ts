import { FulfillmentStatus } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

export const messages = defineMessages({
  fulfillment: {
    id: "MewrtN",
    defaultMessage: "Fulfillment",
    description: "section header",
  },
  fulfillmentReturned: {
    id: "H/f9KR",
    defaultMessage: "Fulfillment returned",
    description: "section header returned",
  },
  fulfillmentWaitingForApproval: {
    id: "i/ZhxL",
    defaultMessage: "Fulfillment waiting for approval",
    description: "section header returned",
  },
});

export const getTitle = (
  fulfillmentStatus: FulfillmentStatus,
  intl: IntlShape,
) => {
  switch (fulfillmentStatus) {
    case FulfillmentStatus.RETURNED:
      return intl.formatMessage(messages.fulfillmentReturned);
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return intl.formatMessage(messages.fulfillmentWaitingForApproval);
    default:
      return intl.formatMessage(messages.fulfillment);
  }
};
