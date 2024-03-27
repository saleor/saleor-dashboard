import { DashboardCard } from "@dashboard/components/Card";
import EventTime from "@dashboard/components/EventTime";
import Money from "@dashboard/components/Money";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import {
  EventStatus,
  PspReference,
} from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components";
import { EventType } from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components/EventType";
import { mapTransactionEvent } from "@dashboard/orders/components/OrderTransaction/utils";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface OrderTransactionTilesProps {
  // TODO: add transactions to gql query
  transactions: OrderDetailsGrantRefundFragment["transactions"];
}

export const OrderTransactionTiles: React.FC<OrderTransactionTilesProps> = ({
  transactions,
}: OrderTransactionTilesProps) => {
  if (!transactions) {
    return <Skeleton marginTop={5} />;
  }
  // console.log(transactions);
  return (
    <DashboardCard>
      <DashboardCard.Content>
        {/* TODO: filter out non-refundable transactions (see SendRefund view) */}
        {transactions.map(transaction => (
          <Box
            key={transaction.id}
            borderStyle="solid"
            borderWidth={1}
            borderColor="default1"
            borderRadius={3}
            padding={4}
            display="flex"
            flexDirection="column"
            marginBottom={3}
          >
            {/* TODO: Wrap this in custom radio tile */}
            <Text size={5} fontWeight="medium">
              {transaction.name === "" ? "Transaction" : transaction.name}
            </Text>
            {/* TODO: Add justifyItems to sprinkles */}
            <Box
              marginTop={3}
              display="grid"
              gap={5}
              gridTemplateColumns={5}
              alignItems="center"
            >
              {transaction.events.map(event => {
                const { type, status } = mapTransactionEvent(event);
                return (
                  <React.Fragment key={event.id}>
                    {/* TODO: figure out how much of a macaw migration is needed */}
                    <EventStatus status={status} />
                    <Money money={event.amount} />
                    <EventType type={type} message={event.message} />
                    {event.pspReference ? (
                      <PspReference
                        reference={event.pspReference}
                        url={event.externalUrl}
                      />
                    ) : (
                      <Box />
                    )}
                    <EventTime date={event.createdAt} />
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        ))}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
