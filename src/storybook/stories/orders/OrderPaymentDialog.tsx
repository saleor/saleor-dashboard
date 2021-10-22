import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderCaptureDialog, {
  OrderCaptureDialogProps
} from "../../../orders/components/OrderCaptureDialog";
import Decorator from "../../Decorator";

const props: OrderCaptureDialogProps = {
  confirmButtonState: "default",
  errors: [],
  initial: 0,
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true
};

storiesOf("Orders / OrderCaptureDialog", module)
  .addDecorator(Decorator)
  .add("capture payment", () => <OrderCaptureDialog {...props} />)
  .add("errors", () => (
    <OrderCaptureDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.CAPTURE_INACTIVE_PAYMENT,
          field: null,
          addressType: null
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.INVALID,
          field: "payment",
          addressType: null
        }
      ]}
    />
  ));
