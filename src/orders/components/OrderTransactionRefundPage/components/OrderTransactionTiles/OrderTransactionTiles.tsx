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
import { Box, RadioGroup, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, useController } from "react-hook-form";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";

interface OrderTransactionTilesProps {
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined;
  control: Control<OrderTransactionRefundPageFormData, any>;
}

export const OrderTransactionTiles: React.FC<OrderTransactionTilesProps> = ({
  transactions,
  control,
}: OrderTransactionTilesProps) => {
  const { field } = useController({ name: "transactionId", control });
  if (!transactions) {
    return <Skeleton marginTop={5} />;
  }
  return (
    <DashboardCard>
      <DashboardCard.Content>
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          {/* TODO: filter out non-refundable transactions (see SendRefund view) */}
          {transactions.map(transaction => (
            <Box
              key={transaction.id}
              borderStyle="solid"
              borderWidth={1}
              borderColor="default1"
              borderRadius={3}
              // padding={4}
              display="flex"
              flexDirection="column"
              marginBottom={3}
            >
              <RadioGroup.Item
                id={transaction.id}
                value={transaction.id}
                padding={4}
              >
                <Text size={5} fontWeight="medium" padding={4}>
                  {transaction.name === "" ? "Transaction" : transaction.name}
                </Text>
              </RadioGroup.Item>

              <Box>
                {transaction.events.map((event, eventIndex) => {
                  const { type, status } = mapTransactionEvent(event);
                  return (
                    <Box
                      key={event.id}
                      display="grid"
                      gridTemplateColumns={5}
                      alignItems="center"
                      gap={8}
                      // marginBottom={4}
                      borderBottomStyle={
                        eventIndex === transaction.events.length - 1
                          ? "none"
                          : "solid"
                      }
                      borderBottomWidth={1}
                      borderColor="default1"
                      padding={4}
                    >
                      {/* TODO: figure out how much of a macaw migration is needed */}
                      {/* TODO: Add justifyItems to sprinkles */}
                      <Box justifySelf="start" marginLeft={4}>
                        <EventStatus status={status} />
                      </Box>

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
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </RadioGroup>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
