import Money from "@dashboard/components/Money";
import { TransactionBaseEventFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import {
  EventStatus,
  EventTime,
  PspReference,
} from "../OrderTransaction/components/TransactionEvents/components";
import { EventType } from "../OrderTransaction/components/TransactionEvents/components/EventType";
import { mapTransactionEvent } from "../OrderTransaction/utils";

interface OrderTransactionTileEventProps {
  event: TransactionBaseEventFragment;
}

export const OrderTransactionTileEvent = ({ event }: OrderTransactionTileEventProps) => {
  const { type, status } = mapTransactionEvent(event);

  return (
    <Box
      backgroundColor="default1"
      display="grid"
      gridTemplateColumns={5}
      alignItems="center"
      gap={8}
      padding={4}
    >
      <Box justifySelf="start" marginLeft={4}>
        <EventStatus status={status} />
      </Box>

      <Money money={event.amount} />
      <EventType type={type} message={event.message} />
      {event.pspReference ? (
        <PspReference reference={event.pspReference} url={event.externalUrl} />
      ) : (
        <Box />
      )}
      <EventTime date={event.createdAt} />
    </Box>
  );
};
