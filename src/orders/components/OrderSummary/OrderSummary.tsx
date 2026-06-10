import { type OrderDetailsFragment, type OrderErrorFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { type OrderDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { Box, type PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getLineDiscountsSummary } from "./getLineDiscountsSummary";
import { getUndiscountedSubtotal } from "./getUndiscountedSubtotal";
import { LegacyPaymentsApiButtons } from "./LegacyPaymentsApiButtons";
import { OrderValue } from "./OrderValue";
import { PaymentsSummary } from "./PaymentsSummary";
import { TransactionsApiButtons } from "./TransactionsApiButtons";

type EditableOrderSummary = {
  isEditable: true;
  onShippingMethodEdit: () => void;
  errors?: OrderErrorFragment[];
} & OrderDiscountContextConsumerProps;

type ReadOnlyOrderSummary = {
  isEditable?: false;
};

type Props = PropsWithBox<
  {
    order: OrderDetailsFragment;
    onMarkAsPaid?: () => void;
    useLegacyPaymentsApi?: boolean;
    onLegacyPaymentsApiCapture?: () => void;
    onLegacyPaymentsApiRefund?: () => void;
    onLegacyPaymentsApiVoid?: () => void;
  } & (EditableOrderSummary | ReadOnlyOrderSummary)
>;

export const OrderSummary = (props: Props) => {
  const { order, onMarkAsPaid, useLegacyPaymentsApi = false, isEditable = false } = props;
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

  const editableProps = isEditable ? (props as Props & EditableOrderSummary) : null;

  const lineDiscountsSummary = useMemo(() => getLineDiscountsSummary(order.lines), [order.lines]);
  const undiscountedSubtotal = useMemo(
    // Subtotal/shipping/total amounts in OrderValue always use gross; `displayGrossPrices`
    // only changes how the taxes row is labeled (included vs broken out).
    () => getUndiscountedSubtotal(order.lines, true),
    [order.lines],
  );

  return (
    <Box padding={6} display="grid" gap={6} data-test-id="OrderSummary">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Summary",
            id: "RrCui3",
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
          onMarkAsPaid && (
            <TransactionsApiButtons
              canMarkAsPaid={canMarkAsPaid}
              onMarkAsPaid={onMarkAsPaid}
              hasNoPayment={hasNoPayment}
            />
          )
        )}
      </Box>

      <Box display="grid" __gridTemplateColumns="1fr 1fr" gap={3}>
        {isEditable && editableProps ? (
          <OrderValue
            orderSubtotal={order.subtotal}
            shippingMethodName={order.shippingMethodName}
            shippingPrice={order.shippingPrice}
            orderTotal={order.total}
            discounts={order.discounts}
            voucherId={order.voucher?.id ?? null}
            giftCardsAmount={giftCardsAmount ?? null}
            usedGiftCards={usedGiftCards}
            displayGrossPrices={order.displayGrossPrices}
            lineDiscountsSummary={lineDiscountsSummary}
            undiscountedSubtotal={undiscountedSubtotal}
            isEditable={true}
            onShippingMethodEdit={editableProps.onShippingMethodEdit}
            shippingMethods={order.shippingMethods}
            shippingMethod={order.shippingMethod}
            shippingAddress={order.shippingAddress}
            isShippingRequired={order.isShippingRequired}
            errors={editableProps.errors}
            orderDiscount={editableProps.orderDiscount}
            addOrderDiscount={editableProps.addOrderDiscount}
            removeOrderDiscount={editableProps.removeOrderDiscount}
            openDialog={editableProps.openDialog}
            closeDialog={editableProps.closeDialog}
            isDialogOpen={editableProps.isDialogOpen}
            orderDiscountAddStatus={editableProps.orderDiscountAddStatus}
            orderDiscountRemoveStatus={editableProps.orderDiscountRemoveStatus}
            undiscountedPrice={editableProps.undiscountedPrice}
          />
        ) : (
          <OrderValue
            orderSubtotal={order.subtotal}
            shippingMethodName={order.shippingMethodName}
            shippingPrice={order.shippingPrice}
            orderTotal={order.total}
            discounts={order.discounts}
            voucherId={order.voucher?.id ?? null}
            isShippingRequired={order.isShippingRequired}
            shippingMethods={order.shippingMethods}
            shippingMethod={order.shippingMethod}
            giftCardsAmount={giftCardsAmount ?? null}
            usedGiftCards={usedGiftCards}
            displayGrossPrices={order.displayGrossPrices}
            lineDiscountsSummary={lineDiscountsSummary}
            undiscountedSubtotal={undiscountedSubtotal}
          />
        )}
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
