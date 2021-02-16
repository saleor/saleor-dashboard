import placeholderImage from "@assets/images/placeholder60x60.png";
import { Omit } from "@material-ui/core";
import { adminUserPermissions, fetchMoreProps } from "@saleor/fixtures";
import { OrderDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { storiesOf } from "@storybook/react";
import React from "react";
import { ApolloProvider } from "react-apollo";

import OrderDraftPage, {
  OrderDraftPageProps
} from "../../../orders/components/OrderDraftPage";
import { clients, countries, draftOrder } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const order = draftOrder(placeholderImage);

const props: Omit<OrderDraftPageProps, "classes"> = {
  ...fetchMoreProps,
  countries,
  disabled: false,
  fetchUsers: () => undefined,
  onBack: () => undefined,
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
  saveButtonBarState: "default",
  userPermissions: adminUserPermissions,
  users: clients,
  usersLoading: false
};

const DiscountWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <OrderDiscountProvider order={order}>
    <OrderLineDiscountProvider order={order}>
      {children}
    </OrderLineDiscountProvider>
  </OrderDiscountProvider>
);

storiesOf("Views / Orders / Order draft", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <DiscountWrapper>
      <OrderDraftPage {...props} />
    </DiscountWrapper>
  ))
  .add("loading", () => (
    <DiscountWrapper>
      <OrderDraftPage {...props} disabled={true} order={undefined} />
    </DiscountWrapper>
  ))
  .add("without lines", () => (
    <DiscountWrapper>
      <OrderDraftPage {...props} order={{ ...order, lines: [] }} />
    </DiscountWrapper>
  ))
  .add("no user permissions", () => (
    <DiscountWrapper>
      <OrderDraftPage {...props} userPermissions={[]} />
    </DiscountWrapper>
  ));
