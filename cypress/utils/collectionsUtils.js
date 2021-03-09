import { deleteCollection, getCollections } from "../apiRequests/Collections";

export function deleteProperCollections(startsWith) {
  cy.deleteProperElements(
    deleteCollection,
    getCollections,
    startsWith,
    "collection"
  );
}
