import { IconButton } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@saleor/graphql";
import { Button, LinkIcon } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../OrderTransaction";
import { mapActionToMessage } from "./consts";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";
import { useStyles } from "./styles";

interface OrderTransactionCardTitleProps {
  title: string;
  id: string;
  refundedAmount: TransactionItemFragment["refundedAmount"];
  chargedAmount: TransactionItemFragment["chargedAmount"];
  authorizedAmount: TransactionItemFragment["authorizedAmount"];
  actions: TransactionItemFragment["actions"];
  link?: string;
  className?: string;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
}

const OrderTransactionCardTitle: React.FC<OrderTransactionCardTitleProps> = ({
  title,
  id,
  onTransactionAction,
  refundedAmount,
  chargedAmount,
  authorizedAmount,
  actions,
  link,
  className,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const TransactionLink = link ? "a" : "span";

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
            {actions
              .filter(action => action !== TransactionActionEnum.REFUND)
              .map(action => (
                <Button
                  variant="tertiary"
                  onClick={() => onTransactionAction(id, action)}
                >
                  <FormattedMessage {...mapActionToMessage[action]} />
                </Button>
              ))}

            {/* TODO: Pending refund */}

            {refundedAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.refunded)}
                money={refundedAmount}
              />
            )}

            {/* TODO: Pending capture */}

            <MoneyDisplay
              label={intl.formatMessage(messages.charged)}
              money={chargedAmount}
            />

            {authorizedAmount.amount > 0 && (
              <>
                <MoneyDisplay
                  label={intl.formatMessage(messages.authorized)}
                  money={authorizedAmount}
                />
              </>
            )}
          </div>
        </div>
      }
    />
  );
};

export default OrderTransactionCardTitle;
