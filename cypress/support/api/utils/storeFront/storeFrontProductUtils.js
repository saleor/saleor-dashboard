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
      currency: element.pricing.price.gross.currency,
    }));
  });
};

export const getProductPrice = (productId, channelSlug) => {
  return getProductDetails(productId, channelSlug).then(
    resp => resp.body.data.product.variants[0].pricing.price.gross.amount,
  );
};

export const getProductPriceRetry = (
  productId,
  channelSlug,
  expectedPrice,
  i = 0,
) => {
  cy.log("main-scope");
  if (i > 3) {
    throw new Error(`This is not a correct price: ${expectedPrice}`);
  }
  return getProductPrice(productId, channelSlug).then(amount => {
    console.log(amount);

    if (amount !== expectedPrice) {
      console.log("price-scope2");
      cy.wait(3000);
      getProductPriceRetry(productId, channelSlug, expectedPrice, i + 1);
    } else {
      return amount;
    }
  });
};
