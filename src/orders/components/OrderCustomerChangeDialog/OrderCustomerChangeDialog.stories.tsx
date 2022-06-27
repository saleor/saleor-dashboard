import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderCustomerChangeDialog, {
  OrderCustomerChangeDialogProps,
} from "./OrderCustomerChangeDialog";

const props: OrderCustomerChangeDialogProps = {
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Orders / OrderCustomerChangeDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderCustomerChangeDialog
      {...props}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
    />
  ));
