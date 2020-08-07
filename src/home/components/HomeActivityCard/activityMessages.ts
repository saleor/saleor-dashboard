import { defineMessages, IntlShape } from "react-intl";

import { OrderEventsEnum } from "../../../types/globalTypes";
import { Home_activities_edges_node } from "../../types/Home";

const messages = defineMessages({
  draft: {
    defaultMessage: "Order #{orderId} was placed from draft by {userEmail}"
  },
  draft_no_email: {
    defaultMessage: "Order #{orderId} was placed from draft"
  },
  paid: {
    defaultMessage: "Order #{orderId} was fully paid"
  },
  placed: {
    defaultMessage: "Order #{orderId} was placed"
  }
});

export const getActivityMessage = (
  activity: Home_activities_edges_node,
  intl: IntlShape
) => {
  switch (activity.type) {
    case OrderEventsEnum.ORDER_FULLY_PAID:
      return intl.formatMessage(messages.paid, {
        orderId: activity.orderNumber
      });
    case OrderEventsEnum.PLACED:
      return intl.formatMessage(messages.placed, {
        orderId: activity.orderNumber
      });
    case OrderEventsEnum.PLACED_FROM_DRAFT:
      if (!!activity.user?.email) {
        return intl.formatMessage(messages.draft, {
          orderId: activity.orderNumber,
          userEmail: activity.user?.email
        });
      } else {
        return intl.formatMessage(messages.draft_no_email, {
          orderId: activity.orderNumber
        });
      }

    default:
      return activity.message;
  }
};
