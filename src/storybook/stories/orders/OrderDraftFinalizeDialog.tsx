import { storiesOf } from "@storybook/react";
import React from "react";

import OrderDraftFinalize, {
  OrderDraftFinalizeDialogProps,
  OrderDraftFinalizeWarning
} from "../../../orders/components/OrderDraftFinalizeDialog";
import Decorator from "../../Decorator";

const props: OrderDraftFinalizeDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  orderNumber: "5",
  warnings: []
};

storiesOf("Orders / OrderDraftFinalizeDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderDraftFinalize {...props} />)
  .add("with warnings", () => (
    <OrderDraftFinalize
      {...props}
      warnings={[
        OrderDraftFinalizeWarning.NO_SHIPPING_METHOD,
        OrderDraftFinalizeWarning.NO_SHIPPING,
        OrderDraftFinalizeWarning.NO_BILLING,
        OrderDraftFinalizeWarning.NO_USER
      ]}
    />
  ));
