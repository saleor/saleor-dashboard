export const isCollectionVisible = (collection, collectionId) =>
  collection !== null && collection.id === collectionId;

export const isProductInCollectionVisible = (collection, productId) => {
  const productsList = collection.products;
  return (
    productsList.totalCount !== 0 && productsList.edges[0].node.id === productId
  );
};
