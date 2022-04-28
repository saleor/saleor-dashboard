import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import UnassignDialog, { UnassignDialogProps } from "./UnassignDialog";

const props: UnassignDialogProps = {
  closeModal: () => undefined,
  confirmButtonState: "default",
  idsLength: 2,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Shipping / UnassignDialog",
  decorators: [Decorator]
};

export const Default = () => <UnassignDialog {...props} />;

Default.story = {
  name: "default"
};
