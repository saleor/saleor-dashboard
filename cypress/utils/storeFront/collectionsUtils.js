export const isCollectionVisible = (resp, collectionId) => {
  const collection = resp.body.data.collection;
  return collection !== null && collection.id === collectionId;
};

export const isProductInCollectionVisible = (resp, productId) => {
  const productsList = resp.body.data.collection.products;
  return (
    productsList.totalCount !== 0 && productsList.edges[0].node.id === productId
  );
};
