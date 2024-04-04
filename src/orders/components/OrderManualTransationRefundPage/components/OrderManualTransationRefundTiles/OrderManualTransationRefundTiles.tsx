import { TransactionItemFragment } from "@dashboard/graphql";
import { OrderTransactionTile } from "@dashboard/orders/components/OrderTransactionTile";
import { RadioGroup, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ManualRefundForm } from "../OrderManualTransationRefundForm/manualRefundValidationSchema";

interface OrderManualTransationRefundTilesProps {
  loading: boolean;
  transactions: TransactionItemFragment[];
}

export const OrderManualTransationRefundTiles = ({
  transactions,
  loading,
}: OrderManualTransationRefundTilesProps) => {
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
          <OrderTransactionTile error={!!error} key={transaction.id}>
            <OrderTransactionTile.Header>
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
            </OrderTransactionTile.Header>
            <OrderTransactionTile.Events>
              {transaction.events.map(event => (
                <OrderTransactionTile.Event event={event} key={event.id} />
              ))}
            </OrderTransactionTile.Events>
          </OrderTransactionTile>
        ))}
      </RadioGroup>
    </>
  );
};
