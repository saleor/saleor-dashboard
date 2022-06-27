import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import MembersErrorDialog, {
  MembersErrorDialogProps,
} from "./MembersErrorDialog";

const props: MembersErrorDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf(
  "Views / Permission Groups / Permission Group Unassign Error Modal",
  module,
)
  .addDecorator(Decorator)
  .add("Unassign member", () => <MembersErrorDialog {...props} />);
