import { transactionEventTypeMap } from "@saleor/orders/messages";
import { TransactionEventType } from "@saleor/orders/types";
import React from "react";
import { FormattedMessage } from "react-intl";

interface EventTypeProps {
  type: TransactionEventType;
}

export const EventType = ({ type }: EventTypeProps) => {
  const mapEventToMessage = transactionEventTypeMap[type];

  if (mapEventToMessage) {
    return <FormattedMessage {...mapEventToMessage} />;
  }

  return <>{type}</>;
};
