import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { countries, order as orderFixture } from "../../fixtures";
import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogProps
} from "./OrderCustomerAddressesEditDialog";

const order = orderFixture("");

const props: OrderCustomerAddressesEditDialogProps = {
  confirmButtonState: "default",
  loading: false,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  errors: undefined
};

storiesOf("Orders / OrderCustomerAddressesEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      countries={countries}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("no customer addresses", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      countries={countries}
      customerAddresses={[]}
    />
  ))
  .add("loading", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      loading={true}
      confirmButtonState="loading"
    />
  ));
