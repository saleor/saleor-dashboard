import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import TokenDeleteDialog, { TokenDeleteDialogProps } from "./TokenDeleteDialog";

const props: TokenDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Slack",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Views / Apps / Custom app details / Token delete", module)
  .addDecorator(Decorator)
  .add("default", () => <TokenDeleteDialog {...props} />);
