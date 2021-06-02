import {
  deletePermissionGroup,
  getPermissionGroups
} from "../apiRequests/PermissionGroup";

export function deletePermissionGroupsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    deletePermissionGroup,
    getPermissionGroups,
    startsWith
  );
}
