class ProductDetails {
  getProductDetails(productId, channelId) {
    const query = `fragment BasicProductFields on Product {
      id
      name
    }
    query ProductDetails{
      product(id: "${productId}", channel: "${channelId}") {
        ...BasicProductFields
        isAvailable
        isAvailableForPurchase
        availableForPurchase
      }
    }`;
    return cy.sendRequestWithQuery(query, "token");
  }
}
export default ProductDetails;
