import { stringify } from "../.././formatData/formatJson";
import { getValueWithDefault, getVariantsListIds } from "./utils/Utils";

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
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productUpdate.product");
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
export function createProduct({
  attributeId,
  attributeValue,
  name,
  productTypeId,
  categoryId,
  collectionId,
  description
}) {
  const collection = getValueWithDefault(
    collectionId,
    `collections:["${collectionId}"]`
  );
  const category = getValueWithDefault(categoryId, `category:"${categoryId}"`);
  const descriptionLine = getValueWithDefault(
    description,
    `description:"{\\"blocks\\":[{\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"${description}\\"}}]}"`
  );
  const attributeValuesLine = getValueWithDefault(
    attributeValue,
    `values:["${attributeValue}"]`
  );
  const mutation = `mutation{
    productCreate(input:{
      attributes:[{
        id:"${attributeId}"
        ${attributeValuesLine}
      }]
      name:"${name}"
      slug:"${name}"
      seo:{title:"${name}" description:""}
      productType:"${productTypeId}"
      ${category}
      ${collection}
      ${descriptionLine}
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
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productCreate.product");
}

export function createVariant({
  productId,
  sku,
  warehouseId,
  quantityInWarehouse,
  channelId,
  attributeId,
  price = 1,
  costPrice = 1,
  trackInventory = true,
  weight = 1
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
      quantity:${quantityInWarehouse}
    }`
  );

  const mutation = `mutation{
    productVariantBulkCreate(product: "${productId}", variants: {
      attributes: [{
        id:"${attributeId}"
        values: ["value"]
      }]
      weight: ${weight}
      sku: "${sku}"
      ${channelListings}
      trackInventory:${trackInventory}
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
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productVariantBulkCreate.productVariants");
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

export function getVariants(variantsList) {
  const variantsIds = getVariantsListIds(variantsList);
  const query = `query{
    productVariants(first:100 ids:[${variantsIds}]){
      edges{
        node{
          stocks{
            warehouse{
              id
            }
            quantity
            quantityAllocated
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.productVariants");
}
