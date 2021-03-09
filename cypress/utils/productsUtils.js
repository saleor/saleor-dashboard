import * as attributeRequest from "../apiRequests/Attribute";
import * as categoryRequest from "../apiRequests/Category";
import * as productRequest from "../apiRequests/Product";

let product;
let variants;
let productType;
let attribute;
let category;

export function createProductInChannel({
  name,
  channelId,
  warehouseId = null,
  quantityInWarehouse = 10,
  productTypeId,
  attributeId,
  categoryId,
  price = 1,
  isPublished = true,
  isAvailableForPurchase = true,
  visibleInListings = true
}) {
  return createProduct(attributeId, name, productTypeId, categoryId)
    .then(() =>
      productRequest.updateChannelInProduct({
        productId: product.id,
        channelId,
        isPublished,
        isAvailableForPurchase,
        visibleInListings
      })
    )
    .then(() => {
      createVariant({
        productId: product.id,
        sku: name,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price
      });
    });
}

export function createTypeAttributeAndCategoryForProduct(
  name,
  attributeValues
) {
  return createAttribute(name, attributeValues)
    .then(() => createTypeProduct(name, attribute.id))
    .then(() => createCategory(name));
}
export function createAttribute(name, attributeValues) {
  return attributeRequest
    .createAttribute(name, attributeValues)
    .then(resp => (attribute = resp.body.data.attributeCreate.attribute));
}
export function createTypeProduct(name, attributeId) {
  return productRequest
    .createTypeProduct(name, attributeId)
    .then(resp => (productType = resp.body.data.productTypeCreate.productType));
}
export function createCategory(name) {
  return categoryRequest
    .createCategory(name)
    .then(resp => (category = resp.body.data.categoryCreate.category));
}
export function createProduct(attributeId, name, productTypeId, categoryId) {
  return productRequest
    .createProduct(attributeId, name, productTypeId, categoryId)
    .then(resp => (product = resp.body.data.productCreate.product));
}
export function createVariant({
  productId,
  sku,
  warehouseId,
  quantityInWarehouse,
  channelId,
  price
}) {
  return productRequest
    .createVariant({
      productId,
      sku,
      warehouseId,
      quantity: quantityInWarehouse,
      channelId,
      price
    })
    .then(
      resp =>
        (variants = resp.body.data.productVariantBulkCreate.productVariants)
    );
}
export function getCreatedProduct() {
  return product;
}
export function getCreatedVariants() {
  return variants;
}
export function getProductType() {
  return productType;
}
export function getAttribute() {
  return attribute;
}
export function getCategory() {
  return category;
}
export function deleteProperProducts(startsWith) {
  cy.deleteProperElements(
    productRequest.deleteProductType,
    productRequest.getProductTypes,
    startsWith,
    "productType"
  );
  cy.deleteProperElements(
    attributeRequest.deleteAttribute,
    attributeRequest.getAttributes,
    startsWith,
    "attributes"
  );
  cy.deleteProperElements(
    categoryRequest.deleteCategory,
    categoryRequest.getCategories,
    startsWith,
    "categories"
  );
}
