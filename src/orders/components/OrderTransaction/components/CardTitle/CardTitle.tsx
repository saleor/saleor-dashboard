import { TransactionActionEnum, TransactionItemFragment } from "@dashboard/graphql";
import { capitalize } from "@dashboard/misc";
import { FakeTransaction } from "@dashboard/orders/types";
import { IconButton } from "@material-ui/core";
import { Button, LinkIcon } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { mapActionToMessage } from "../../utils";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  const intl = useIntl();
  const TransactionLink = React.useMemo(
    () => (transaction.externalUrl ? "a" : "span"),
    [transaction.externalUrl],
  );
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
    <div className={classes.title}>
      {transaction.externalUrl ? (
        <TransactionLink
          // eslint-disable-next-line prettier/prettier
          href={transaction.externalUrl}
          className={classes.methodName}
        >
          {transaction.externalUrl && (
            <IconButton>
              <LinkIcon />
            </IconButton>
          )}

          {capitalize(transaction.name)}
        </TransactionLink>
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

      <Box display="flex" flexDirection="row" gap={8}>
        <div className={classes.dataDisplay}>
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
            <MoneyDisplay
              label={intl.formatMessage(messages.authorized)}
              money={authorizedAmount}
            />
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
        </div>
      </Box>
    </div>
  );
};
