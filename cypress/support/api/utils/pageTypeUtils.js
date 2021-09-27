import { deletePageType, getPageTypes } from "../requests/PageType";

export function deletePageTypesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deletePageType, getPageTypes, startsWith);
}
