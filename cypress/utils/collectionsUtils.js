import { deleteCollection, getCollections } from "../apiRequests/Collections";

export function deleteCollectionsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteCollection, getCollections, startsWith);
}
