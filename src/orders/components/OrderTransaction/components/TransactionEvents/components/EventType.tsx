import { TransactionEventFragment } from "@saleor/graphql";
import { transactionEventTypeMap } from "@saleor/orders/messages";
import React from "react";
import { FormattedMessage } from "react-intl";

interface EventTypeProps {
  event: TransactionEventFragment;
}

export const EventType = ({ event }: EventTypeProps) => {
  const mapEventToMessage = transactionEventTypeMap[event.type];

  if (mapEventToMessage) {
    return <FormattedMessage {...mapEventToMessage} />;
  }

  return <>{event.name}</>;
};
