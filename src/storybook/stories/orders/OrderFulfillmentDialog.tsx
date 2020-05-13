import placeholderImage from "@assets/images/placeholder60x60.png";
import { Omit } from "@material-ui/core";
import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderFulfillmentDialog, {
  OrderFulfillmentDialogProps
} from "../../../orders/components/OrderFulfillmentDialog";
import { order as orderFixture } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture(placeholderImage);

const props: Omit<OrderFulfillmentDialogProps, "classes"> = {
  confirmButtonState: "default",
  errors: [],
  lines: order.lines,
  onClose: undefined,
  onSubmit: undefined,
  open: true
};

storiesOf("Orders / OrderFulfillmentDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderFulfillmentDialog {...props} />)
  .add("errors", () => (
    <OrderFulfillmentDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.FULFILL_ORDER_LINE,
          field: null
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.INVALID,
          field: "trackingNumber"
        }
      ]}
    />
  ));
