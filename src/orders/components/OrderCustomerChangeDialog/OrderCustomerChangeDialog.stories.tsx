import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import OrderCustomerChangeDialog, {
  OrderCustomerChangeDialogProps
} from "./OrderCustomerChangeDialog";

const props: OrderCustomerChangeDialogProps = {
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Orders / OrderCustomerChangeDialog",
  decorators: [Decorator]
};

export const Default = () => (
  <OrderCustomerChangeDialog
    {...props}
    onClose={() => undefined}
    onConfirm={() => undefined}
    open={true}
  />
);

Default.story = {
  name: "default"
};
