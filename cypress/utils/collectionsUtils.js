import Collections from "../apiRequests/frontShop/Collections";

class CollectionsUtils {
  collectionsRequest = new Collections();

  isCollectionVisible(collectionId, channelSlug) {
    return this.collectionsRequest
      .getCollection(collectionId, channelSlug)
      .then(resp => {
        const collection = resp.body[0].data.collection;
        return collection !== null && collection.id === collectionId;
      });
  }
  waitForCreateCollectionRequest() {
    return cy
      .wait(`@CreateCollection`)
      .its("response.body.data.collectionCreate.collection");
  }
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
