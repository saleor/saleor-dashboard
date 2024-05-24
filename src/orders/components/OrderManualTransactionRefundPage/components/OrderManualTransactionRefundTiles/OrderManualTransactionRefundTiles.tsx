import { TransactionItemFragment } from "@dashboard/graphql";
import { TileHeaderMoney } from "@dashboard/orders/components/OrderTransactionRefundPage/components/OrderTransactionTiles/TileHeaderMoney";
import { OrderTransactionTile } from "@dashboard/orders/components/OrderTransactionTile";
import { Box, RadioGroup, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../../messages";
import { isTransactionRefundable } from "../../utils";
import { ManualRefundForm } from "../OrderManualTransactionRefundForm/manualRefundValidationSchema";

interface OrderManualTransactionRefundTilesProps {
  loading: boolean;
  transactions: TransactionItemFragment[];
}

export const OrderManualTransactionRefundTiles = ({
  transactions,
  loading,
}: OrderManualTransactionRefundTilesProps) => {
  const { formState } = useFormContext<ManualRefundForm>();
  const error = formState.errors.transationId;
  const intl = useIntl();

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
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
          <RadioGroup value={value} onValueChange={onChange} display="grid" gap={3}>
            {transactions.map(transaction => {
              const isRefundable = isTransactionRefundable(transaction);

              return (
                <OrderTransactionTile error={!!error} key={transaction.id}>
                  <OrderTransactionTile.Header>
                    <Tooltip>
                      <Tooltip.Trigger>
                        <RadioGroup.Item
                          {...field}
                          id={transaction.id}
                          value={transaction.id}
                          disabled={!isRefundable}
                          error={!!error}
                          padding={4}
                          paddingTop={0}
                          width="100%"
                          display="grid"
                          __gridTemplateColumns="max-content 1fr"
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Text
                              size={5}
                              fontWeight="medium"
                              padding={4}
                              color={isRefundable ? "default1" : "defaultDisabled"}
                            >
                              {transaction?.name ||
                                intl.formatMessage(messages.defaultTransactionName)}
                            </Text>
                            <TileHeaderMoney transaction={transaction} />
                          </Box>
                        </RadioGroup.Item>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="left">
                        {!isRefundable && (
                          <>
                            <Tooltip.Arrow />
                            <FormattedMessage {...messages.notRefundable} />
                          </>
                        )}
                      </Tooltip.Content>
                    </Tooltip>
                  </OrderTransactionTile.Header>
                  <OrderTransactionTile.Events>
                    {transaction.events.map(event => (
                      <OrderTransactionTile.Event event={event} key={event.id} />
                    ))}
                  </OrderTransactionTile.Events>
                </OrderTransactionTile>
              );
            })}
          </RadioGroup>
        )}
      />
    </>
  );
};
