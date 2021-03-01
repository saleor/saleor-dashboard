import Collections from "../../apiRequests/storeFront/Collections";

export const isCollectionVisible = (collectionId, channelSlug) => {
  const collectionsRequest = new Collections();
  return collectionsRequest
    .getCollection(collectionId, channelSlug)
    .then(resp => {
      const collection = resp.body.data.collection;
      return collection !== null && collection.id === collectionId;
    });
};
export const isProductInCollectionVisible = (
  collectionId,
  channelSlug,
  productId
) => {
  const collectionsRequest = new Collections();
  return collectionsRequest
    .getCollection(collectionId, channelSlug)
    .then(resp => {
      const product = resp.body.data.collection.products.edges[0].node;
      return product !== null && product.id === productId;
    });
};
