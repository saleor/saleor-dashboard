import AssignMembersDialog, {
  AssignMembersDialogProps
} from "@saleor/permissionGroups/components/AssignMembersDialog";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { users } from "../../fixtures";

const props: AssignMembersDialogProps = {
  confirmButtonState: "default",
  disabled: false,
  hasMore: true,
  initialSearch: "",
  loading: false,
  onClose: () => undefined,
  onFetchMore: () => undefined,
  onSearchChange: () => undefined,
  onSubmit: () => undefined,
  open: true,
  staffMembers: users
};

storiesOf(
  "Views / Permission Groups / Permission Group User Assignment",
  module
)
  .addDecorator(Decorator)
  .add("submitting loading", () => (
    <AssignMembersDialog
      {...props}
      confirmButtonState={"loading"}
      loading={false}
      disabled={true}
      staffMembers={[]}
    />
  ))
  .add("search loading", () => (
    <AssignMembersDialog {...props} loading={true} staffMembers={[]} />
  ))
  .add("default", () => <AssignMembersDialog {...props} />);
