import { StaffMemberFragment } from "@saleor/graphql";
import { getUserName } from "@saleor/misc";

import { MembersListUrlSortField } from "./urls";

export const sortMembers = (sort: string, asc: boolean) => (
  a: StaffMemberFragment,
  b: StaffMemberFragment,
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
