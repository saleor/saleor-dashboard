import placeholderImage from "@assets/images/placeholder60x60.png";
import { fetchMoreProps } from "@saleor/fixtures";
import { OrderErrorCode, OrderErrorFragment } from "@saleor/graphql";
import {
  channelUsabilityData,
  clients,
  draftOrder,
} from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { MockedUserProvider } from "@saleor/storybook/MockedUserProvider";
import { storiesOf } from "@storybook/react";
import React from "react";

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
  disabled: false,
  fetchUsers: () => undefined,
  onBillingAddressEdit: undefined,
  onCustomerEdit: () => undefined,
  onDraftFinalize: () => undefined,
  onDraftRemove: () => undefined,
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

storiesOf("Orders / Order draft", module)
  .addDecorator(Decorator)
  .addDecorator(DiscountsDecorator)
  .add("default", () => <OrderDraftPage {...props} />)
  .add("loading", () => (
    <OrderDraftPage
      {...props}
      disabled={true}
      order={undefined}
      channelUsabilityData={undefined}
    />
  ))
  .add("without lines", () => (
    <OrderDraftPage {...props} order={{ ...order, lines: [] }} />
  ))
  .add("no user permissions", () => (
    <OrderDraftPage {...props} customPermissions={[]} />
  ))
  .add("with errors", () => (
    <OrderDraftPage {...props} errors={finalizeErrors} />
  ));
