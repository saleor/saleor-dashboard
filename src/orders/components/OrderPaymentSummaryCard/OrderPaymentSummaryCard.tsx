// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { useFlag } from "@dashboard/featureFlags";
import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { orderGrantRefundUrl, orderSendRefundUrl } from "@dashboard/orders/urls";
import { Button, Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { RefundsSummary } from "./components";
import { OrderPaymentStatusPill } from "./components/OrderPaymentStatusPill";
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

  const { enabled } = useFlag("improved_refunds");

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
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            <FormattedMessage {...orderPaymentMessages.paymentTitle} />
          </DashboardCard.Title>
          <DashboardCard.Toolbar>
            <Skeleton />
          </DashboardCard.Toolbar>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Skeleton />
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className={classes.root}>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...orderPaymentMessages.paymentTitle} />

          <DashboardCard.Subtitle>
            <FormattedMessage {...orderPaymentMessages.paymentSubtitle} />
          </DashboardCard.Subtitle>
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <OrderPaymentStatusPill order={order} />
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      {showHasNoPayment ? (
        <DashboardCard.Content className={classes.noPaymentContent} data-test-id="payment-section">
          <Text size={3} fontWeight="bold" lineHeight={2} className={classes.noPaymentTitle}>
            <FormattedMessage {...orderPaymentMessages.noPayments} />
          </Text>
          {canMarkAsPaid && (
            <Button
              variant="secondary"
              onClick={() => onMarkAsPaid()}
              data-test-id="markAsPaidButton"
            >
              <FormattedMessage {...orderPaymentActionButtonMessages.markAsPaid} />
            </Button>
          )}
        </DashboardCard.Content>
      ) : (
        <PaymentsSummary order={order} />
      )}
      {canAnyRefund && !enabled && (
        <>
          <Divider />
          <DashboardCard.Header>
            <DashboardCard.Title>
              <FormattedMessage {...orderPaymentMessages.refundsTitle} />
            </DashboardCard.Title>
            <DashboardCard.Toolbar>
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
            </DashboardCard.Toolbar>
          </DashboardCard.Header>
          <DashboardCard.Content>
            <RefundsSummary order={order} />
          </DashboardCard.Content>
        </>
      )}
    </DashboardCard>
  );
};

export default OrderPaymentSummaryCard;
