import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { countries, order as orderFixture } from "../../fixtures";
import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogProps
} from ".";
import { AddressEditDialogVariant } from "./types";

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

export default {
  title: "Orders / Changing address in order",
  decorators: [Decorator]
};

export const AddressChangeWhenCustomerIsChanged = () => (
  <OrderCustomerAddressesEditDialog
    {...props}
    customerAddresses={[
      order.shippingAddress,
      { ...order.billingAddress, id: "asdfghjfuunie" }
    ]}
  />
);

AddressChangeWhenCustomerIsChanged.story = {
  name: "address change when customer is changed"
};

export const ShippingAddressChange = () => (
  <OrderCustomerAddressesEditDialog
    {...props}
    variant={AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS}
    customerAddresses={[
      order.shippingAddress,
      { ...order.billingAddress, id: "asdfghjfuunie" }
    ]}
  />
);

ShippingAddressChange.story = {
  name: "shipping address change"
};

export const BillingAddressChange = () => (
  <OrderCustomerAddressesEditDialog
    {...props}
    variant={AddressEditDialogVariant.CHANGE_BILLING_ADDRESS}
    customerAddresses={[
      order.shippingAddress,
      { ...order.billingAddress, id: "asdfghjfuunie" }
    ]}
  />
);

BillingAddressChange.story = {
  name: "billing address change"
};

export const NoCustomerAddresses = () => (
  <OrderCustomerAddressesEditDialog {...props} customerAddresses={[]} />
);

NoCustomerAddresses.story = {
  name: "no customer addresses"
};

export const Loading = () => (
  <OrderCustomerAddressesEditDialog
    {...props}
    loading={true}
    confirmButtonState="loading"
  />
);

Loading.story = {
  name: "loading"
};
