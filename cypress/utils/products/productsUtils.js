import * as attributeRequest from "../../apiRequests/Attribute";
import * as categoryRequest from "../../apiRequests/Category";
import * as productRequest from "../../apiRequests/Product";
import {
  createTypeProduct,
  deleteProductType,
  getProductTypes
} from "../../apiRequests/productType";

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
  visibleInListings = true,
  collectionId = null,
  description = null,
  trackInventory = true
}) {
  let product;
  let variantsList;
  return productRequest
    .createProduct({
      attributeId,
      name,
      productTypeId,
      categoryId,
      collectionId,
      description
    })
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
      productRequest.createVariant({
        productId: product.id,
        sku: name,
        attributeId,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price,
        trackInventory
      });
    })
    .then(variantsResp => {
      variantsList = variantsResp;
      return { product, variantsList };
    });
}

export function createTypeAttributeAndCategoryForProduct(
  name,
  attributeValues
) {
  let attribute;
  let productType;
  let category;
  return attributeRequest
    .createAttribute(name, attributeValues)
    .then(attributeResp => {
      attribute = attributeResp;
      createTypeProduct({ name, attributeId: attributeResp.id });
    })
    .then(productTypeResp => {
      productType = productTypeResp;
      categoryRequest.createCategory(name);
    })
    .then(categoryResp => {
      category = categoryResp;
      return { attribute, category, productType };
    });
}
export function deleteProductsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteProductType, getProductTypes, startsWith);
  cy.deleteElementsStartsWith(
    attributeRequest.deleteAttribute,
    attributeRequest.getAttributes,
    startsWith
  );
  cy.deleteElementsStartsWith(
    categoryRequest.deleteCategory,
    categoryRequest.getCategories,
    startsWith
  );
}
