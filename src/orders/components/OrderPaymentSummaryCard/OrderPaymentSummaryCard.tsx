// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { Pill } from "@dashboard/components/Pill";
import { useFlag } from "@dashboard/featureFlags";
import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { transformPaymentStatus } from "@dashboard/misc";
import { orderGrantRefundUrl, orderSendRefundUrl } from "@dashboard/orders/urls";
import { Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
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

const OrderPaymentSummaryCard = ({ order, onMarkAsPaid }: OrderPaymementProps) => {
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
          <Pill
            key={payment.status}
            label={payment.localized}
            color={payment.status}
            className={classes.paymentStatus}
            data-test-id="payment-status"
          />
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      {showHasNoPayment ? (
        <DashboardCard.Content className={classes.noPaymentContent} data-test-id="payment-section">
          <Text size={3} fontWeight="bold" lineHeight={2} className={classes.noPaymentTitle}>
            <FormattedMessage {...orderPaymentMessages.noPayments} />
          </Text>
          {canMarkAsPaid && (
            <Button
              variant="tertiary"
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
