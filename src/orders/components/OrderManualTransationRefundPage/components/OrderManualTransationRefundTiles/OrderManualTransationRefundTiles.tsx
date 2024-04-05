import { TransactionBaseItemFragment } from "@dashboard/graphql";
import { OrderTransactionTile } from "@dashboard/orders/components/OrderTransactionTile";
import { RadioGroup, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { isRefundable } from "../../utils";
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
                  {isRefundable(transaction) ? (
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
                  ) : (
                    <Tooltip>
                      <Tooltip.Trigger>
                        <RadioGroup.Item
                          {...field}
                          id={transaction.id}
                          value={transaction.id}
                          disabled
                          error={!!error}
                          padding={4}
                        >
                          <Text
                            size={5}
                            fontWeight="medium"
                            padding={4}
                            color="defaultDisabled"
                          >
                            {transaction?.name || "Transaction"}
                          </Text>
                        </RadioGroup.Item>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="left">
                        <Tooltip.Arrow />
                        <FormattedMessage {...messages.notRefundable} />
                      </Tooltip.Content>
                    </Tooltip>
                  )}
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
