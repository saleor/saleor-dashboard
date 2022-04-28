import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import AppInProgressDeleteDialog, {
  AppInProgressDeleteDialogProps
} from "./AppInProgressDeleteDialog";

const props: AppInProgressDeleteDialogProps = {
  confirmButtonState: "default",
  name: "App",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Apps / Delete app failed installation",
  decorators: [Decorator]
};

export const Default = () => <AppInProgressDeleteDialog {...props} />;

Default.story = {
  name: "default"
};

export const UnnamedApp = () => (
  <AppInProgressDeleteDialog {...props} name={null} />
);

UnnamedApp.story = {
  name: "unnamed app"
};
