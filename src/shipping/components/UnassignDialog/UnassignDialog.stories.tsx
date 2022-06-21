import Decorator from "@saleor/storybook//Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import UnassignDialog, { UnassignDialogProps } from "./UnassignDialog";

const props: UnassignDialogProps = {
  closeModal: () => undefined,
  confirmButtonState: "default",
  idsLength: 2,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Shipping / UnassignDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <UnassignDialog {...props} />);
