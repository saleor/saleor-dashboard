import UnassignMembersDialog, {
  UnassignMembersDialogProps
} from "@saleor/permissionGroups/components/UnassignMembersDialog";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

const props: UnassignMembersDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  quantity: 3
};

export default {
  title: "Views / Permission Groups / Permission Group Unassign Member",
  decorators: [Decorator]
};

export const UnassignMembers = () => <UnassignMembersDialog {...props} />;

UnassignMembers.story = {
  name: "Unassign members"
};
