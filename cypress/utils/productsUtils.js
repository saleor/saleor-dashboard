import * as attributeRequest from "../apiRequests/Attribute";
import * as categoryRequest from "../apiRequests/Category";
import * as productRequest from "../apiRequests/Product";

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
  let product;
  let variants;
  return createProduct(attributeId, name, productTypeId, categoryId)
    .then(productResp => {
      product = productResp;
      productRequest.updateChannelInProduct({
        productId: product.id,
        channelId,
        isPublished,
        isAvailableForPurchase,
        visibleInListings
      });
    })
    .then(() => {
      createVariant({
        productId: product.id,
        sku: name,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price
      });
    })
    .then(variantsResp => {
      variants = variantsResp;
      return { product, variants };
    });
}

export function createTypeAttributeAndCategoryForProduct(
  name,
  attributeValues
) {
  let attribute;
  let productType;
  let category;
  return createAttribute(name, attributeValues)
    .then(attributeResp => {
      attribute = attributeResp;
      createTypeProduct(name, attributeResp.id);
    })
    .then(productTypeResp => {
      productType = productTypeResp;
      createCategory(name);
    })
    .then(categoryResp => {
      category = categoryResp;
      return { attribute, category, productType };
    });
}
export function createAttribute(name, attributeValues) {
  return attributeRequest
    .createAttribute(name, attributeValues)
    .its("body.data.attributeCreate.attribute");
}
export function createTypeProduct(name, attributeId) {
  return productRequest
    .createTypeProduct(name, attributeId)
    .its("body.data.productTypeCreate.productType");
}
export function createCategory(name) {
  return categoryRequest
    .createCategory(name)
    .its("body.data.categoryCreate.category");
}
export function createProduct(attributeId, name, productTypeId, categoryId) {
  return productRequest
    .createProduct(attributeId, name, productTypeId, categoryId)
    .its("body.data.productCreate.product");
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
    .its("body.data.productVariantBulkCreate.productVariants");
}

export function deleteProductsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    productRequest.deleteProductType,
    productRequest.getProductTypes,
    startsWith,
    "productType"
  );
  cy.deleteElementsStartsWith(
    attributeRequest.deleteAttribute,
    attributeRequest.getAttributes,
    startsWith,
    "attributes"
  );
  cy.deleteElementsStartsWith(
    categoryRequest.deleteCategory,
    categoryRequest.getCategories,
    startsWith,
    "categories"
  );
}
