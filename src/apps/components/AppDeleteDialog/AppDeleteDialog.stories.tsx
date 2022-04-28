import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import AppDeleteDialog, { AppDeleteDialogProps } from "./AppDeleteDialog";

const props: AppDeleteDialogProps = {
  confirmButtonState: "default",
  name: "App",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  type: "EXTERNAL"
};

export default {
  title: "Views / Apps / Delete app",
  decorators: [Decorator]
};

export const Default = () => <AppDeleteDialog {...props} />;

Default.story = {
  name: "default"
};

export const UnnamedApp = () => <AppDeleteDialog {...props} name={null} />;

UnnamedApp.story = {
  name: "unnamed app"
};
