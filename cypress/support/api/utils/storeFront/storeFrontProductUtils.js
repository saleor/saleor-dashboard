import { getProductDetails } from "../../requests/storeFront/ProductDetails";

export const isProductVisible = (resp, name) => {
  const product = resp.body.data.product;
  return product !== null && product.name === name;
};

export const isProductAvailableForPurchase = resp => {
  const product = resp.body.data.product;
  return product.isAvailableForPurchase;
};

export const isProductVisibleInSearchResult = (resp, productName) => {
  const productsList = resp.body.data.products;
  return (
    productsList.totalCount !== 0 &&
    productsList.edges[0].node.name === productName
  );
};

export const getProductVariants = (productId, channelSlug) => {
  getProductDetails(productId, channelSlug).then(resp => {
    const variantsList = resp.body.data.product.variants;
    return variantsList.map(element => ({
      id: element.id,
      name: element.name,
      price: element.pricing.price.gross.amount,
    }));
  });
};

export const getProductPrice = (productId, channelSlug) => {
  getProductDetails(productId, channelSlug).then(
    resp => resp.body.data.product.variants[0].pricing.price.gross.amount,
  );
};
