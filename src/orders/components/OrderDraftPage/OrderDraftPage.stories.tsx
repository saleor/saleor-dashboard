// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder60x60.png";
import { fetchMoreProps } from "@dashboard/fixtures";
import { OrderErrorCode, OrderErrorFragment } from "@dashboard/graphql";
import {
  channelUsabilityData,
  clients,
  draftOrder,
} from "@dashboard/orders/fixtures";
import React from "react";

import { MockedUserProvider } from "../../../../.storybook/helpers";
import OrderDraftPageComponent, { OrderDraftPageProps } from "./OrderDraftPage";
import { getDiscountsProvidersWrapper } from "./storybook.utils";

const finalizeErrors: OrderErrorFragment[] = [
  {
    code: OrderErrorCode.BILLING_ADDRESS_NOT_SET,
    field: "order",
    addressType: null,
    message: "Can't finalize draft with no billing address.",
    orderLines: null,
    __typename: "OrderError",
  },
  {
    code: OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS,
    field: "order",
    addressType: null,
    message: "Can't finalize draft with no shipping address.",
    orderLines: null,
    __typename: "OrderError",
  },
  {
    code: OrderErrorCode.SHIPPING_METHOD_REQUIRED,
    field: "shipping",
    addressType: null,
    message: "Shipping method is required.",
    orderLines: null,
    __typename: "OrderError",
  },
];

const order = draftOrder(placeholderImage);

const props: Omit<OrderDraftPageProps, "classes"> = {
  ...fetchMoreProps,
  loading: false,
  disabled: false,
  fetchUsers: () => undefined,
  onBillingAddressEdit: undefined,
  onCustomerEdit: () => undefined,
  onDraftFinalize: () => undefined,
  onDraftRemove: () => undefined,
  onShowMetadata: () => undefined,
  onNoteAdd: undefined,
  onOrderLineAdd: () => undefined,
  onOrderLineChange: () => undefined,
  onOrderLineRemove: () => () => undefined,
  onProductClick: undefined,
  onProfileView: () => undefined,
  onShippingAddressEdit: undefined,
  onShippingMethodEdit: undefined,
  order,
  channelUsabilityData,
  saveButtonBarState: "default",
  errors: [],
  users: clients,
  usersLoading: false,
};

const DiscountsDecorator = getDiscountsProvidersWrapper(order);

const OrderDraftPage = props => {
  const customPermissions = props?.customPermissions;

  return (
    <MockedUserProvider customPermissions={customPermissions}>
      <OrderDraftPageComponent {...props} />
    </MockedUserProvider>
  );
};

export default {
  title: "Orders / Order draft",
  decorators: [DiscountsDecorator],
};

export const Default = () => <OrderDraftPage {...props} />;

export const Loading = () => (
  <OrderDraftPage
    {...props}
    disabled={true}
    order={undefined}
    channelUsabilityData={undefined}
  />
);

export const NoUserPermissions = () => (
  <OrderDraftPage {...props} customPermissions={[]} />
);

export const WithErrors = () => (
  <OrderDraftPage {...props} errors={finalizeErrors} />
);
