import ProductDetails from "../../apiRequests/frontShop/ProductDetails";
import Search from "../../apiRequests/frontShop/Search";

class FrontShopProductUtils {
  isProductVisible(productId, channelSlug, name) {
    const productDetails = new ProductDetails();
    return productDetails
      .getProductDetails(productId, channelSlug)
      .then(productDetailsResp =>
        productDetails.isProductExist(productDetailsResp, name)
      );
  }
  isProductAvailableForPurchase(productId, channelSlug) {
    const productDetails = new ProductDetails();
    return productDetails
      .getProductDetails(productId, channelSlug)
      .then(productDetailsResp =>
        productDetails.isAvailableForPurchaseFromResp(productDetailsResp)
      );
  }
  isProductVisibleInSearchResult(productName, channelSlug) {
    const search = new Search();
    return search
      .searchInShop(productName, channelSlug)
      .then(resp => search.isProductExist(resp, productName));
  }
}
export default FrontShopProductUtils;
