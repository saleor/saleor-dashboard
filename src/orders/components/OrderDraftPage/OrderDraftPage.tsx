import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardMenu from "@dashboard/components/CardMenu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DateTime } from "@dashboard/components/Date";
import Savebar from "@dashboard/components/Savebar";
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
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
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
}

const OrderDraftPage: React.FC<OrderDraftPageProps> = props => {
  const {
    disabled,
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
    order,
    channelUsabilityData,
    users,
    usersLoading,
    errors,
  } = props;
  const navigate = useNavigator();

  const intl = useIntl();

  return (
    <DetailedContent>
      <TopNav
        href={orderDraftListUrl()}
        title={
          <Box display="flex" alignItems="center" gap={6}>
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
      <Content>
        <OrderDraftAlert order={order} channelUsabilityData={channelUsabilityData} />
        <OrderDraftDetails
          order={order}
          channelUsabilityData={channelUsabilityData}
          errors={errors}
          onOrderLineAdd={onOrderLineAdd}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onShippingMethodEdit={onShippingMethodEdit}
        />
        <OrderHistory
          history={order?.events}
          orderCurrency={order?.total?.gross.currency}
          onNoteAdd={onNoteAdd}
        />
      </Content>
      <RightSidebar>
        <OrderChannelSectionCard channel={order?.channel} />
        <CardSpacer />
        <OrderCustomer
          canEditAddresses={!!order?.user}
          canEditCustomer={true}
          fetchUsers={fetchUsers}
          hasMore={hasMore}
          loading={usersLoading}
          errors={errors}
          order={order}
          users={users}
          onBillingAddressEdit={onBillingAddressEdit}
          onCustomerEdit={onCustomerEdit}
          onFetchMore={onFetchMore}
          onProfileView={onProfileView}
          onShippingAddressEdit={onShippingAddressEdit}
        />
      </RightSidebar>
      <Savebar
        state={saveButtonBarState}
        disabled={disabled}
        onCancel={() => navigate(orderDraftListUrl())}
        onSubmit={onDraftFinalize}
        labels={{
          confirm: intl.formatMessage({
            id: "4Z14xW",
            defaultMessage: "Finalize",
            description: "button",
          }),
        }}
      />
    </DetailedContent>
  );
};
OrderDraftPage.displayName = "OrderDraftPage";
export default OrderDraftPage;
