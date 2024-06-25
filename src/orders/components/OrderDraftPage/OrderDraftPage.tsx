// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardMenu from "@dashboard/components/CardMenu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DateTime } from "@dashboard/components/Date";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
  SearchCustomersQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import OrderChannelSectionCard from "@dashboard/orders/components/OrderChannelSectionCard";
import { orderDraftListUrl } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Typography } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import OrderCustomer, { CustomerEditData } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderDraftAlert from "./OrderDraftAlert";

export interface OrderDraftPageProps extends FetchMoreProps {
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
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  onProductClick: (id: string) => void;
  onShippingAddressEdit: () => void;
  onShippingMethodEdit: () => void;
  onProfileView: () => void;
  onShowMetadata: (id: string) => void;
}

const OrderDraftPage: React.FC<OrderDraftPageProps> = props => {
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
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingAddressEdit,
    onShippingMethodEdit,
    onProfileView,
    onShowMetadata,
    order,
    channelUsabilityData,
    users,
    usersLoading,
    errors,
  } = props;
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <DetailPageLayout>
      <TopNav
        href={orderDraftListUrl()}
        title={
          <Box display="flex" alignItems="center" gap={3}>
            <span>{order?.number ? "#" + order?.number : undefined}</span>
            <div>
              {order && order.created ? (
                <Typography variant="body2">
                  <DateTime date={order.created} plain />
                </Typography>
              ) : (
                <Skeleton style={{ width: "10em" }} />
              )}
            </div>
          </Box>
        }
      >
        <CardMenu
          menuItems={[
            {
              label: intl.formatMessage({
                id: "PAqicb",
                defaultMessage: "Cancel order",
                description: "button",
              }),
              onSelect: onDraftRemove,
            },
          ]}
        />
      </TopNav>
      <DetailPageLayout.Content>
        <OrderDraftAlert
          order={order as OrderDetailsFragment}
          channelUsabilityData={channelUsabilityData}
        />
        <OrderDraftDetails
          order={order as OrderDetailsFragment}
          channelUsabilityData={channelUsabilityData}
          errors={errors}
          loading={loading}
          onOrderLineAdd={onOrderLineAdd}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onShippingMethodEdit={onShippingMethodEdit}
          onShowMetadata={onShowMetadata}
        />
        <OrderHistory
          history={order?.events}
          orderCurrency={order?.total?.gross.currency}
          onNoteAdd={onNoteAdd}
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
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={() => navigate(orderDraftListUrl())} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={onDraftFinalize}
          disabled={loading}
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
