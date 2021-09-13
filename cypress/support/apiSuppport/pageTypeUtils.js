import { deletePageType, getPageTypes } from "../apiRequests/PageTypes";

export function deletePageTypesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deletePageType, getPageTypes, startsWith);
}
