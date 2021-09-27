import {
  deletePermissionGroup,
  getPermissionGroups
} from "../requests/PermissionGroup";

export function deletePermissionGroupsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    deletePermissionGroup,
    getPermissionGroups,
    startsWith
  );
}
