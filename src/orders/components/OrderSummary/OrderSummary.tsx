import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { OrderDetailsViewModel } from "@dashboard/orders/utils/OrderDetailsViewModel";
import { OrderDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

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
    onMarkAsPaid: () => any;
    useLegacyPaymentsApi?: boolean;
    onLegacyPaymentsApiCapture?: () => any;
    onLegacyPaymentsApiRefund?: () => any;
    onLegacyPaymentsApiVoid?: () => any;
  } & (EditableOrderSummary | ReadOnlyOrderSummary)
>;

export const OrderSummary = (props: Props) => {
  const {
    order,
    onMarkAsPaid,
    useLegacyPaymentsApi = false,
    isEditable = false,
    ...restProps
  } = props;
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

  // Extract editable props
  const editableProps = isEditable ? (props as Props & EditableOrderSummary) : null;

  // Filter out props that shouldn't be passed to the DOM
  const {
    isEditable: _isEditable,
    onShippingMethodEdit: _onShippingMethodEdit,
    errors: _errors,
    orderDiscount: _orderDiscount,
    addOrderDiscount: _addOrderDiscount,
    removeOrderDiscount: _removeOrderDiscount,
    openDialog: _openDialog,
    closeDialog: _closeDialog,
    isDialogOpen: _isDialogOpen,
    orderDiscountAddStatus: _orderDiscountAddStatus,
    orderDiscountRemoveStatus: _orderDiscountRemoveStatus,
    undiscountedPrice: _undiscountedPrice,
    discountedPrice: _discountedPrice,
    onLegacyPaymentsApiCapture: _onLegacyPaymentsApiCapture,
    onLegacyPaymentsApiRefund: _onLegacyPaymentsApiRefund,
    onLegacyPaymentsApiVoid: _onLegacyPaymentsApiVoid,
    onTestCaptureFull: _onTestCaptureFull,
    onTestCapturePartial: _onTestCapturePartial,
    onTestCaptureNone: _onTestCaptureNone,
    ...boxProps
  } = restProps as any;

  return (
    <Box padding={6} display="grid" gap={6} {...boxProps} data-test-id="OrderSummary">
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
          <TransactionsApiButtons
            canMarkAsPaid={canMarkAsPaid}
            onMarkAsPaid={onMarkAsPaid}
            hasNoPayment={hasNoPayment}
          />
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
            giftCardsAmount={giftCardsAmount ?? null}
            usedGiftCards={usedGiftCards}
            displayGrossPrices={order.displayGrossPrices}
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
            giftCardsAmount={giftCardsAmount ?? null}
            usedGiftCards={usedGiftCards}
            displayGrossPrices={order.displayGrossPrices}
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
