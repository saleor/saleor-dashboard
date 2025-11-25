import { OrderDetailsFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

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
  const giftCardsAmount = OrderDetailsViewModel.getGiftCardsAmountUsed({
    id: order.id,
    giftCards: order.giftCards,
  });
  const usedGiftCards = OrderDetailsViewModel.getUsedGiftCards(order.giftCards);
  const canMarkAsPaid = OrderDetailsViewModel.canOrderBeMarkedAsPaid(order.actions);
  const canAnyRefund = OrderDetailsViewModel.canAnyRefund(order);
  const hasGiftCards = OrderDetailsViewModel.hasGiftCards(giftCardsAmount);
  const shouldDisplay = OrderDetailsViewModel.getShouldDisplayAmounts(order);
  const hasNoPayment = OrderDetailsViewModel.hasNoPayment({
    canAnyRefund,
    shouldDisplay,
    hasGiftCards,
  });
  const canCapture = OrderDetailsViewModel.canOrderCapture(order.actions);
  const canVoid = OrderDetailsViewModel.canOrderVoid(order.actions);
  const canRefund = OrderDetailsViewModel.canOrderRefund(order.actions);

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
          orderSubtotal={order.subtotal}
          shippingMethodName={order.shippingMethodName}
          shippingPrice={order.shippingPrice}
          orderTotal={order.total}
          discounts={order.discounts}
          giftCardsAmount={giftCardsAmount ?? null}
          usedGiftCards={usedGiftCards}
          displayGrossPrices={order.displayGrossPrices}
        />
        <PaymentsSummary
          hasNoPayment={hasNoPayment}
          orderAmounts={{
            totalAuthorized: order.totalAuthorized,
            totalCaptured: order.totalCaptured,
            totalBalance: order.totalBalance,
          }}
          order={order}
        />
      </Box>
    </Box>
  );
};
