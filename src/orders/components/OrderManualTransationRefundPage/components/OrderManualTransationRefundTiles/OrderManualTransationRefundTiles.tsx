import { TransactionBaseItemFragment } from "@dashboard/graphql";
import { OrderTransactionTile } from "@dashboard/orders/components/OrderTransactionTile";
import { RadioGroup, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { ManualRefundForm } from "../OrderManualTransationRefundForm/manualRefundValidationSchema";

interface OrderManualTransationRefundTilesProps {
  loading: boolean;
  transactions: TransactionBaseItemFragment[];
}

export const OrderManualTransationRefundTiles = ({
  transactions,
  loading,
}: OrderManualTransationRefundTilesProps) => {
  const { formState } = useFormContext<ManualRefundForm>();
  const error = formState.errors.transationId;

  if (loading) {
    return <Skeleton marginTop={5} data-test-id="loading-skeleton" />;
  }

  if (!transactions.length) {
    return (
      <Text color="default2">
        <FormattedMessage {...messages.noTransactions} />
      </Text>
    );
  }

  return (
    <>
      {!!error && (
        <Text color="critical1" size={3} marginY={4} as="p">
          {error.message}
        </Text>
      )}

      <Controller
        name="transationId"
        render={({
          field: { onChange, value, ...field },
          fieldState: { error },
        }) => (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            display="grid"
            gap={3}
          >
            {transactions.map(transaction => (
              <OrderTransactionTile error={!!error} key={transaction.id}>
                <OrderTransactionTile.Header>
                  <RadioGroup.Item
                    {...field}
                    id={transaction.id}
                    value={transaction.id}
                    error={!!error}
                    padding={4}
                  >
                    <Text size={5} fontWeight="medium" padding={4}>
                      {transaction?.name || "Transaction"}
                    </Text>
                  </RadioGroup.Item>
                </OrderTransactionTile.Header>
                <OrderTransactionTile.Events>
                  {transaction.events.map(event => (
                    <OrderTransactionTile.Event event={event} key={event.id} />
                  ))}
                </OrderTransactionTile.Events>
              </OrderTransactionTile>
            ))}
          </RadioGroup>
        )}
      />
    </>
  );
};
