import { DashboardCard } from "@dashboard/components/Card";
import EventTime from "@dashboard/components/EventTime";
import Money from "@dashboard/components/Money";
import { OrderDetailsGrantRefundFragment, TransactionActionEnum } from "@dashboard/graphql";
import {
  EventStatus,
  PspReference,
} from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components";
import { EventType } from "@dashboard/orders/components/OrderTransaction/components/TransactionEvents/components/EventType";
import { mapTransactionEvent } from "@dashboard/orders/components/OrderTransaction/utils";
import { Box, RadioGroup, Skeleton, Tooltip } from "@saleor/macaw-ui-next";
import { Control, useController } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { transactionRefundTilesMessages } from "./messages";
import { TileHeader } from "./TileHeader";

interface OrderTransactionTilesProps {
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined;
  control: Control<OrderTransactionRefundPageFormData, any>;
}

export const OrderTransactionTiles = ({ transactions, control }: OrderTransactionTilesProps) => {
  const { field } = useController({ name: "transactionId", control });

  if (!transactions) {
    return (
      <Box display="flex">
        <Skeleton marginX={6} />
      </Box>
    );
  }

  return (
    <DashboardCard>
      <DashboardCard.Content>
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          {transactions.map(transaction => {
            const isDisabled = !transaction.actions.includes(TransactionActionEnum.REFUND);

            return (
              <Box
                key={transaction.id}
                borderStyle="solid"
                borderWidth={1}
                borderColor="default1"
                borderRadius={3}
                display="flex"
                flexDirection="column"
                marginBottom={3}
              >
                {isDisabled ? (
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Box>
                        <TileHeader transaction={transaction} isDisabled />
                      </Box>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="left">
                      <FormattedMessage {...transactionRefundTilesMessages.disabledTransaction} />
                    </Tooltip.Content>
                  </Tooltip>
                ) : (
                  <TileHeader transaction={transaction} />
                )}
                <Box
                  display="grid"
                  __gridTemplateColumns="auto auto auto minmax(150px, 1fr) minmax(150px, auto)"
                  __columnGap="32px"
                  alignItems="start"
                  paddingX={4}
                >
                  {transaction.events.map((event, eventIndex) => {
                    const { type, status } = mapTransactionEvent(event);
                    const isLastRow = eventIndex === transaction.events.length - 1;

                    return (
                      <>
                        <Box key={`${event.id}-status`} justifySelf="start" paddingY={4}>
                          <EventStatus status={status} />
                        </Box>

                        <Box key={`${event.id}-amount`} paddingY={4} __whiteSpace="nowrap">
                          <Money money={event.amount} />
                        </Box>
                        <Box key={`${event.id}-type`} paddingY={4} __whiteSpace="nowrap">
                          <EventType type={type} message={event.message} />
                        </Box>
                        <Box key={`${event.id}-psp`} paddingY={4}>
                          {event.pspReference ? (
                            <PspReference reference={event.pspReference} url={event.externalUrl} />
                          ) : (
                            <Box />
                          )}
                        </Box>
                        <Box key={`${event.id}-time`} paddingY={4}>
                          <EventTime date={event.createdAt} />
                        </Box>
                        {!isLastRow && (
                          <Box
                            key={`${event.id}-border`}
                            __gridColumn="1 / -1"
                            borderBottomStyle="solid"
                            borderBottomWidth={1}
                            borderColor="default1"
                          />
                        )}
                      </>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </RadioGroup>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
