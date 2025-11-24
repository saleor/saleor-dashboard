import { OrderAction, OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { extractOrderGiftCardUsedAmount } from "../OrderSummaryCard/utils";
import { LegacyPaymentsApiButtons } from "./LegacyPaymentsApiButtons";
import { OrderValue } from "./OrderValue";
import { PaymentsSummary } from "./PaymentsSummary";
import { TransactionsApiButtons } from "./TransactionsApiButtons";

type OrderSummaryWithLegacyApi = {
  useLegacyPaymentsApi: true;
  onLegacyPaymentsApiCapture: () => any;
  onLegacyPaymentsApiRefund: () => any;
  onLegacyPaymentsApiVoid: () => any;
};

type OrderSummaryWithoutLegacyApi = {
  useLegacyPaymentsApi?: false;
};

type Props = PropsWithBox<
  {
    order: OrderDetailsFragment;
    onMarkAsPaid: () => any;
  } & (OrderSummaryWithLegacyApi | OrderSummaryWithoutLegacyApi)
>;

export const OrderSummary = (props: Props) => {
  const { order, onMarkAsPaid, useLegacyPaymentsApi = false, ...restProps } = props;
  const intl = useIntl();
  // TODO: extract those helpers into OrderDetailsViewModel
  const giftCardsAmount = extractOrderGiftCardUsedAmount(order);
  const usedGiftCards = OrderDetailsViewModel.getUsedGiftCards(order.giftCards);
  const canMarkAsPaid = order.actions.includes(OrderAction.MARK_AS_PAID);
  const canGrantRefund = order.transactions.length > 0 || order.payments.length > 0;
  const canSendRefund = order.grantedRefunds.length > 0;
  const canAnyRefund = canGrantRefund || canSendRefund;
  const hasGiftCards = (giftCardsAmount ?? 0) > 0;
  const shouldDisplay = OrderDetailsViewModel.getShouldDisplayAmounts(order);

  const hasNoPayment =
    !canAnyRefund && !shouldDisplay.charged && !shouldDisplay.authorized && !hasGiftCards;

  const canCapture = order.actions.includes(OrderAction.CAPTURE);
  const canVoid = order.actions.includes(OrderAction.VOID);
  const canRefund = order.actions.includes(OrderAction.REFUND);

  return (
    <Box padding={6} display="grid" gap={6} {...restProps} data-test-id="OrderSummary">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Order summary",
            id: "SB//YQ",
          })}
        </Text>

        {useLegacyPaymentsApi ? (
          <LegacyPaymentsApiButtons
            order={order}
            canCapture={canCapture}
            canVoid={canVoid}
            canRefund={canRefund}
            canMarkAsPaid={canMarkAsPaid}
            onMarkAsPaid={onMarkAsPaid}
            onLegacyPaymentsApiCapture={
              "onLegacyPaymentsApiCapture" in props ? props.onLegacyPaymentsApiCapture : undefined
            }
            onLegacyPaymentsApiRefund={
              "onLegacyPaymentsApiRefund" in props ? props.onLegacyPaymentsApiRefund : undefined
            }
            onLegacyPaymentsApiVoid={
              "onLegacyPaymentsApiVoid" in props ? props.onLegacyPaymentsApiVoid : undefined
            }
          />
        ) : (
          <TransactionsApiButtons
            canMarkAsPaid={canMarkAsPaid}
            onMarkAsPaid={onMarkAsPaid}
            hasNoPayment={hasNoPayment}
          />
        )}
      </Box>

      <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={3}>
        <OrderValue
          orderSubtotal={order?.subtotal}
          shippingMethodName={order?.shippingMethodName}
          shippingPrice={order.shippingPrice}
          orderTotal={order.total}
          discounts={order.discounts}
          orderId={order.id}
          giftCardsAmount={giftCardsAmount ?? null}
          usedGiftCards={usedGiftCards}
        />
        <PaymentsSummary
          hasNoPayment={hasNoPayment}
          orderAmounts={{
            totalAuthorized: order.totalAuthorized,
            totalCaptured: order.totalCaptured,
            totalRefunded: order.totalRefunded,
            totalBalance: order.totalBalance,
            total: order.total,
            totalAuthorizePending: order.totalAuthorizePending,
            totalCharged: order.totalCharged,
            totalChargePending: order.totalChargePending,
            totalCanceled: order.totalCanceled,
            totalCancelPending: order.totalCancelPending,
          }}
          order={order}
        />
      </Box>
    </Box>
  );
};
