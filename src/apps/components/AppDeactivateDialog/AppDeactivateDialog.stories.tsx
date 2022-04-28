import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import AppDeactivateDialog, {
  AppDeactivateDialogProps
} from "./AppDeactivateDialog";

const props: AppDeactivateDialogProps = {
  confirmButtonState: "default",
  name: "App",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Apps / Deactivate app",
  decorators: [Decorator]
};

export const Default = () => <AppDeactivateDialog {...props} />;

Default.story = {
  name: "default"
};

export const UnnamedApp = () => <AppDeactivateDialog {...props} name={null} />;

UnnamedApp.story = {
  name: "unnamed app"
};
