import { storiesOf } from "@storybook/react";
import React from "react";

import AssignMembersDialog, {
  AssignMembersDialogProps
} from "@saleor/permissionGroups/components/AssignMembersDialog";
import Decorator from "@saleor/storybook/Decorator";
import { users } from "../../fixtures";

const props: AssignMembersDialogProps = {
  confirmButtonState: "default",
  errors: [],
  loading: false,
  onClose: () => undefined,
  onFetch: () => undefined,
  onSubmit: () => undefined,
  open: true,
  staffMembers: users
};

storiesOf(
  "Views / Permission Groups / Permission Group User Assignment",
  module
)
  .addDecorator(Decorator)
  .add("loading", () => (
    <AssignMembersDialog
      {...props}
      confirmButtonState={"loading"}
      loading={true}
      staffMembers={[]}
    />
  ))
  .add("default", () => <AssignMembersDialog {...props} />);
