import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { countries, order as orderFixture } from "../../fixtures";
import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogProps
} from ".";
import { AddressEditDialogVariant } from "./types";

const order = orderFixture("");

const props: OrderCustomerAddressesEditDialogProps = {
  confirmButtonState: "default",
  variant: "CHANGE_SHIPPING_ADDRESS",
  loading: false,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  errors: undefined,
  countries
};

storiesOf("Orders / Changing address in order", module)
  .addDecorator(Decorator)
  .add("shipping address change", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("billing address change", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      variant="CHANGE_BILLING_ADDRESS"
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("no customer addresses", () => (
    <OrderCustomerAddressesEditDialog {...props} customerAddresses={[]} />
  ))
  .add("loading", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      loading={true}
      confirmButtonState="loading"
    />
  ));
