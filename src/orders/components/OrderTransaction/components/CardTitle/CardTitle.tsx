import { ButtonLink } from "@dashboard/components/ButtonLink";
import { TransactionActionEnum } from "@dashboard/graphql";
import { Box, Button, ExternalLinkIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { ExtendedOrderTransaction } from "../../types";
import { mapActionToMessage } from "../../utils";
import { EventTime } from "../TransactionEvents/components/EventTime";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";

interface CardTitleProps {
  transaction: ExtendedOrderTransaction;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
}

export const OrderTransactionCardTitle = ({
  transaction,
  onTransactionAction,
  showActions = true,
}: CardTitleProps) => {
  const intl = useIntl();

  const {
    refundedAmount,
    refundPendingAmount,
    authorizePendingAmount,
    cancelPendingAmount,
    chargePendingAmount,
    canceledAmount,
    chargedAmount,
    authorizedAmount,
    index = 0,
  } = transaction;

  const actions = transaction.actions.filter(action => action !== TransactionActionEnum.REFUND);
  const showActionButtons = showActions && actions.length > 0;

  const transactionTitle = intl.formatMessage(
    {
      defaultMessage: "Transaction #{index} on {date}",
      id: "nYD7NT",
    },
    {
      date: <EventTime date={transaction.createdAt} />,
      index: index + 1,
    },
  );

  return (
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
      {transaction.externalUrl ? (
        <ButtonLink
          as="a"
          href={transaction.externalUrl}
          display="flex"
          gap={2}
          alignItems="center"
          size="large"
        >
          <ExternalLinkIcon size="small" />

          {transactionTitle}
        </ButtonLink>
      ) : (
        <Text size={3} fontWeight="bold">
          {transactionTitle}
        </Text>
      )}

      <Box display="flex" gap={8} alignItems="center">
        {cancelPendingAmount.amount > 0 && (
          <MoneyDisplay
            label={intl.formatMessage(messages.cancelPending)}
            money={cancelPendingAmount}
          />
        )}

        {canceledAmount.amount > 0 && (
          <MoneyDisplay label={intl.formatMessage(messages.canceled)} money={canceledAmount} />
        )}

        {refundPendingAmount.amount > 0 && (
          <MoneyDisplay
            label={intl.formatMessage(messages.refundPending)}
            money={refundPendingAmount}
          />
        )}

        {refundedAmount.amount > 0 && (
          <MoneyDisplay label={intl.formatMessage(messages.refunded)} money={refundedAmount} />
        )}

        {chargePendingAmount.amount > 0 && (
          <MoneyDisplay
            label={intl.formatMessage(messages.chargePending)}
            money={chargePendingAmount}
          />
        )}

        {chargedAmount.amount > 0 && (
          <MoneyDisplay label={intl.formatMessage(messages.charged)} money={chargedAmount} />
        )}

        {authorizePendingAmount.amount > 0 && (
          <MoneyDisplay
            label={intl.formatMessage(messages.authorizePending)}
            money={authorizePendingAmount}
          />
        )}

        {authorizedAmount.amount > 0 && (
          <MoneyDisplay label={intl.formatMessage(messages.authorized)} money={authorizedAmount} />
        )}

        {showActionButtons && (
          <Box display="flex" flexDirection="row" gap={2}>
            {actions
              .filter(action => action !== TransactionActionEnum.REFUND)
              .map(action => (
                <div key={`transaction-action-${action}`}>
                  <Button
                    variant="secondary"
                    onClick={() => onTransactionAction(transaction.id, action)}
                  >
                    <FormattedMessage {...mapActionToMessage[action]} />
                  </Button>
                </div>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
