import { OrderErrorCode } from "@saleor/graphql";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderPaymentDialog, {
  OrderPaymentDialogProps,
} from "../../../orders/components/OrderPaymentDialog";
import Decorator from "../../Decorator";

const props: OrderPaymentDialogProps = {
  confirmButtonState: "default",
  errors: [],
  initial: 0,
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true,
};

storiesOf("Orders / OrderPaymentDialog", module)
  .addDecorator(Decorator)
  .add("capture payment", () => <OrderPaymentDialog {...props} />)
  .add("errors", () => (
    <OrderPaymentDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.CAPTURE_INACTIVE_PAYMENT,
          field: null,
          addressType: null,
          message: "Capture inactive payment",
          orderLines: null,
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.INVALID,
          field: "payment",
          addressType: null,
          message: "Payment field invalid",
          orderLines: null,
        },
      ]}
    />
  ));
