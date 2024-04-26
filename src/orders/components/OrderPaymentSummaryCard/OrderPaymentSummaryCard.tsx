// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import { Pill } from "@dashboard/components/Pill";
import Skeleton from "@dashboard/components/Skeleton";
import { useFlag } from "@dashboard/featureFlags";
import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { transformPaymentStatus } from "@dashboard/misc";
import { orderGrantRefundUrl, orderSendRefundUrl } from "@dashboard/orders/urls";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Divider } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { RefundsSummary } from "./components";
import { PaymentsSummary } from "./components/PaymentsSummary";
import { getShouldDisplayAmounts } from "./components/PaymentsSummary/utils";
import { orderPaymentActionButtonMessages, orderPaymentMessages } from "./messages";
import { useStyles } from "./styles";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
  onMarkAsPaid: () => void;
}

const OrderPaymentSummaryCard: React.FC<OrderPaymementProps> = ({ order, onMarkAsPaid }) => {
  const classes = useStyles();
  const intl = useIntl();

  const { enabled } = useFlag("improved_refunds");

  const payment = transformPaymentStatus(order?.paymentStatus, intl);
  const giftCardAmount = extractOrderGiftCardUsedAmount(order);
  const canGrantRefund = order?.transactions?.length > 0 || order?.payments?.length > 0;
  const canSendRefund = order?.grantedRefunds?.length > 0;
  const canAnyRefund = canGrantRefund || canSendRefund;
  const hasGiftCards = giftCardAmount > 0;
  const canMarkAsPaid = order?.actions?.includes(OrderAction.MARK_AS_PAID);
  const shouldDisplay = getShouldDisplayAmounts(order);

  const showHasNoPayment =
    !canAnyRefund && !shouldDisplay.charged && !shouldDisplay.authorized && !hasGiftCards;

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
            key={payment.status}
            label={payment.localized}
            color={payment.status}
            className={classes.paymentStatus}
            data-test-id="payment-status"
          />
        }
        title={<FormattedMessage {...orderPaymentMessages.paymentTitle} />}
        subtitle={<FormattedMessage {...orderPaymentMessages.paymentSubtitle} />}
      />
      {showHasNoPayment ? (
        <CardContent className={classes.noPaymentContent} data-test-id="payment-section">
          <Typography variant="h5" className={classes.noPaymentTitle}>
            <FormattedMessage {...orderPaymentMessages.noPayments} />
          </Typography>
          {canMarkAsPaid && (
            <Button
              variant="tertiary"
              onClick={() => onMarkAsPaid()}
              data-test-id="markAsPaidButton"
            >
              <FormattedMessage {...orderPaymentActionButtonMessages.markAsPaid} />
            </Button>
          )}
        </CardContent>
      ) : (
        <PaymentsSummary order={order} />
      )}
      {canAnyRefund && !enabled && (
        <>
          <Divider />
          <CardTitle
            toolbar={
              <div className={classes.refundsButtons}>
                {canGrantRefund && (
                  <Button
                    href={orderGrantRefundUrl(order.id)}
                    variant="secondary"
                    data-test-id="grantRefundButton"
                  >
                    <FormattedMessage {...orderPaymentActionButtonMessages.grantRefund} />
                  </Button>
                )}
                {canSendRefund && (
                  <Button
                    variant="secondary"
                    href={orderSendRefundUrl(order.id)}
                    data-test-id="refund-button"
                  >
                    <FormattedMessage {...orderPaymentActionButtonMessages.sendRefund} />
                  </Button>
                )}
              </div>
            }
            title={<FormattedMessage {...orderPaymentMessages.refundsTitle} />}
          ></CardTitle>
          <CardContent>
            <RefundsSummary order={order} />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default OrderPaymentSummaryCard;
