import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Views / Apps / Delete app", module)
  .addDecorator(Decorator)
  .add("default", () => <AppDeleteDialog {...props} />)
  .add("unnamed app", () => <AppDeleteDialog {...props} name={null} />);
