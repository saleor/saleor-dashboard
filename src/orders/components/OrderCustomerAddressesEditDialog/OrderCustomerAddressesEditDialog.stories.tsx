import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { countries, order as orderFixture } from "../../fixtures";
import OrderCustomerAddressesEditDialog, {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogProps
} from ".";

const order = orderFixture("");

const props: OrderCustomerAddressesEditDialogProps = {
  confirmButtonState: "default",
  variant: AddressEditDialogVariant.CHANGE_CUSTOMER,
  loading: false,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  errors: undefined,
  countries
};

storiesOf("Orders / Changing address in order", module)
  .addDecorator(Decorator)
  .add("Address change when customer is changed", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("Shipping address change", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      variant={AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("Shipping address change", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      variant={AddressEditDialogVariant.CHANGE_BILLING_ADDRESS}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("No customer addresses", () => (
    <OrderCustomerAddressesEditDialog {...props} customerAddresses={[]} />
  ))
  .add("Loading", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      loading={true}
      confirmButtonState="loading"
    />
  ));
