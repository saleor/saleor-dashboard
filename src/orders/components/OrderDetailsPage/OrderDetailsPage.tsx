// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { mapExtensionMenuItemsToTopNavItems } from "@dashboard/components/AppLayout/TopNav/mapExtensionMenuItems";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForOrderDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type OrderDetailsFragment,
  type OrderDetailsQuery,
  type OrderErrorFragment,
  type OrderNoteUpdateMutation,
  OrderStatus,
  type TransactionActionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { defaultGraphiQLQuery } from "@dashboard/orders/queries";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { orderShouldUseTransactions } from "@dashboard/orders/types";
import { orderListUrl } from "@dashboard/orders/urls";
import { OrderDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { Divider } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, maybe } from "../../../misc";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import { OrderDetailsItemsSection } from "../OrderDetailsItemsSection/OrderDetailsItemsSection";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { type FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { OrderFulfillmentCard } from "../OrderFulfillmentCard/OrderFulfillmentCard";
import { type FormData as HistoryFormData, OrderHistory } from "../OrderHistory";
import OrderInvoiceList from "../OrderInvoiceList";
import { LinePriceWaterfallModal } from "../OrderLinePriceBreakdown/components/LinePriceWaterfallModal";
import { useOrderLinePriceWaterfall } from "../OrderLinePriceBreakdown/hooks/useOrderLinePriceWaterfall";
import { OrderSummary } from "../OrderSummary/OrderSummary";
import { OrderTransactionsSection } from "../OrderTransactionsSection/OrderTransactionsSection";
import { messages } from "./messages";
import Title from "./Title";
import { createOrderMetadataIdSchema } from "./utils";

interface OrderDetailsPageProps {
  order: OrderDetailsFragment | OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  loading: boolean;
  saveButtonBarState?: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (id: string, data: OrderDraftDetailsProductsFormData) => void;
  onOrderLineRemove?: (id: string) => void;
  orderLineRemoveConfirmState?: ConfirmButtonTransitionState;
  orderLineRemoveErrors?: OrderErrorFragment[];
  onShippingMethodEdit?: () => void;
  onBillingAddressEdit: () => any;
  onFulfillmentApprove: (id: string) => any;
  onFulfillmentCancel: (id: string) => any;
  onOrderLineShowMetadata: (id: string) => void;
  onOrderShowMetadata: () => void;
  onFulfillmentShowMetadata: (id: string) => void;
  onFulfillmentTrackingNumberUpdate: (id: string) => any;
  onOrderFulfill: () => any;
  onProductClick?: (id: string) => any;
  onPaymentCapture: () => any;
  onMarkAsPaid: () => any;
  onPaymentRefund: () => any;
  onPaymentVoid: () => any;
  onShippingAddressEdit: () => any;
  onOrderCancel: () => any;
  onNoteAdd: (data: HistoryFormData) => any;
  onNoteUpdate: (id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>;
  onNoteUpdateLoading: boolean;
  onProfileView: () => any;
  onOrderReturn: () => any;
  onInvoiceClick: (invoiceId: string) => any;
  onInvoiceGenerate: () => any;
  onInvoiceSend: (invoiceId: string) => any;
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => any;
  onAddManualTransaction: () => any;
  onRefundAdd: () => void;
  onSubmit?: (data: MetadataIdSchema) => SubmitPromise;
  focusedLineId?: string;
  onFocusedLineChange?: (lineId: string | null) => void;
}

const OrderDetailsPage = (props: OrderDetailsPageProps) => {
  const {
    loading,
    order,
    shop,
    saveButtonBarState,
    errors,
    onBillingAddressEdit,
    onFulfillmentApprove,
    onFulfillmentCancel,
    onFulfillmentTrackingNumberUpdate,
    onNoteAdd,
    onNoteUpdate,
    onNoteUpdateLoading,
    onOrderCancel,
    onOrderFulfill,
    onPaymentCapture,
    onPaymentRefund,
    onPaymentVoid,
    onShippingAddressEdit,
    onProfileView,
    onInvoiceClick,
    onInvoiceGenerate,
    onInvoiceSend,
    onOrderReturn,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    orderLineRemoveConfirmState,
    orderLineRemoveErrors,
    onShippingMethodEdit,
    onTransactionAction,
    onAddManualTransaction,
    onOrderLineShowMetadata,
    onOrderShowMetadata,
    onFulfillmentShowMetadata,
    onMarkAsPaid,
    onRefundAdd,
    onSubmit,
    focusedLineId,
    onFocusedLineChange,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();
  const orderDiscountContext = useContext(OrderDiscountContext);
  const [pricingLineId, setPricingLineId] = useState<string | null>(null);
  const pricingWaterfall = useOrderLinePriceWaterfall({ order, lineId: pricingLineId });
  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const notAllowedToFulfillUnpaid =
    shop?.fulfillmentAutoApprove && !shop?.fulfillmentAllowUnpaid && !order?.isPaid;
  const unfulfilled = (order?.lines || []).filter(line => line.quantityToFulfill > 0);
  const handleSubmit = async (data: MetadataIdSchema) => {
    if (!onSubmit) {
      return [];
    }

    const result = await onSubmit(data);

    if (Array.isArray(result)) {
      return result;
    }

    return getMutationErrors(result);
  };
  const initial = createOrderMetadataIdSchema(order);
  const saveLabel = isOrderUnconfirmed
    ? { confirm: intl.formatMessage(messages.confirmOrder) }
    : undefined;
  const allowSave = () => {
    if (!isOrderUnconfirmed) {
      return loading;
    } else if (!order?.lines?.length) {
      return true;
    }

    return loading;
  };
  const { ORDER_DETAILS_MORE_ACTIONS, ORDER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.ORDER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForOrderDetails(
    ORDER_DETAILS_MORE_ACTIONS,
    order?.id,
  );
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${order?.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, order?.id]);
  const menuItems = useMemo(
    () => [
      ...mapExtensionMenuItemsToTopNavItems(extensionMenuItems),
      {
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      },
      ...(canCancel
        ? [
            {
              label: intl.formatMessage(messages.cancelOrder),
              onSelect: onOrderCancel,
              testId: "cancel-order",
              color: "critical1" as const,
              icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            },
          ]
        : []),
    ],
    [canCancel, extensionMenuItems, intl, onOrderCancel, openPlaygroundURL],
  );

  const backLinkUrl = useBackLinkWithState({
    path: orderListUrl(),
  });

  const renderLayout = (submit?: () => SubmitPromise<any[]>) => (
    <DetailPageLayout withSavebar={isOrderUnconfirmed}>
      <TopNav href={backLinkUrl} title={<Title order={order} />} actionsGap={3}>
        <TopNav.MetadataButton
          onClick={onOrderShowMetadata}
          data-test-id="show-order-metadata"
          title={intl.formatMessage(messages.editOrderMetadata)}
          ripple={rippleOrderMetadata}
        />

        <TopNav.Menu dataTestId="menu" items={menuItems} />
      </TopNav>

      <DetailPageLayout.Content data-test-id="order-fulfillment">
        {!isOrderUnconfirmed ? (
          <OrderDetailsItemsSection
            order={order}
            shop={shop}
            loading={loading}
            canFulfill={canFulfill}
            notAllowedToFulfillUnpaid={notAllowedToFulfillUnpaid}
            onOrderFulfill={onOrderFulfill}
            onOrderReturn={onOrderReturn}
            onFulfillmentApprove={onFulfillmentApprove}
            onFulfillmentCancel={onFulfillmentCancel}
            onFulfillmentTrackingNumberUpdate={onFulfillmentTrackingNumberUpdate}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
            onFulfillmentShowMetadata={onFulfillmentShowMetadata}
            onShowLinePriceBreakdown={setPricingLineId}
            focusedLineId={focusedLineId}
            onFocusedLineChange={onFocusedLineChange}
          />
        ) : (
          <>
            <OrderDraftDetails
              order={order}
              errors={errors}
              loading={loading}
              onOrderLineShowMetadata={onOrderLineShowMetadata}
              onOrderLineAdd={onOrderLineAdd}
              onOrderLineChange={onOrderLineChange}
              onOrderLineRemove={onOrderLineRemove}
              orderLineRemoveConfirmState={orderLineRemoveConfirmState}
              orderLineRemoveErrors={orderLineRemoveErrors}
            />
            <CardSpacer />
          </>
        )}
        {isOrderUnconfirmed &&
          order?.fulfillments?.map((fulfillment, index) => (
            <OrderFulfillmentCard
              key={fulfillment.id}
              dataTestId="fulfilled-order-section"
              fulfillment={fulfillment}
              fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
              order={order}
              onOrderLineShowMetadata={onOrderLineShowMetadata}
              onShowLinePriceBreakdown={setPricingLineId}
              onFulfillmentShowMetadata={() => onFulfillmentShowMetadata(fulfillment.id)}
              onOrderFulfillmentCancel={() => onFulfillmentCancel(fulfillment.id)}
              onTrackingCodeAdd={() => onFulfillmentTrackingNumberUpdate(fulfillment.id)}
              onOrderFulfillmentApprove={() => onFulfillmentApprove(fulfillment.id)}
              showBottomSeparator={index < (order.fulfillments?.length ?? 0) - 1}
            />
          ))}

        {order && !isOrderUnconfirmed && (
          <>
            {(unfulfilled.length > 0 || (order.fulfillments?.length ?? 0) > 0) && <CardSpacer />}
            <OrderSummary
              order={order}
              onMarkAsPaid={onMarkAsPaid}
              useLegacyPaymentsApi={!orderShouldUseTransactions(order)}
              onLegacyPaymentsApiCapture={onPaymentCapture}
              onLegacyPaymentsApiRefund={onPaymentRefund}
              onLegacyPaymentsApiVoid={onPaymentVoid}
            />

            {orderShouldUseTransactions(order) && (
              <>
                <CardSpacer />
                <OrderTransactionsSection
                  order={order}
                  shop={shop}
                  onTransactionAction={onTransactionAction}
                  onPaymentCapture={onPaymentCapture}
                  onPaymentVoid={onPaymentVoid}
                  onAddManualTransaction={onAddManualTransaction}
                  onRefundAdd={onRefundAdd}
                />
              </>
            )}
          </>
        )}

        {order && isOrderUnconfirmed && orderDiscountContext && (
          <>
            {(order.fulfillments?.length ?? 0) > 0 && <CardSpacer />}
            <OrderSummary
              order={order}
              onMarkAsPaid={onMarkAsPaid}
              useLegacyPaymentsApi={!orderShouldUseTransactions(order)}
              onLegacyPaymentsApiCapture={onPaymentCapture}
              onLegacyPaymentsApiRefund={onPaymentRefund}
              onLegacyPaymentsApiVoid={onPaymentVoid}
              isEditable
              onShippingMethodEdit={onShippingMethodEdit}
              errors={errors}
              {...orderDiscountContext}
            />

            {orderShouldUseTransactions(order) && (
              <>
                <CardSpacer />
                <OrderTransactionsSection
                  order={order}
                  shop={shop}
                  onTransactionAction={onTransactionAction}
                  onPaymentCapture={onPaymentCapture}
                  onPaymentVoid={onPaymentVoid}
                  onAddManualTransaction={onAddManualTransaction}
                  onRefundAdd={onRefundAdd}
                />
              </>
            )}
          </>
        )}

        <CardSpacer />
        <OrderHistory
          history={order?.events}
          onNoteUpdateLoading={onNoteUpdateLoading}
          orderCurrency={order?.total?.gross.currency}
          onNoteAdd={onNoteAdd}
          onNoteUpdate={onNoteUpdate}
        />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <OrderCustomer
          canEditAddresses={canEditAddresses}
          canEditCustomer={false}
          order={order}
          errors={errors}
          onBillingAddressEdit={onBillingAddressEdit}
          onShippingAddressEdit={onShippingAddressEdit}
          onProfileView={onProfileView}
        />
        <CardSpacer />
        <Divider />
        {!isOrderUnconfirmed && (
          <>
            <OrderInvoiceList
              invoices={order?.invoices}
              onInvoiceClick={onInvoiceClick}
              onInvoiceGenerate={onInvoiceGenerate}
              onInvoiceSend={onInvoiceSend}
            />
            <CardSpacer />
            <Divider />
          </>
        )}
        <OrderCustomerNote note={maybe(() => order.customerNote)} />
        {ORDER_DETAILS_WIDGETS.length > 0 && order?.id && (
          <>
            <CardSpacer />
            <Divider />
            <AppWidgets extensions={ORDER_DETAILS_WIDGETS} params={{ orderId: order.id }} />
          </>
        )}
      </DetailPageLayout.RightSidebar>
      {isOrderUnconfirmed && submit && saveButtonBarState && (
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(orderListUrl())} />
          <Savebar.ConfirmButton
            transitionState={saveButtonBarState}
            onClick={submit}
            disabled={allowSave()}
          >
            {saveLabel?.confirm}
          </Savebar.ConfirmButton>
        </Savebar>
      )}
      {pricingWaterfall && (
        <LinePriceWaterfallModal
          waterfall={pricingWaterfall}
          onClose={() => setPricingLineId(null)}
        />
      )}
    </DetailPageLayout>
  );

  if (isOrderUnconfirmed && onSubmit) {
    return (
      <Form confirmLeave initial={initial} onSubmit={handleSubmit} mergeData={false}>
        {({ submit }) => renderLayout(submit)}
      </Form>
    );
  }

  return renderLayout();
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
