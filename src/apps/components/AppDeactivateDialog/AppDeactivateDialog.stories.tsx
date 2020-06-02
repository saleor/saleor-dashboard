import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Views / Apps / Deactivate app", module)
  .addDecorator(Decorator)
  .add("default", () => <AppDeactivateDialog {...props} />)
  .add("unnamed app", () => <AppDeactivateDialog {...props} name={null} />);
