import { IconButton } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import Link from "@saleor/components/Link";
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

          {/* TODO: Pending refund */}

          <div className={classes.dataDisplay}>
            {refundedAmount && (
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

            {authorizedAmount && (
              <>
                <MoneyDisplay
                  label={intl.formatMessage(messages.authorized)}
                  money={authorizedAmount}
                />
                {/* TODO: Capture button */}
                <Button variant="tertiary" onClick={handleCapture}>
                  Capture
                </Button>
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
