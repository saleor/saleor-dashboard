import { TransactionEventFragment } from "@saleor/graphql";
import { transactionEventTypeMap } from "@saleor/orders/messages";
import React from "react";
import { FormattedMessage } from "react-intl";

export const EventType = ({ event }: { event: TransactionEventFragment }) => {
  const mapEventToMessage = transactionEventTypeMap[event.type];

  if (mapEventToMessage) {
    return <FormattedMessage {...mapEventToMessage} />;
  }

  return <>{event.name}</>;
};
