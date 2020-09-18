import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderCancelDialog, {
  OrderCancelDialogProps
} from "../../../orders/components/OrderCancelDialog";
import Decorator from "../../Decorator";

const props: OrderCancelDialogProps = {
  confirmButtonState: "default",
  errors: [],
  number: "123",
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true
};

storiesOf("Orders / OrderCancelDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderCancelDialog
      confirmButtonState="default"
      errors={[]}
      open={true}
      number="123"
      onSubmit={undefined}
      onClose={undefined}
    />
  ))
  .add("errors", () => (
    <OrderCancelDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.CANNOT_CANCEL_ORDER,
          field: null
        }
      ]}
    />
  ));
