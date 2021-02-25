import ProductDetails from "../../apiRequests/storeFront/ProductDetails";
import Search from "../../apiRequests/storeFront/Search";

class StoreFrontProductUtils {
  productDetails = new ProductDetails();

  isProductVisible(productId, channelSlug, name) {
    return this.productDetails
      .getProductDetails(productId, channelSlug)
      .then(productDetailsResp => {
        const product = productDetailsResp.body.data.product;
        return product !== null && product.name === name;
      });
  }
  isProductAvailableForPurchase(productId, channelSlug) {
    return this.productDetails
      .getProductDetails(productId, channelSlug)
      .then(
        productDetailsResp =>
          productDetailsResp.body.data.product.isAvailableForPurchase
      );
  }
  isProductVisibleInSearchResult(productName, channelSlug) {
    const search = new Search();
    return search
      .searchInShop(productName, channelSlug)
      .then(
        resp =>
          resp.body.data.products.totalCount !== 0 &&
          resp.body.data.products.edges[0].node.name === productName
      );
  }
  getProductVariants(productId, channelSlug) {
    return this.productDetails
      .getProductDetails(productId, channelSlug)
      .then(resp => resp.body.data.product.variants);
  }
}
export default StoreFrontProductUtils;
