import Collections from "../apiRequests/frontShop/Collections";

class CollectionsUtils {
  collectionsRequest = new Collections();
  isCollectionVisible(collectionId, channelSlug) {
    return this.collectionsRequest
      .getCollection(collectionId, channelSlug)
      .then(resp => {
        const collection = resp.body[0].data.collection;
        return collection && collection.id === collectionId;
      });
  }
  getCreatedCollection() {
    return cy
      .wait(`@CreateCollection`)
      .its("response.body.data.collectionCreate.collection");
  }
}
export default CollectionsUtils;
