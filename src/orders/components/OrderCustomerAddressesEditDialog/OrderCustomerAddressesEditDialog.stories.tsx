import { transformAddressToForm } from "@saleor/misc";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { countries, order as orderFixture } from "../../fixtures";
import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogData,
  OrderCustomerAddressesEditDialogProps
} from "./OrderCustomerAddressesEditDialog";

const order = orderFixture("");

const data: OrderCustomerAddressesEditDialogData = {
  shippingAddress: transformAddressToForm(order.shippingAddress),
  billingAddress: transformAddressToForm(order.billingAddress),
  userAddresses: [order.shippingAddress, order.billingAddress]
};

const props: OrderCustomerAddressesEditDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  data,
  errors: undefined
};

storiesOf("Orders / OrderCustomerAddressesEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderCustomerAddressesEditDialog
      {...props}
      confirmButtonState="default"
      data={data}
      countries={countries}
      errors={[]}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
    />
  ));
