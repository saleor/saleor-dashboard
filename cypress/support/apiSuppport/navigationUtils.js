import { deleteMenu, getMenus } from "../apiRequests/Menu";

export function deleteMenusStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteMenu, getMenus, startsWith);
}
