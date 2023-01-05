import { stringify } from "../.././formatData/formatJson";
import {
  getDataForDescriptionInVariables,
  getValueWithDefault,
  getVariantsListIds,
} from "./utils/Utils";

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
          thumbnail{
            url
          }
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
      errors{
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
  visibleInListings = true,
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
      errors{
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
  description,
  taxClassId,
}) {
  const collection = getValueWithDefault(
    collectionId,
    `collections:["${collectionId}"]`,
  );
  const category = getValueWithDefault(categoryId, `category:"${categoryId}"`);
  const descriptionData = getDataForDescriptionInVariables(description);
  const attributeValuesLine = getValueWithDefault(
    attributeValue,
    `values:["${attributeValue}"]`,
  );
  const attributes = getValueWithDefault(
    attributeId,
    `attributes:[{
      id:"${attributeId}"
      ${attributeValuesLine}
    }]`,
  );
  const selectedTaxClass = getValueWithDefault(
    taxClassId,
    `taxClass: "${taxClassId}"`,
    `taxClass: ""`,
  );
  const mutation = `mutation createProduct${descriptionData.mutationVariables}{
    productCreate(input:{
      ${attributes}
      name:"${name}"
      slug:"${name}"
      seo:{title:"${name}" description:""}
      productType:"${productTypeId}"
      ${category}
      ${collection}
      ${descriptionData.descriptionLine}
      ${selectedTaxClass}
    }){
      product{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation, "auth", descriptionData.variables, true)
    .its("body.data.productCreate.product");
}

export function createVariant({
  productId,
  sku,
  warehouseId,
  quantityInWarehouse = 1,
  channelId,
  attributeId,
  price = 1,
  costPrice = 1,
  trackInventory = true,
  weight = 1,
  attributeName = "value",
}) {
  const skuLines = getValueWithDefault(sku, `sku: "${sku}"`);

  const attributeLines = getValueWithDefault(
    attributeId,
    `attributes: [{
    id:"${attributeId}"
    values: ["${attributeName}"]
  }]`,
    "attributes:[]",
  );

  const channelListings = getValueWithDefault(
    channelId,
    `channelListings:{
      channelId:"${channelId}"
      price:"${price}"
      costPrice:"${costPrice}"
    }`,
  );

  const stocks = getValueWithDefault(
    warehouseId,
    `stocks:{
      warehouse:"${warehouseId}"
      quantity:${quantityInWarehouse}
    }`,
  );

  const mutation = `mutation{
    productVariantBulkCreate(product: "${productId}", variants: {
      ${attributeLines}
      weight: ${weight}
      ${skuLines}
      ${channelListings}
      trackInventory:${trackInventory}
      ${stocks}
    }) {
      productVariants{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productVariantBulkCreate.productVariants");
}

export function createVariantForSimpleProduct({
  productId,
  sku,
  warehouseId,
  quantityInWarehouse = 1,
  trackInventory = true,
  weight = 1,
  attributeId,
  attributeName = "value",
}) {
  const skuLines = getValueWithDefault(sku, `sku: "${sku}"`);

  const attributeLines = getValueWithDefault(
    attributeId,
    `attributes: [{
    id:"${attributeId}"
    values: ["${attributeName}"]
  }]`,
    "attributes:[]",
  );

  const stocks = getValueWithDefault(
    warehouseId,
    `stocks:{
      warehouse:"${warehouseId}"
      quantity:${quantityInWarehouse}
    }`,
  );
  const mutation = `mutation{
    productVariantCreate(input: {
      ${attributeLines}
      ${skuLines}
      trackInventory:${trackInventory}
      weight: ${weight}
      product: "${productId}"
      ${stocks}
    }) {
      productVariant{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productVariantCreate.productVariant");
}

export function deleteProduct(productId) {
  const mutation = `mutation{
    productDelete(id: "${productId}"){
      errors{
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

export function getVariant(id, channelSlug, auth = "auth") {
  const query = `query{
    productVariant(id:"${id}" channel:"${channelSlug}"){
      id
      name
      stocks{
        warehouse{
          id
        }
        quantityAllocated
      }
      sku
      attributes{
        attribute{
          inputType
        }
        values{
          name
        }
      }
      pricing{
        onSale
        discount{
          gross{
            amount
          }
        }
        price{
          gross{
            amount
          }
        }
        priceUndiscounted{
          gross{
            amount
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query, auth).its("body.data.productVariant");
}

export function updateVariantPrice({ variantId, channelId, price }) {
  const mutation = `mutation {
    productVariantChannelListingUpdate(id:"${variantId}", input:{
      channelId:"${channelId}"
      price:${price}
      costPrice:${price}
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productVariantChannelListingUpdate");
}

export function updateVariantWarehouse({ variantId, warehouseId, quantity }) {
  const quantityInWarehouse = getValueWithDefault(
    quantity,
    `quantity:${quantity}`,
    `quantity: 0`,
  );

  const mutation = `mutation{
    productVariantStocksCreate(variantId: "${variantId}", 
      stocks: 
      {
        ${quantityInWarehouse}
        warehouse: "${warehouseId}"
      }
      ){
      errors{
        field
        message
      }
    }
  }
  `;
  return cy.sendRequestWithQuery(mutation);
}
