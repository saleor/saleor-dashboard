import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import MembersErrorDialog, {
  MembersErrorDialogProps
} from "./MembersErrorDialog";

const props: MembersErrorDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

export default {
  title: "Views / Permission Groups / Permission Group Unassign Error Modal",
  decorators: [Decorator]
};

export const UnassignMember = () => <MembersErrorDialog {...props} />;

UnassignMember.story = {
  name: "Unassign member"
};
