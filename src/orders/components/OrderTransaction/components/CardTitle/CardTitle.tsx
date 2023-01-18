import { IconButton } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@saleor/graphql";
import { Button, LinkIcon } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { mapActionToMessage } from "../../utils";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";
import { useStyles } from "./styles";

type TransactionAmounts = Pick<
  TransactionItemFragment,
  | "chargedAmount"
  | "authorizedAmount"
  | "refundedAmount"
  | "canceledAmount"
  | "chargePendingAmount"
  | "cancelPendingAmount"
  | "refundPendingAmount"
  | "authorizePendingAmount"
>;

interface CardTitleProps {
  title: string;
  id: string;
  amounts: TransactionAmounts;
  actions: TransactionItemFragment["actions"];
  link?: string;
  className?: string;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  title,
  id,
  onTransactionAction,
  amounts,
  actions,
  link,
  showActions = true,
  className,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const TransactionLink = link ? "a" : "span";

  const {
    refundedAmount,
    refundPendingAmount,
    authorizePendingAmount,
    cancelPendingAmount,
    chargePendingAmount,
    canceledAmount,
    chargedAmount,
    authorizedAmount,
  } = amounts;

  return (
    <DefaultCardTitle
      className={className}
      title={
        <div className={classes.title}>
          <TransactionLink href={link} className={classes.methodName}>
            {link && (
              <IconButton>
                <LinkIcon />
              </IconButton>
            )}
            {title}
          </TransactionLink>

          <div className={classes.dataDisplay}>
            {showActions &&
              actions
                .filter(action => action !== TransactionActionEnum.REFUND)
                .map(action => (
                  <Button
                    variant="tertiary"
                    onClick={() => onTransactionAction(id, action)}
                  >
                    <FormattedMessage {...mapActionToMessage[action]} />
                  </Button>
                ))}

            {cancelPendingAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.cancelPending)}
                money={cancelPendingAmount}
              />
            )}

            {canceledAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.canceled)}
                money={canceledAmount}
              />
            )}

            {refundPendingAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.refundPending)}
                money={refundPendingAmount}
              />
            )}

            {refundedAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.refunded)}
                money={refundedAmount}
              />
            )}

            {chargePendingAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.chargePending)}
                money={chargePendingAmount}
              />
            )}

            {chargedAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.charged)}
                money={chargedAmount}
              />
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
          </div>
        </div>
      }
    />
  );
};
