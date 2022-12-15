import { StaffMemberDetailsFragment, UserFragment } from "@saleor/graphql";
import difference from "lodash/difference";

import { StaffDetailsFormData } from "./components/StaffDetailsPage";

/**
 * Return lists of groups which have to be added and removed from user.
 */
export const groupsDiff = (
  user: StaffMemberDetailsFragment,
  formData: StaffDetailsFormData,
) => {
  const newGroups = formData.permissionGroups;
  const oldGroups = user.permissionGroups.map(u => u.id);

  return {
    addGroups: difference(newGroups, oldGroups),
    removeGroups: difference(oldGroups, newGroups),
  };
};

export const isMemberActive = (
  staffMember: StaffMemberDetailsFragment | UserFragment,
) => {
  if (staffMember && "isActive" in staffMember) {
    return staffMember.isActive;
  }

  return false;
};

export const getMemberPermissionGroups = (
  staffMember: StaffMemberDetailsFragment | UserFragment,
) => {
  if (staffMember && "permissionGroups" in staffMember) {
    return staffMember.permissionGroups;
  }

  return [];
};
