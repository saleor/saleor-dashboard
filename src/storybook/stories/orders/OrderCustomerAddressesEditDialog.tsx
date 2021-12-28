import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderCustomerAddressesEditDialog, {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogProps
} from "../../../orders/components/OrderCustomerAddressesEditDialog";
import { countries, order as orderFixture } from "../../../orders/fixtures";

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

storiesOf("Orders / OrderCustomerAddressesEditDialog", module)
  .addDecorator(Decorator)
  .add("change customer (default)", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
    />
  ))
  .add("change shipping address", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      variant={AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS}
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
