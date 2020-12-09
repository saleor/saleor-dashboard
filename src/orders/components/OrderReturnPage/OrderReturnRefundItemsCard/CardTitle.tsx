import DefaultCardTitle from "@saleor/components/CardTitle";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

import { getById } from "../utils";

const messages = defineMessages({
  titleFulfilled: {
    defaultMessage: "Fulfillment {fulfilmentName}",
    description: "section header"
  },
  titleUnfulfilled: {
    defaultMessage: "Unfulfilled Items",
    description: "section header"
  }
});

interface CardTitleProps {
  order?: OrderDetails_order;
  fulfilmentId?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ order, fulfilmentId }) => {
  const intl = useIntl();

  if (!order) {
    return null;
  }

  const { number, fulfillments } = order;

  const fulfillmentOrder = fulfillments.find(getById(fulfilmentId))
    ?.fulfillmentOrder;

  const fulfilmentName = `#${number}-${fulfillmentOrder}`;

  return (
    <DefaultCardTitle
      title={intl.formatMessage(
        fulfilmentId ? messages.titleFulfilled : messages.titleUnfulfilled,
        { fulfilmentName }
      )}
    />
  );
};

export default CardTitle;
