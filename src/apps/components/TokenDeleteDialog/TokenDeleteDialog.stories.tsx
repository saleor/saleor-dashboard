import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import TokenDeleteDialog, { TokenDeleteDialogProps } from "./TokenDeleteDialog";

const props: TokenDeleteDialogProps = {
  confirmButtonState: "default",
  name: "Slack",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Apps / Custom app details / Token delete",
  decorators: [Decorator]
};

export const Default = () => <TokenDeleteDialog {...props} />;

Default.story = {
  name: "default"
};
