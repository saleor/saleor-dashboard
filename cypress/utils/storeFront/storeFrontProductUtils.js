import ProductDetails from "../../apiRequests/storeFront/ProductDetails";
import Search from "../../apiRequests/storeFront/Search";

export const isProductVisible = (productId, channelSlug, name) => {
  const productDetails = new ProductDetails();
  return productDetails
    .getProductDetails(productId, channelSlug)
    .then(productDetailsResp => {
      const product = productDetailsResp.body.data.product;
      return product !== null && product.name === name;
    });
};

export const isProductAvailableForPurchase = (productId, channelSlug) => {
  const productDetails = new ProductDetails();
  return productDetails
    .getProductDetails(productId, channelSlug)
    .then(
      productDetailsResp =>
        productDetailsResp.body.data.product.isAvailableForPurchase
    );
};

export const isProductVisibleInSearchResult = (productName, channelSlug) => {
  const search = new Search();
  return search
    .searchInShop(productName, channelSlug)
    .then(
      resp =>
        resp.body.data.products.totalCount !== 0 &&
        resp.body.data.products.edges[0].node.name === productName
    );
};

export const getProductVariants = (productId, channelSlug) => {
  const productDetails = new ProductDetails();
  return productDetails
    .getProductDetails(productId, channelSlug)
    .then(resp => resp.body.data.product.variants);
};
