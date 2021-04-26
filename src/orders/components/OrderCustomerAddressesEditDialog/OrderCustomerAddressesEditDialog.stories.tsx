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
      confirmButtonState="default"
      countries={countries}
      customerAddresses={[
        order.shippingAddress,
        { ...order.billingAddress, id: "asdfghjfuunie" }
      ]}
      errors={[]}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
    />
  ));
