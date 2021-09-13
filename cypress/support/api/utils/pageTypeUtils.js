import { deletePageType, getPageTypes } from "../requests/PageTypes";

export function deletePageTypesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deletePageType, getPageTypes, startsWith);
}
