import ProductDetails from "../../apiRequests/storeFront/ProductDetails";
import Search from "../../apiRequests/storeFront/Search";
import { isVisible } from "./utils";

const productDetails = new ProductDetails();
const search = new Search();

export const isProductVisible = (productId, channelSlug, name) =>
  isVisible({
    request: productDetails.getProductDetails(productId, channelSlug),
    respObjectKey: ["product"],
    responseValueKey: ["name"],
    value: name
  });

export const isProductAvailableForPurchase = (productId, channelSlug) =>
  isVisible({
    request: productDetails.getProductDetails(productId, channelSlug),
    respObjectKey: ["product"],
    responseValueKey: ["isAvailableForPurchase"]
  });
export const isProductVisibleInSearchResult = (productName, channelSlug) =>
  isVisible({
    request: search.searchInShop(productName, channelSlug),
    respObjectKey: ["products"],
    responseValueKey: ["edges", 0, "node", "name"],
    value: productName
  });

export const getProductVariants = (productId, channelSlug) =>
  productDetails.getProductDetails(productId, channelSlug).then(resp => {
    const variantsList = resp.body.data.product.variants;
    return variantsList.map(element => ({
      name: element.name,
      price: element.pricing.price.gross.amount
    }));
  });
