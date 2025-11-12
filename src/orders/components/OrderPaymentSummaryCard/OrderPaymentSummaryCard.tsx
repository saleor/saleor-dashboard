// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { OrderPaymentStatusPill } from "./components/OrderPaymentStatusPill";
import { PaymentsSummary } from "./components/PaymentsSummary";
import { orderPaymentActionButtonMessages, orderPaymentMessages } from "./messages";
import { useStyles } from "./styles";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
  onMarkAsPaid: () => void;
}

export const OrderPaymentSummaryCard = ({ order, onMarkAsPaid }: OrderPaymementProps) => {
  const classes = useStyles();

  const giftCardAmount = extractOrderGiftCardUsedAmount(order);
  const canGrantRefund = order?.transactions?.length > 0 || order?.payments?.length > 0;
  const canSendRefund = order?.grantedRefunds?.length > 0;
  const canAnyRefund = canGrantRefund || canSendRefund;
  const hasGiftCards = giftCardAmount > 0;
  const canMarkAsPaid = order?.actions?.includes(OrderAction.MARK_AS_PAID);
  const shouldDisplay = OrderDetailsViewModel.getShouldDisplayAmounts(order);

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
    </DashboardCard>
  );
};
