import { getValueWithDefault } from "../utils/Utils";

export function getProductDetails(productId, channelSlug, auth = "token") {
  const privateMetadataLine = getValueWithDefault(
    auth === "auth",
    `privateMetadata{key value}`,
  );

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
    ${privateMetadataLine}
    productType{
      id
      name
      isDigital
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
    weight{
      unit
      value
    }
    pricing {
      price {
        ...Price
      }
    }
  }
  
  query ProductDetails{
    product(id: "${productId}", channel: "${channelSlug}") {
      ...BasicProductFields
      variants {
        ...ProductVariantFields
      }
      isAvailable
      isAvailableForPurchase
      availableForPurchase
    }
  }`;
  return cy.sendRequestWithQuery(query, auth);
}

export function getProductMetadata({
  productId,
  channelSlug,
  auth,
  withPrivateMetadata,
}) {
  const privateMetadata = getValueWithDefault(
    withPrivateMetadata,
    `privateMetadata{
    key
    value
  }`,
  );

  const query = `query{
    product(id:"${productId}" channel:"${channelSlug}"){
      metadata{
        key
        value
      }
      ${privateMetadata}
    }
  }`;
  return cy.sendRequestWithQuery(query, auth).its("body");
}
