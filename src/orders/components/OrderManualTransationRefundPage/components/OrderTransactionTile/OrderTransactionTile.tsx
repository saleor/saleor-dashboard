import EventTime from "@dashboard/components/EventTime";
import Money from "@dashboard/components/Money";
import { TransactionItemFragment } from "@dashboard/graphql";
import {
  EventStatus,
  PspReference,
} from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components";
import { EventType } from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components/EventType";
import { mapTransactionEvent } from "@dashboard/orders/components/OrderTransaction/utils";
import { Box, RadioGroup, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ManualRefundForm } from "../OrderManualTransationRefundForm/manualRefundValidationSchema";

interface OrderTransactionTilesProps {
  loading: boolean;
  transactions: TransactionItemFragment[];
}

export const OrderTransactionTiles: React.FC<OrderTransactionTilesProps> = ({
  transactions,
  loading,
}: OrderTransactionTilesProps) => {
  const { watch, formState } = useFormContext<ManualRefundForm>();
  const transationId = watch("transationId");
  const error = formState.errors.transationId;

  if (loading) {
    return <Skeleton marginTop={5} />;
  }

  return (
    <>
      {!!error && (
        <Text color="critical1" size={3} marginY={4} as="p">
          {error.message}
        </Text>
      )}

      <RadioGroup value={transationId}>
        {transactions.map(transaction => (
          <Box
            key={transaction.id}
            borderStyle="solid"
            borderWidth={1}
            borderColor={!!error ? "critical1" : "default1"}
            borderRadius={3}
            display="flex"
            flexDirection="column"
            marginBottom={3}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingRight={4}
            >
              <Controller
                name="transationId"
                render={({
                  field: { onChange, value, ...field },
                  fieldState: { error },
                }) => (
                  <RadioGroup.Item
                    {...field}
                    id={transaction.id}
                    value={transaction.id}
                    error={!!error}
                    onChange={value => {
                      onChange(value);
                    }}
                    padding={4}
                  >
                    <Text size={5} fontWeight="medium" padding={4}>
                      {transaction.name === ""
                        ? "Transaction"
                        : transaction.name}
                    </Text>
                  </RadioGroup.Item>
                )}
              />
            </Box>
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
    </>
  );
};
