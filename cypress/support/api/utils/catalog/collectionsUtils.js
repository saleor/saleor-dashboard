import { deleteCollection, getCollections } from "../../requests/Collections";

export function deleteCollectionsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    deleteCollection,
    getCollections,
    startsWith,
    "slug"
  );
}
