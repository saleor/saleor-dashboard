import Collections from "../../apiRequests/storeFront/Collections";

class CollectionsUtils {
  collectionsRequest = new Collections();

  isCollectionVisible(collectionId, channelSlug) {
    return this.collectionsRequest
      .getCollection(collectionId, channelSlug)
      .then(resp => {
        const collection = resp.body.data.collection;
        return collection !== null && collection.id === collectionId;
      });
  }
  isProductInCollectionVisible(collectionId, channelSlug, productId) {
    return this.collectionsRequest
      .getCollection(collectionId, channelSlug)
      .then(resp => {
        const product = resp.body.data.collection.products.edges[0].node;
        return product !== null && product.id === productId;
      });
  }
}
export default CollectionsUtils;
