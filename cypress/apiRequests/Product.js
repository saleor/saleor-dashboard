import { stringify } from "../support/format/formatJson";
import { getValueWithDefault } from "./utils/Utils";

export function getFirstProducts(first, search) {
  const filter = search
    ? `, filter:{
      search:"${search}"
    }`
    : "";
  const query = `query{
    products(first:${first}${filter}){
      edges{
        node{
          id
          name
          variants{
            id
          }
        }
      }
    }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.products.edges);
}
export function updateProduct(productId, input) {
  const mutation = `mutation {
    productUpdate(id:"${productId}", input:${stringify(input)} ){
      productErrors{
        field
        message
      }
      product{
        id
      }
    }
  }
  `;
  return cy.sendRequestWithQuery(mutation);
}

export function updateChannelInProduct({
  productId,
  channelId,
  variantsIdsToAdd = "[]",
  variantsIdsToRemove = "[]",
  isPublished = true,
  isAvailableForPurchase = true,
  visibleInListings = true
}) {
  const mutation = `mutation{
    productChannelListingUpdate(id:"${productId}",
    input:{
      updateChannels:{ 
        channelId:"${channelId}"
        isPublished:${isPublished}
        isAvailableForPurchase:${isAvailableForPurchase}
        visibleInListings:${visibleInListings}
        addVariants:${variantsIdsToAdd}
        removeVariants:${variantsIdsToRemove}
      }
    }){
      product{
        id
        name
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function updateChannelPriceInVariant(variantId, channelId) {
  const mutation = `mutation{
    productVariantChannelListingUpdate(id: "${variantId}", input: {
      channelId: "${channelId}"
      price: 10
      costPrice: 10
    }){
      productChannelListingErrors{
        message
      }
    }
  } `;
  return cy.sendRequestWithQuery(mutation);
}
export function createProduct(attributeId, name, productType, category) {
  const mutation = `mutation{
    productCreate(input:{
      attributes:[{
        id:"${attributeId}"
      }]
      name:"${name}"
      productType:"${productType}"
      category:"${category}"
    }){
      product{
        id
        name
      }
      productErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createVariant({
  productId,
  sku,
  warehouseId,
  quantity,
  channelId,
  attributeId,
  price = 1,
  costPrice = 1
}) {
  const channelListings = getValueWithDefault(
    channelId,
    `channelListings:{
      channelId:"${channelId}"
      price:"${price}"
      costPrice:"${costPrice}"
    }`
  );

  const stocks = getValueWithDefault(
    warehouseId,
    `stocks:{
      warehouse:"${warehouseId}"
      quantity:${quantity}
    }`
  );

  const mutation = `mutation{
    productVariantBulkCreate(product: "${productId}", variants: {
      attributes: [{
        id:"${attributeId}"
        values: ["value"]
      }]
      sku: "${sku}"
      ${channelListings}
      ${stocks}
    }) {
      productVariants{
        id
        name
      }
      bulkProductErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createTypeProduct(
  name,
  attributeId,
  hasVariants = true,
  slug = name
) {
  const mutation = `mutation{
    productTypeCreate(input: {
      name: "${name}"
      slug: "${slug}"
      isShippingRequired: true
      productAttributes: "${attributeId}"
      variantAttributes: "${attributeId}"
      hasVariants: ${hasVariants}
    }){
      productErrors{
        field
        message
      }
      productType{
        id
      }
    }
  } `;
  return cy.sendRequestWithQuery(mutation);
}

export function deleteProduct(productId) {
  const mutation = `mutation{
    productDelete(id: "${productId}"){
      productErrors{
        field
        message
      }
    }
  } `;
  return cy.sendRequestWithQuery(mutation);
}

export function getProductTypes(first, search) {
  const query = `query{
    productTypes(first:${first}, filter:{
      search:"${search}"
    }){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.productTypes.edges);
}

export function deleteProductType(productTypeId) {
  const mutation = `mutation{
    productTypeDelete(id:"${productTypeId}"){
      productErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
