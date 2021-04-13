export function getProductDetails(productId, channelId) {
  const query = `fragment BasicProductFields on Product {
    id
    name
    attributes{
      attribute{
        id
        name
      }
    }
    category{
      id
      name
    }
    collections{
      id
      name
    }
    description
    seoTitle
    slug
    seoDescription
    rating
    metadata{
      key
      value
    }
    privateMetadata{
      key
      value
    }
    productType{
      id
      name
    }
  }
  
  fragment Price on TaxedMoney {
    gross {
      amount
      currency
    }
  }
  
  fragment ProductVariantFields on ProductVariant {
    id
    sku
    name
    pricing {
      price {
        ...Price
      }
    }
  }
  
  query ProductDetails{
    product(id: "${productId}", channel: "${channelId}") {
      ...BasicProductFields
      variants {
        ...ProductVariantFields
      }
      isAvailable
      isAvailableForPurchase
      availableForPurchase
    }
  }`;
  return cy.sendRequestWithQuery(query, "token");
}
