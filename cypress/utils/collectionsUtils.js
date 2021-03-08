import Collections from "../apiRequests/Collections";

class CollectionsUtils {
  collectionsRequest = new Collections();

  deleteProperCollections(startsWith) {
    cy.deleteProperElements(
      this.collectionsRequest.deleteCollection,
      this.collectionsRequest.getCollections,
      startsWith,
      "collection"
    );
  }
}
export default CollectionsUtils;
