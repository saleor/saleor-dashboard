import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderPaymentDialog, {
  OrderPaymentDialogProps
} from "../../../orders/components/OrderPaymentDialog";
import Decorator from "../../Decorator";

const props: OrderPaymentDialogProps = {
  confirmButtonState: "default",
  errors: [],
  initial: 0,
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true,
  variant: "capture"
};

storiesOf("Orders / OrderPaymentDialog", module)
  .addDecorator(Decorator)
  .add("capture payment", () => <OrderPaymentDialog {...props} />)
  .add("refund payment", () => (
    <OrderPaymentDialog {...props} variant="refund" />
  ))
  .add("errors", () => (
    <OrderPaymentDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.CANNOT_REFUND,
          field: null
        },
        {
          __typename: "OrderError",
          code: OrderErrorCode.INVALID,
          field: "payment"
        }
      ]}
      variant="refund"
    />
  ));
