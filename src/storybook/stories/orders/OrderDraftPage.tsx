import placeholderImage from "@assets/images/placeholder60x60.png";
import { Omit } from "@material-ui/core";
import { adminUserPermissions, fetchMoreProps } from "@saleor/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Views / Orders / Order draft", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderDraftPage {...props} />)
  .add("loading", () => (
    <OrderDraftPage {...props} disabled={true} order={undefined} />
  ))
  .add("without lines", () => (
    <OrderDraftPage {...props} order={{ ...order, lines: [] }} />
  ))
  .add("no user permissions", () => (
    <OrderDraftPage {...props} userPermissions={[]} />
  ));
