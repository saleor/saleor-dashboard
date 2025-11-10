// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DateTime } from "@dashboard/components/Date";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForDraftOrderDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
  OrderNoteUpdateMutation,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import OrderChannelSectionCard from "@dashboard/orders/components/OrderChannelSectionCard";
import { orderDraftListUrl } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Box, Divider, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import OrderCustomer, { CustomerEditData } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderDraftAlert from "./OrderDraftAlert";

interface OrderDraftPageProps extends FetchMoreProps {
  disabled: boolean;
  order?: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  users: RelayToFlat<SearchCustomersQuery["search"]>;
  usersLoading: boolean;
  errors: OrderErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchUsers: (query: string) => void;
  onBillingAddressEdit: () => void;
  onCustomerEdit: (data: CustomerEditData) => void;
  onDraftFinalize: () => void;
  onDraftRemove: () => void;
  onNoteAdd: (data: HistoryFormData) => SubmitPromise<any[]>;
  onNoteUpdateLoading: boolean;
  onNoteUpdate: (id: string, message: string) => Promise<FetchResult<OrderNoteUpdateMutation>>;
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  onProductClick: (id: string) => void;
  onShippingAddressEdit: () => void;
  onShippingMethodEdit: () => void;
  onProfileView: () => void;
  onOrderLineShowMetadata: (id: string) => void;
}

const draftOrderListUrl = orderDraftListUrl();

const OrderDraftPage = (props: OrderDraftPageProps) => {
  const {
    loading,
    fetchUsers,
    hasMore,
    saveButtonBarState,
    onBillingAddressEdit,
    onCustomerEdit,
    onDraftFinalize,
    onDraftRemove,
    onFetchMore,
    onNoteAdd,
    onNoteUpdateLoading,
    onNoteUpdate,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingAddressEdit,
    onShippingMethodEdit,
    onProfileView,
    onOrderLineShowMetadata,
    order,
    channelUsabilityData,
    users,
    usersLoading,
    errors,
    disabled,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();
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
      <TopNav
        href={backLinkUrl}
        title={
          <Box display="flex" alignItems="center" gap={3}>
            <span>{order?.number ? "#" + order?.number : undefined}</span>
            <div>
              {order && order.created ? (
                <Text size={3} fontWeight="regular">
                  <DateTime date={order.created} plain />
                </Text>
              ) : (
                <Skeleton style={{ width: "10em" }} />
              )}
            </div>
          </Box>
        }
      >
        <TopNav.Menu
          items={[
            {
              label: intl.formatMessage({
                id: "PAqicb",
                defaultMessage: "Cancel order",
                description: "button",
              }),
              onSelect: onDraftRemove,
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
          onOrderLineAdd={onOrderLineAdd}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onShippingMethodEdit={onShippingMethodEdit}
          onOrderLineShowMetadata={onOrderLineShowMetadata}
        />
        <OrderHistory
          history={order?.events}
          orderCurrency={order?.total?.gross.currency}
          onNoteAdd={onNoteAdd}
          onNoteUpdate={onNoteUpdate}
          onNoteUpdateLoading={onNoteUpdateLoading}
        />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <OrderChannelSectionCard channel={order?.channel} />
        <CardSpacer />
        <OrderCustomer
          canEditAddresses={!!order?.user}
          canEditCustomer={true}
          fetchUsers={fetchUsers}
          hasMore={hasMore}
          loading={usersLoading}
          errors={errors}
          order={order as OrderDetailsFragment}
          users={users}
          onBillingAddressEdit={onBillingAddressEdit}
          onCustomerEdit={onCustomerEdit}
          onFetchMore={onFetchMore}
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
