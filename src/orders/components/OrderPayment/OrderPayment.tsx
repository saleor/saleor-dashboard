import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import Money from "@saleor/components/Money";
import { OrderDetailsFragment } from "@saleor/graphql";
import { Button, Pill } from "@saleor/macaw-ui";
import { transformPaymentStatus } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  orderPaymentActionButtonMessages,
  orderPaymentMessages,
} from "./messages";
import { useStyles } from "./styles";
import { extractRefundedAmount } from "./utils";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
}

const AmountLine = ({ label, money }) => (
  <li>
    <dl>
      <dt>{label}</dt>
      <dd>
        <Money money={money} />
      </dd>
    </dl>
  </li>
);

const OrderPayment: React.FC<OrderPaymementProps> = ({ order }) => {
  const classes = useStyles();
  const intl = useIntl();

  const refundedAmount = extractRefundedAmount(order);
  const payment = transformPaymentStatus(order?.paymentStatus, intl);

  const canSendRefund = true; // TODO: Check if order has granted refunds

  return (
    <Card>
      <CardTitle
        toolbar={
          <Pill
            label={payment.localized}
            color={payment.status}
            className={classes.paymentStatus}
          />
        }
        title={<FormattedMessage {...orderPaymentMessages.paymentTitle} />}
      />
      <CardContent>
        <ul className={classes.list}>
          <AmountLine
            label={<FormattedMessage {...orderPaymentMessages.authorized} />}
            money={order.totalAuthorized}
          />

          {order.totalCaptured.amount !== 0 && (
            <AmountLine
              label={<FormattedMessage {...orderPaymentMessages.captured} />}
              money={order.totalCaptured}
            />
          )}
        </ul>
      </CardContent>
      <Hr />
      <CardTitle
        toolbar={
          <div className={classes.refundsButtons}>
            <Button variant="secondary">
              <FormattedMessage
                {...orderPaymentActionButtonMessages.grantRefund}
              />
            </Button>
            {canSendRefund && (
              <Button variant="secondary">
                <FormattedMessage
                  {...orderPaymentActionButtonMessages.sendRefund}
                />
              </Button>
            )}
          </div>
        }
        title={<FormattedMessage {...orderPaymentMessages.refundsTitle} />}
      ></CardTitle>
      <CardContent>
        {refundedAmount.amount !== 0 ? (
          <ul className={classes.list}>
            <AmountLine
              label={<FormattedMessage {...orderPaymentMessages.refunded} />}
              money={refundedAmount}
            />
          </ul>
        ) : (
          <Typography variant="body2" className={classes.explainText}>
            <FormattedMessage {...orderPaymentMessages.refundsExplanation} />
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderPayment;
