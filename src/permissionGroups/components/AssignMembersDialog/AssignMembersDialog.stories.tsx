import AssignMembersDialog, {
  AssignMembersDialogProps
} from "@saleor/permissionGroups/components/AssignMembersDialog";
import Decorator from "@saleor/storybook/Decorator";
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

export default {
  title: "Views / Permission Groups / Permission Group User Assignment",
  decorators: [Decorator]
};

export const SubmittingLoading = () => (
  <AssignMembersDialog
    {...props}
    confirmButtonState={"loading"}
    loading={false}
    disabled={true}
    staffMembers={[]}
  />
);

SubmittingLoading.story = {
  name: "submitting loading"
};

export const SearchLoading = () => (
  <AssignMembersDialog {...props} loading={true} staffMembers={[]} />
);

SearchLoading.story = {
  name: "search loading"
};

export const Default = () => <AssignMembersDialog {...props} />;

Default.story = {
  name: "default"
};
