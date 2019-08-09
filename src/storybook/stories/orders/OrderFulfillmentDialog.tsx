import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderFulfillmentDialog, {
  OrderFulfillmentDialogProps
} from "../../../orders/components/OrderFulfillmentDialog";
import { order as orderFixture } from "../../../orders/fixtures";
import Decorator from "../../Decorator";
import placeholderImage from "../@assets/images/placeholder60x60.png";

const order = orderFixture(placeholderImage);

const props: Omit<OrderFulfillmentDialogProps, "classes"> = {
  confirmButtonState: "default",
  lines: order.lines,
  onClose: undefined,
  onSubmit: undefined,
  open: true
};

storiesOf("Orders / OrderFulfillmentDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillmentDialog {...props} />);
