import { type StaffDetailsFormData } from "./StaffDetailsPage";

const permissionGroupIds = (groups: StaffDetailsFormData["permissionGroups"]): string[] =>
  [...groups.map(group => group.value)].sort();

const sameIds = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((id, index) => id === right[index]);

/** True when the staff details form matches the last-loaded staff member. */
export const isStaffDetailsFormPristine = (
  data: StaffDetailsFormData,
  initial: StaffDetailsFormData,
): boolean =>
  data.email === initial.email &&
  data.firstName === initial.firstName &&
  data.lastName === initial.lastName &&
  sameIds(permissionGroupIds(data.permissionGroups), permissionGroupIds(initial.permissionGroups));
