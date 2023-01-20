import { Backlink } from "@dashboard/components/Backlink";
import CardMenu from "@dashboard/components/CardMenu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Container } from "@dashboard/components/Container";
import { DateTime } from "@dashboard/components/Date";
import Grid from "@dashboard/components/Grid";
import PageHeader from "@dashboard/components/PageHeader";
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
import { sectionNames } from "@dashboard/intl";
import OrderChannelSectionCard from "@dashboard/orders/components/OrderChannelSectionCard";
import { orderDraftListUrl } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import OrderCustomer, { CustomerEditData } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderDraftAlert from "./OrderDraftAlert";
import { usePageStyles } from "./styles";

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
  const classes = usePageStyles(props);
  const navigate = useNavigator();

  const intl = useIntl();

  return (
    <Container>
      <Backlink href={orderDraftListUrl()}>
        {intl.formatMessage(sectionNames.draftOrders)}
      </Backlink>
      <PageHeader
        className={classes.header}
        inline
        title={order?.number ? "#" + order?.number : undefined}
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
      </PageHeader>
      <div className={classes.date}>
        {order && order.created ? (
          <Typography variant="body2">
            <DateTime date={order.created} />
          </Typography>
        ) : (
          <Skeleton style={{ width: "10em" }} />
        )}
      </div>
      <Grid>
        <div>
          <OrderDraftAlert
            order={order}
            channelUsabilityData={channelUsabilityData}
          />
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
        </div>
        <div>
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
        </div>
      </Grid>
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
    </Container>
  );
};
OrderDraftPage.displayName = "OrderDraftPage";
export default OrderDraftPage;
