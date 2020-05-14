import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderPaymentVoidDialog, {
  OrderPaymentVoidDialogProps
} from "../../../orders/components/OrderPaymentVoidDialog";
import Decorator from "../../Decorator";

const props: OrderPaymentVoidDialogProps = {
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Orders / OrderPaymentVoidDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderPaymentVoidDialog {...props} />)
  .add("errors", () => (
    <OrderPaymentVoidDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.VOID_INACTIVE_PAYMENT,
          field: null
        }
      ]}
    />
  ));
