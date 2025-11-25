// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { MetadataIdSchema } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForOrderDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  OrderErrorFragment,
  OrderNoteUpdateMutation,
  OrderStatus,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { defaultGraphiQLQuery } from "@dashboard/orders/queries";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { orderShouldUseTransactions } from "@dashboard/orders/types";
import { orderListUrl } from "@dashboard/orders/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button, Divider } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";
import { useIntl } from "react-intl";

import { getMutationErrors, maybe } from "../../../misc";
import OrderChannelSectionCard from "../OrderChannelSectionCard";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { OrderFulfillmentCard } from "../OrderFulfillmentCard/OrderFulfillmentCard";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderInvoiceList from "../OrderInvoiceList";
import { OrderSummary } from "../OrderSummary/OrderSummary";
import { OrderTransactionsSection } from "../OrderTransactionsSection/OrderTransactionsSection";
import OrderUnfulfilledProductsCard from "../OrderUnfulfilledProductsCard/OrderUnfulfilledProductsCard";
import { messages } from "./messages";
import Title from "./Title";
import {
  createOrderMetadataIdSchema,
  filteredConditionalItems,
  hasAnyItemsReplaceable,
} from "./utils";

interface OrderDetailsPageProps {
  order: OrderDetailsFragment | OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (id: string, data: OrderDraftDetailsProductsFormData) => void;
  onOrderLineRemove?: (id: string) => void;
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
  onSubmit: (data: MetadataIdSchema) => SubmitPromise;
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
    onShippingMethodEdit,
    onTransactionAction,
    onAddManualTransaction,
    onOrderLineShowMetadata,
    onOrderShowMetadata,
    onFulfillmentShowMetadata,
    onMarkAsPaid,
    onRefundAdd,
    onSubmit,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();
  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const notAllowedToFulfillUnpaid =
    shop?.fulfillmentAutoApprove && !shop?.fulfillmentAllowUnpaid && !order?.isPaid;
  const unfulfilled = (order?.lines || []).filter(line => line.quantityToFulfill > 0);
  const handleSubmit = async (data: MetadataIdSchema) => {
    const result = await onSubmit(data);

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
  const selectCardMenuItems = filteredConditionalItems([
    {
      item: {
        label: intl.formatMessage(messages.cancelOrder),
        onSelect: onOrderCancel,
      },
      shouldExist: canCancel,
    },
    {
      item: {
        label: intl.formatMessage(messages.returnOrder),
        onSelect: onOrderReturn,
      },
      shouldExist: hasAnyItemsReplaceable(order),
    },
  ]);
  const { ORDER_DETAILS_MORE_ACTIONS, ORDER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.ORDER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForOrderDetails(
    ORDER_DETAILS_MORE_ACTIONS,
    order?.id,
  );
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${order?.id}" }`);
    context.setDevModeVisibility(true);
  };

  const backLinkUrl = useBackLinkWithState({
    path: orderListUrl(),
  });

  return (
    <Form confirmLeave initial={initial} onSubmit={handleSubmit} mergeData={false}>
      {({ submit }) => {
        return (
          <DetailPageLayout>
            <TopNav href={backLinkUrl} title={<Title order={order} />}>
              <Box position="relative" marginRight={3}>
                <Button
                  variant="secondary"
                  icon={<Code />}
                  onClick={onOrderShowMetadata}
                  data-test-id="show-order-metadata"
                  title="Edit order metadata"
                />
                <Box position="absolute" __top="-4px" __right="-4px">
                  <Ripple model={rippleOrderMetadata} />
                </Box>
              </Box>

              <TopNav.Menu
                dataTestId="menu"
                items={[
                  ...selectCardMenuItems,
                  ...extensionMenuItems,
                  {
                    label: intl.formatMessage(messages.openGraphiQL),
                    onSelect: openPlaygroundURL,
                    testId: "graphiql-redirect",
                  },
                ]}
              />
            </TopNav>

            <DetailPageLayout.Content data-test-id="order-fulfillment">
              {!isOrderUnconfirmed ? (
                <OrderUnfulfilledProductsCard
                  showFulfillmentAction={canFulfill}
                  notAllowedToFulfillUnpaid={notAllowedToFulfillUnpaid}
                  lines={unfulfilled}
                  onFulfill={onOrderFulfill}
                  loading={loading}
                  onOrderLineShowMetadata={onOrderLineShowMetadata}
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
                    onShippingMethodEdit={onShippingMethodEdit}
                  />
                  <CardSpacer />
                </>
              )}
              {order?.fulfillments?.map(fulfillment => (
                <OrderFulfillmentCard
                  dataTestId="fulfilled-order-section"
                  key={fulfillment.id}
                  fulfillment={fulfillment}
                  fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
                  order={order}
                  onOrderLineShowMetadata={onOrderLineShowMetadata}
                  onFulfillmentShowMetadata={() => onFulfillmentShowMetadata(fulfillment.id)}
                  onOrderFulfillmentCancel={() => onFulfillmentCancel(fulfillment.id)}
                  onTrackingCodeAdd={() => onFulfillmentTrackingNumberUpdate(fulfillment.id)}
                  onOrderFulfillmentApprove={() => onFulfillmentApprove(fulfillment.id)}
                />
              ))}

              {order && (
                <>
                  <OrderSummary
                    order={order}
                    onMarkAsPaid={onMarkAsPaid}
                    useLegacyPaymentsApi={!orderShouldUseTransactions(order)}
                    onLegacyPaymentsApiCapture={onPaymentCapture}
                    onLegacyPaymentsApiRefund={onPaymentRefund}
                    onLegacyPaymentsApiVoid={onPaymentVoid}
                  />
                  <CardSpacer />

                  {orderShouldUseTransactions(order) && (
                    <OrderTransactionsSection
                      order={order}
                      shop={shop}
                      onTransactionAction={onTransactionAction}
                      onPaymentCapture={onPaymentCapture}
                      onPaymentVoid={onPaymentVoid}
                      onAddManualTransaction={onAddManualTransaction}
                      onRefundAdd={onRefundAdd}
                    />
                  )}
                </>
              )}

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
              <OrderChannelSectionCard channel={order?.channel} />
              <CardSpacer />
              {!isOrderUnconfirmed && (
                <>
                  <OrderInvoiceList
                    invoices={order?.invoices}
                    onInvoiceClick={onInvoiceClick}
                    onInvoiceGenerate={onInvoiceGenerate}
                    onInvoiceSend={onInvoiceSend}
                  />
                  <CardSpacer />
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
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
