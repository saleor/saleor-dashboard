import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { OrderAction, OrderDetailsFragment } from "@saleor/graphql";
import { Button, Pill } from "@saleor/macaw-ui";
import { transformPaymentStatus } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SummaryLine from "../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../OrderSummaryCard/SummaryList";
import {
  orderPaymentActionButtonMessages,
  orderPaymentMessages,
} from "./messages";
import { useStyles } from "./styles";
import { extractRefundedAmount } from "./utils";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
  onRefund: () => void;
  onMarkAsPaid: () => void;
}

const getShouldDisplayAmounts = (order: OrderDetailsFragment) => {
  if (!order) {
    return {
      authorized: false,
      captured: false,
      any: false,
    };
  }

  const authorized = order.totalAuthorized?.amount ?? 0;
  const captured = order.totalCaptured?.amount ?? 0;
  const total = order.total.gross?.amount ?? 0;

  if (authorized && captured) {
    // different amounts
    return {
      authorized: true,
      captured: true,
      any: true,
    };
  }

  if (captured !== 0 && captured !== total) {
    // partial capture
    return {
      authorized: false,
      captured: true,
      any: true,
    };
  }

  if (authorized !== 0) {
    // not fully authorized
    return {
      authorized: true,
      captured: false,
      any: true,
    };
  }

  // fully paid / not paid at all
  return {
    authorized: false,
    captured: false,
    any: false,
  };
};

const OrderPayment: React.FC<OrderPaymementProps> = ({
  order,
  onRefund,
  onMarkAsPaid,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const refundedAmount = extractRefundedAmount(order);
  const payment = transformPaymentStatus(order?.paymentStatus, intl);

  const canGrantRefund =
    order?.transactions?.length > 0 || order?.payments?.length > 0;
  const canSendRefund = canGrantRefund; // TODO: Check if order has granted refunds
  const canAnyRefund = canGrantRefund || canSendRefund;

  const canMarkAsPaid = order?.actions?.includes(OrderAction.MARK_AS_PAID);

  const shouldDisplay = getShouldDisplayAmounts(order);

  if (!order) {
    return (
      <Card>
        <CardTitle
          title={<FormattedMessage {...orderPaymentMessages.paymentTitle} />}
          toolbar={<Skeleton />}
        ></CardTitle>
        <CardContent>
          <Skeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={classes.root}>
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
      {!canAnyRefund && !shouldDisplay.any && (
        <CardContent className={classes.noPaymentContent}>
          <Typography variant="h5" className={classes.noPaymentTitle}>
            <FormattedMessage {...orderPaymentMessages.noPayments} />
          </Typography>
          {canMarkAsPaid && (
            <Button variant="tertiary" onClick={() => onMarkAsPaid()}>
              <FormattedMessage
                {...orderPaymentActionButtonMessages.markAsPaid}
              />
            </Button>
          )}
        </CardContent>
      )}
      {shouldDisplay.any && (
        <CardContent>
          {shouldDisplay.any && (
            <SummaryList className={classes.amountGrid}>
              {shouldDisplay.authorized && (
                <SummaryLine
                  vertical
                  text={
                    <FormattedMessage {...orderPaymentMessages.authorized} />
                  }
                  money={order.totalAuthorized}
                />
              )}

              {shouldDisplay.captured && (
                <SummaryLine
                  vertical
                  text={<FormattedMessage {...orderPaymentMessages.captured} />}
                  money={order.totalCaptured}
                />
              )}
            </SummaryList>
          )}
        </CardContent>
      )}
      {canAnyRefund && (
        <>
          <Hr />
          <CardTitle
            toolbar={
              <div className={classes.refundsButtons}>
                {canGrantRefund && (
                  <Button variant="secondary">
                    <FormattedMessage
                      {...orderPaymentActionButtonMessages.grantRefund}
                    />
                  </Button>
                )}
                {canSendRefund && (
                  <Button
                    variant="secondary"
                    onClick={onRefund}
                    data-test-id="refund-button"
                  >
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
            {/* TODO: Add granted refund amount */}
            {refundedAmount?.amount !== 0 ? (
              <SummaryList className={classes.amountGrid}>
                <SummaryLine
                  vertical
                  text={<FormattedMessage {...orderPaymentMessages.refunded} />}
                  money={refundedAmount}
                />
              </SummaryList>
            ) : (
              <Typography variant="body2" className={classes.explainText}>
                <FormattedMessage
                  {...orderPaymentMessages.refundsExplanation}
                />
              </Typography>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default OrderPayment;
