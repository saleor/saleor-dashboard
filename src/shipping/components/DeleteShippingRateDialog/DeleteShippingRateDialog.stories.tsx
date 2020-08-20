import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import DeleteShippingRateDialog, {
  DeleteShippingRateDialogProps
} from "./DeleteShippingRateDialog";

const props: DeleteShippingRateDialogProps = {
  confirmButtonState: "default",
  handleConfirm: () => undefined,
  name: "Shipping",
  onClose: () => undefined,
  open: true
};

storiesOf("Shipping / DeleteShippingRateDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <DeleteShippingRateDialog {...props} />)
  .add("loading", () => (
    <DeleteShippingRateDialog {...props} confirmButtonState="loading" />
  ));
