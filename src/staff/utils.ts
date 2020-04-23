import difference from "lodash-es/difference";

import { StaffMemberDetails_user } from "./types/StaffMemberDetails";
import { StaffDetailsFormData } from "./components/StaffDetailsPage";

/**
 * Return lists of groups which have to be added and removed from user.
 */
export const groupsDiff = (
  user: StaffMemberDetails_user,
  formData: StaffDetailsFormData
) => {
  const newGroups = formData.permissionGroups;
  const oldGroups = user.permissionGroups.map(u => u.id);

  return {
    addGroups: difference(newGroups, oldGroups),
    removeGroups: difference(oldGroups, newGroups)
  };
};
