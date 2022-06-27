import UnassignMembersDialog, {
  UnassignMembersDialogProps,
} from "@saleor/permissionGroups/components/UnassignMembersDialog";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

const props: UnassignMembersDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  quantity: 3,
};

storiesOf(
  "Views / Permission Groups / Permission Group Unassign Member",
  module,
)
  .addDecorator(Decorator)
  .add("Unassign members", () => <UnassignMembersDialog {...props} />);
