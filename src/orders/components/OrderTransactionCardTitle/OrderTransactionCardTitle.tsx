import { IconButton } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import { TransactionItemFragment } from "@saleor/graphql";
import { Button, LinkIcon } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";
import { useStyles } from "./styles";

interface OrderTransactionCardTitleProps {
  title: string;
  refundedAmount: TransactionItemFragment["refundedAmount"];
  chargedAmount: TransactionItemFragment["chargedAmount"];
  authorizedAmount: TransactionItemFragment["authorizedAmount"];
  link?: string;
  className?: string;
}

const OrderTransactionCardTitle: React.FC<OrderTransactionCardTitleProps> = ({
  title,
  refundedAmount,
  chargedAmount,
  authorizedAmount,
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
            {authorizedAmount.amount > 0 && (
              <Button variant="tertiary" onClick={handleCapture}>
                Capture
              </Button>
            )}

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

  function handleCapture() {
    // TODO: Handle capture
    return;
  }
};

export default OrderTransactionCardTitle;
