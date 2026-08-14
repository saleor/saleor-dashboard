import { type StaffMemberDetailsFragment, type UserFragment } from "@dashboard/graphql";
import { filterHiddenPermissionGroups } from "@dashboard/permissionGroups/utils";
import difference from "lodash/difference";

import { type StaffDetailsFormData } from "./components/StaffDetailsPage/StaffDetailsPage";

/**
 * Return lists of groups which have to be added and removed from user.
 */
export const groupsDiff = (
  user: StaffMemberDetailsFragment | undefined,
  formData: StaffDetailsFormData,
) => {
  if (!user) {
    return {};
  }

  const newGroups = formData.permissionGroups.map(u => u.value);
  // Hidden groups are excluded from the form, so exclude them here as well
  // to avoid computing them as removed on save.
  const oldGroups = filterHiddenPermissionGroups(user.permissionGroups).map(u => u.id);

  return {
    addGroups: difference(newGroups, oldGroups),
    removeGroups: difference(oldGroups, newGroups),
  };
};

export const isMemberActive = (
  staffMember: Pick<StaffMemberDetailsFragment | UserFragment, "isActive"> | null | undefined,
): boolean => staffMember?.isActive === true;

export const getMemberPermissionGroups = (
  staffMember: StaffMemberDetailsFragment | UserFragment | null | undefined,
) => {
  if (staffMember && "permissionGroups" in staffMember) {
    return filterHiddenPermissionGroups(staffMember.permissionGroups);
  }

  return [];
};
