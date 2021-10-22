import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderVoidDialog, {
  OrderVoidDialogProps
} from "../../../orders/components/OrderVoidDialog";
import Decorator from "../../Decorator";

const props: OrderVoidDialogProps = {
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Orders / OrderVoidDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderVoidDialog {...props} />)
  .add("errors", () => (
    <OrderVoidDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.VOID_INACTIVE_PAYMENT,
          field: null,
          addressType: null
        }
      ]}
    />
  ));
