import { getUserName } from "@saleor/misc";

import { PermissionGroupDetails_permissionGroup_users } from "./types/PermissionGroupDetails";
import { MembersListUrlSortField } from "./urls";

export const sortMembers = (sort: string, asc: boolean) => (
  a: PermissionGroupDetails_permissionGroup_users,
  b: PermissionGroupDetails_permissionGroup_users
) => {
  let valueA;
  let valueB;
  switch (sort) {
    case MembersListUrlSortField.name:
      valueA = getUserName(a);
      valueB = getUserName(b);
      break;
    case MembersListUrlSortField.email:
      valueA = a.email;
      valueB = b.email;
      break;
  }

  return asc
    ? ("" + valueA).localeCompare(valueB)
    : ("" + valueA).localeCompare(valueB) * -1;
};
