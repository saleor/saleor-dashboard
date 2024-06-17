import { ButtonLink } from "@dashboard/components/ButtonLink";
import { TransactionActionEnum, TransactionItemFragment } from "@dashboard/graphql";
import { capitalize } from "@dashboard/misc";
import { FakeTransaction } from "@dashboard/orders/types";
import { Box, Button, ExternalLinkIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { mapActionToMessage } from "../../utils";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";

interface CardTitleProps {
  transaction: TransactionItemFragment | FakeTransaction;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
}

export const OrderTransactionCardTitle: React.FC<CardTitleProps> = ({
  transaction,
  onTransactionAction,
  showActions = true,
}) => {
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
  } = transaction;

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

          {capitalize(transaction.name)}
        </ButtonLink>
      ) : (
        <Text size={3} fontWeight="bold">
          {transaction.name ? (
            <FormattedMessage
              {...messages.transactionCardTitleWithName}
              values={{ name: transaction.name }}
            />
          ) : (
            <FormattedMessage {...messages.transactionCardTitle} />
          )}
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

        {showActions &&
          transaction.actions
            .filter(action => action !== TransactionActionEnum.REFUND)
            .map(action => (
              <div key={`translation-action-${action}`}>
                <Button
                  variant="tertiary"
                  onClick={() => onTransactionAction(transaction.id, action)}
                >
                  <FormattedMessage {...mapActionToMessage[action]} />
                </Button>
              </div>
            ))}
      </Box>
    </Box>
  );
};
