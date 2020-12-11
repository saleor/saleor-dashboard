import DefaultCardTitle from "@saleor/components/CardTitle";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

import { getById } from "../utils";

const messages = defineMessages({
  titleFulfilled: {
    defaultMessage: "Fulfillment {fulfillmentName}",
    description: "section header"
  },
  titleRefunded: {
    defaultMessage: "Refunded {fulfillmentName}",
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

  const fulfilment = fulfillments.find(getById(fulfilmentId));

  const fulfillmentName = `#${number}-${fulfilment?.fulfillmentOrder}`;

  const getCardTitleMessage = () => {
    if (fulfilment.status === FulfillmentStatus.REFUNDED) {
      return messages.titleRefunded;
    }

    return fulfilmentId ? messages.titleFulfilled : messages.titleUnfulfilled;
  };

  return (
    <DefaultCardTitle
      title={intl.formatMessage(getCardTitleMessage(), { fulfillmentName })}
    />
  );
};

export default CardTitle;
