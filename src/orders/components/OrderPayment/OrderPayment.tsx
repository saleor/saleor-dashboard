import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import {
  OrderAction,
  OrderDetailsFragment,
  OrderStatus,
} from "@saleor/graphql";
import { Button, Pill } from "@saleor/macaw-ui";
import { transformPaymentStatus } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SummaryLine from "../OrderSummaryCard/SummaryLine";
import { SummaryList } from "../OrderSummaryCard/SummaryList";
import {
  orderPaymentActionButtonMessages,
  orderPaymentMessages,
  paymentButtonMessages,
} from "./messages";
import { useStyles } from "./styles";
import { extractRefundedAmount } from "./utils";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const getLegacyOrderActions = (order: OrderDetailsFragment) => {
  if (!order.actions) {
    return {
      canCapture: false,
      canVoid: false,
      canRefund: false,
      canMarkAsPaid: false,
      canAnything: false,
    };
  }

  const results = {
    canCapture: order.actions.includes(OrderAction.CAPTURE),
    canVoid: order.actions.includes(OrderAction.VOID),
    canRefund: order.actions.includes(OrderAction.REFUND),
    canMarkAsPaid: order.actions.includes(OrderAction.MARK_AS_PAID),
  };

  const anyAction =
    results.canCapture ||
    results.canVoid ||
    results.canRefund ||
    results.canMarkAsPaid;

  return {
    ...results,
    canAnything:
      anyAction &&
      order.payments?.length > 0 &&
      order.status !== OrderStatus.CANCELED,
  };
};

const getShouldDisplayAmounts = (order: OrderDetailsFragment) => {
  const authorized = order.totalAuthorized.amount;
  const captured = order.totalCaptured.amount;
  const total = order.total.gross.amount;

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
  onCapture,
  onVoid,
  onRefund,
  onMarkAsPaid,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const refundedAmount = extractRefundedAmount(order);
  const payment = transformPaymentStatus(order?.paymentStatus, intl);

  const canSendRefund = true; // TODO: Check if order has granted refunds

  const shouldDisplay = getShouldDisplayAmounts(order);
  const legacyActions = getLegacyOrderActions(order);

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
      {(shouldDisplay.any || legacyActions.canAnything) && (
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
          {legacyActions.canAnything && (
            <div className={classes.legacyActions}>
              {legacyActions.canCapture && (
                <Button variant="tertiary" onClick={onCapture}>
                  <FormattedMessage {...paymentButtonMessages.capture} />
                </Button>
              )}
              {legacyActions.canRefund && (
                <Button
                  variant="tertiary"
                  onClick={onRefund}
                  data-test-id="refund-button"
                >
                  <FormattedMessage {...paymentButtonMessages.refund} />
                </Button>
              )}
              {legacyActions.canVoid && (
                <Button variant="tertiary" onClick={onVoid}>
                  <FormattedMessage {...paymentButtonMessages.void} />
                </Button>
              )}
              {legacyActions.canMarkAsPaid && (
                <Button variant="tertiary" onClick={onMarkAsPaid}>
                  <FormattedMessage {...paymentButtonMessages.markAsPaid} />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
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
          <SummaryList className={classes.amountGrid}>
            <SummaryLine
              vertical
              text={<FormattedMessage {...orderPaymentMessages.refunded} />}
              money={refundedAmount}
            />
          </SummaryList>
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
