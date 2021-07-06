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
  const descriptionLine = getValueWithDefault(
    description,
    `description:"{\\"blocks\\":[{\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"${description}\\"}}]}"`
  );
  const categoryLine = getValueWithDefault(
    categoryId,
    `category:"${categoryId}"`
  );

  const mutation = `mutation{
    productCreate(input:{
      attributes:[{
        id:"${attributeId}"
      }]
      name:"${name}"
      slug:"${name}"
      seo:{title:"${name}" description:""}
      productType:"${productTypeId}"
      ${categoryLine}
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
  trackInventory = true
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
