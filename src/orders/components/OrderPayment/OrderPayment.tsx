import { Card, CardContent, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { OrderAction, OrderDetailsFragment } from "@saleor/graphql";
import { Pill } from "@saleor/macaw-ui";
import { transformPaymentStatus } from "@saleor/misc";
import { orderGrantRefundUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { RefundsSummary } from "./components";
import {
  getShouldDisplayAmounts,
  PaymentsSummary,
} from "./components/PaymentsSummary";
import {
  orderPaymentActionButtonMessages,
  orderPaymentMessages,
} from "./messages";
import { useStyles } from "./styles";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
  onRefund: () => void;
  onMarkAsPaid: () => void;
}

const OrderPayment: React.FC<OrderPaymementProps> = ({
  order,
  onRefund,
  onMarkAsPaid,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const payment = transformPaymentStatus(order?.paymentStatus, intl);
  const giftCardAmount = extractOrderGiftCardUsedAmount(order);

  const canGrantRefund =
    order?.transactions?.length > 0 || order?.payments?.length > 0;
  const canSendRefund = order?.grantedRefunds?.length > 0;
  const canAnyRefund = canGrantRefund || canSendRefund;
  const hasGiftCards = giftCardAmount > 0;

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
      {!canAnyRefund &&
        !shouldDisplay.captured &&
        !shouldDisplay.authorized &&
        !hasGiftCards && (
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
      <PaymentsSummary order={order} />
      {canAnyRefund && (
        <>
          <Hr />
          <CardTitle
            toolbar={
              <div className={classes.refundsButtons}>
                {canGrantRefund && (
                  <Button
                    href={orderGrantRefundUrl(order.id)}
                    variant="secondary"
                  >
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
            <RefundsSummary order={order} />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default OrderPayment;
