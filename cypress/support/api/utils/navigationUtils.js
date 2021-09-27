import { deleteMenu, getMenus } from "../requests/Menu";

export function deleteMenusStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteMenu, getMenus, startsWith);
}
