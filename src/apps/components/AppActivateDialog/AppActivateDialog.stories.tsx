import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import AppActivateDialog, { AppActivateDialogProps } from "./AppActivateDialog";

const props: AppActivateDialogProps = {
  confirmButtonState: "default",
  name: "App",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Apps / Activate app",
  decorators: [Decorator]
};

export const Default = () => <AppActivateDialog {...props} />;

Default.story = {
  name: "default"
};

export const UnnamedApp = () => <AppActivateDialog {...props} name={null} />;

UnnamedApp.story = {
  name: "unnamed app"
};
