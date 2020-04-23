import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import React from "react";

import { adminUserPermissions } from "@saleor/fixtures";
import OrderCustomer, {
  OrderCustomerProps
} from "../../../orders/components/OrderCustomer";
import { clients, order as orderFixture } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture("");

const props: Omit<OrderCustomerProps, "classes"> = {
  canEditAddresses: false,
  canEditCustomer: true,
  fetchUsers: () => undefined,
  onBillingAddressEdit: undefined,
  onCustomerEdit: undefined,
  onProfileView: () => undefined,
  onShippingAddressEdit: undefined,
  order,
  userPermissions: adminUserPermissions,
  users: clients
};

storiesOf("Orders / OrderCustomer", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderCustomer {...props} />)
  .add("loading", () => <OrderCustomer {...props} order={undefined} />)
  .add("with different addresses", () => (
    <OrderCustomer
      {...props}
      order={{
        ...order,
        shippingAddress: { ...order.shippingAddress, id: "a2" }
      }}
    />
  ))
  .add("editable", () => (
    <OrderCustomer {...props} canEditAddresses={true} canEditCustomer={true} />
  ))
  .add("no user permissions", () => (
    <OrderCustomer {...props} userPermissions={[]} />
  ));
