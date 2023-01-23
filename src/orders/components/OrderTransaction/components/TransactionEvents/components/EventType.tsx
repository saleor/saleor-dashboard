import { TransactionEventFragment } from "@dashboard/graphql";
import { transactionEventTypeMap } from "@dashboard/orders/messages";
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
