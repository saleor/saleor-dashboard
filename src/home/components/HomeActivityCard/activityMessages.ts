import { HomeQuery, OrderEventsEnum } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  draft: {
    id: "sjRXXz",
    defaultMessage: "Order #{orderId} was placed from draft by {userEmail}",
  },
  draft_no_email: {
    id: "BNTZLv",
    defaultMessage: "Order #{orderId} was placed from draft",
  },
  paid: {
    id: "5SPHkk",
    defaultMessage: "Order #{orderId} was fully paid",
  },
  placed: {
    id: "0dPP8O",
    defaultMessage: "Order #{orderId} was placed",
  },
});

export const getActivityMessage = (
  activity: HomeQuery["activities"]["edges"][0]["node"],
  intl: IntlShape,
) => {
  switch (activity.type) {
    case OrderEventsEnum.ORDER_FULLY_PAID:
      return intl.formatMessage(messages.paid, {
        orderId: activity.orderNumber,
      });
    case OrderEventsEnum.PLACED:
      return intl.formatMessage(messages.placed, {
        orderId: activity.orderNumber,
      });
    case OrderEventsEnum.PLACED_FROM_DRAFT:
      if (!!activity.user?.email) {
        return intl.formatMessage(messages.draft, {
          orderId: activity.orderNumber,
          userEmail: activity.user?.email,
        });
      } else {
        return intl.formatMessage(messages.draft_no_email, {
          orderId: activity.orderNumber,
        });
      }

    default:
      return activity.message;
  }
};
