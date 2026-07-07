// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForDraftOrderDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type ChannelUsabilityDataQuery,
  type OrderDetailsFragment,
  type OrderErrorFragment,
  type OrderLineInput,
  type OrderNoteUpdateMutation,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { rippleDraftOrderMetadata } from "@dashboard/orders/ripples/draftOrderMetadata";
import { orderDraftListUrl } from "@dashboard/orders/urls";
import { OrderDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { Divider } from "@saleor/macaw-ui-next";
import { useContext } from "react";
import { useIntl } from "react-intl";

import OrderCustomer from "../OrderCustomer";
import { messages as orderDetailsPageMessages } from "../OrderDetailsPage/messages";
import Title from "../OrderDetailsPage/Title";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { type FormData as HistoryFormData, OrderHistory } from "../OrderHistory";
import { OrderSummary } from "../OrderSummary/OrderSummary";
import OrderDraftAlert from "./OrderDraftAlert";

interface OrderDraftPageProps {
  loading?: boolean;
  disabled: boolean;
  order?: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  errors: OrderErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBillingAddressEdit: () => void;
  onCustomerChangeClick: () => void;
  onDraftFinalize: () => void;
  onDraftRemove: () => void;
  onNoteAdd: (data: HistoryFormData) => SubmitPromise<any[]>;
  onNoteUpdateLoading: boolean;
  onNoteUpdate: (id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>;
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  orderLineRemoveConfirmState?: ConfirmButtonTransitionState;
  orderLineRemoveErrors?: OrderErrorFragment[];
  onProductClick: (id: string) => void;
  onShippingAddressEdit: () => void;
  onShippingMethodEdit: () => void;
  onProfileView: () => void;
  onOrderLineShowMetadata: (id: string) => void;
  onOrderShowMetadata: () => void;
}

const draftOrderListUrl = orderDraftListUrl();

const OrderDraftPage = (props: OrderDraftPageProps) => {
  const {
    loading,
    saveButtonBarState,
    onBillingAddressEdit,
    onCustomerChangeClick,
    onDraftFinalize,
    onDraftRemove,
    onNoteAdd,
    onNoteUpdateLoading,
    onNoteUpdate,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    orderLineRemoveConfirmState,
    orderLineRemoveErrors,
    onShippingAddressEdit,
    onShippingMethodEdit,
    onProfileView,
    onOrderLineShowMetadata,
    onOrderShowMetadata,
    order,
    channelUsabilityData,
    errors,
    disabled,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();
  const orderDiscountContext = useContext(OrderDiscountContext);
  const backLinkUrl = useBackLinkWithState({
    path: draftOrderListUrl,
  });

  const { DRAFT_ORDER_DETAILS_MORE_ACTIONS, DRAFT_ORDER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.DRAFT_ORDER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForDraftOrderDetails(
    DRAFT_ORDER_DETAILS_MORE_ACTIONS,
    order?.id,
  );

  return (
    <DetailPageLayout>
      <TopNav href={backLinkUrl} title={<Title order={order} />} actionsGap={3}>
        <TopNav.MetadataButton
          onClick={onOrderShowMetadata}
          disabled={!order}
          data-test-id="show-order-metadata"
          title={intl.formatMessage(orderDetailsPageMessages.editOrderMetadata)}
          ripple={rippleDraftOrderMetadata}
        />
        <TopNav.Menu
          items={[
            {
              label: intl.formatMessage({
                id: "PAqicb",
                defaultMessage: "Cancel order",
                description: "button",
              }),
              onSelect: onDraftRemove,
              color: "critical1" as const,
            },
            ...extensionMenuItems,
          ]}
          dataTestId="menu"
        />
      </TopNav>
      <DetailPageLayout.Content>
        <OrderDraftAlert order={order} channelUsabilityData={channelUsabilityData} />
        <OrderDraftDetails
          order={order as OrderDetailsFragment}
          channelUsabilityData={channelUsabilityData}
          errors={errors}
          loading={loading}
          orderLineRemoveConfirmState={orderLineRemoveConfirmState}
          orderLineRemoveErrors={orderLineRemoveErrors}
          onOrderLineAdd={onOrderLineAdd}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onOrderLineShowMetadata={onOrderLineShowMetadata}
        />
        {order && orderDiscountContext && (
          <>
            <CardSpacer />
            <OrderSummary
              order={order}
              isEditable
              onShippingMethodEdit={onShippingMethodEdit}
              errors={errors}
              {...orderDiscountContext}
            />
            <CardSpacer />
          </>
        )}
        <OrderHistory
          history={order?.events}
          orderCurrency={order?.total?.gross.currency}
          onNoteAdd={onNoteAdd}
          onNoteUpdate={onNoteUpdate}
          onNoteUpdateLoading={onNoteUpdateLoading}
        />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <OrderCustomer
          canEditAddresses={!!order?.user}
          canEditCustomer={true}
          errors={errors}
          order={order as OrderDetailsFragment}
          onBillingAddressEdit={onBillingAddressEdit}
          onCustomerChangeClick={onCustomerChangeClick}
          onProfileView={onProfileView}
          onShippingAddressEdit={onShippingAddressEdit}
        />
        {DRAFT_ORDER_DETAILS_WIDGETS.length > 0 && order.id && (
          <>
            <CardSpacer />
            <Divider />
            <AppWidgets extensions={DRAFT_ORDER_DETAILS_WIDGETS} params={{ orderId: order.id }} />
          </>
        )}
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={() => navigate(orderDraftListUrl())} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={onDraftFinalize}
          disabled={disabled}
        >
          {intl.formatMessage({
            id: "4Z14xW",
            defaultMessage: "Finalize",
            description: "button",
          })}
        </Savebar.ConfirmButton>
      </Savebar>
    </DetailPageLayout>
  );
};

OrderDraftPage.displayName = "OrderDraftPage";
export default OrderDraftPage;
