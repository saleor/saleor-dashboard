import Attribute from "../apiRequests/Attribute";
import Category from "../apiRequests/Category";
import Product from "../apiRequests/Product";

const productRequest = new Product();
const attributeRequest = new Attribute();
const categoryRequest = new Category();

// product;
// variants;
// productType;
// attribute;
// category;

export function createProductWithVariant(
  name,
  attributeId,
  productTypeId,
  categoryId
) {
  return this.createProduct(
    attributeId,
    name,
    productTypeId,
    categoryId
  ).then(() => this.createVariant(this.product.id, name, attributeId));
}

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
  return this.createProduct(attributeId, name, productTypeId, categoryId)
    .then(() =>
      this.productRequest.updateChannelInProduct({
        productId: this.product.id,
        channelId,
        isPublished,
        isAvailableForPurchase,
        visibleInListings
      })
    )
    .then(() => {
      this.createVariant({
        productId: this.product.id,
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
  return this.createAttribute(name, attributeValues)
    .then(() => this.createTypeProduct(name, this.attribute.id))
    .then(() => this.createCategory(name));
}
export function createAttribute(name, attributeValues) {
  return this.attributeRequest
    .createAttribute(name, attributeValues)
    .then(resp => (this.attribute = resp.body.data.attributeCreate.attribute));
}
export function createTypeProduct(name, attributeId) {
  return this.productRequest
    .createTypeProduct(name, attributeId)
    .then(
      resp => (this.productType = resp.body.data.productTypeCreate.productType)
    );
}
export function createCategory(name) {
  return this.categoryRequest
    .createCategory(name)
    .then(resp => (this.category = resp.body.data.categoryCreate.category));
}
export function createProduct(attributeId, name, productTypeId, categoryId) {
  return this.productRequest
    .createProduct(attributeId, name, productTypeId, categoryId)
    .then(resp => (this.product = resp.body.data.productCreate.product));
}
export function createVariant({
  productId,
  sku,
  warehouseId,
  quantityInWarehouse,
  channelId,
  price
}) {
  return this.productRequest
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
        (this.variants =
          resp.body.data.productVariantBulkCreate.productVariants)
    );
}
export function getCreatedProduct() {
  return this.product;
}
export function getCreatedVariants() {
  return this.variants;
}
export function getProductType() {
  return this.productType;
}
export function getAttribute() {
  return this.attribute;
}
export function getCategory() {
  return this.category;
}
export function deleteProperProducts(startsWith) {
  const product = new Product();
  const attribute = new Attribute();
  const category = new Category();
  cy.deleteProperElements(
    product.deleteProductType,
    product.getProductTypes,
    startsWith,
    "productType"
  );
  cy.deleteProperElements(
    attribute.deleteAttribute,
    attribute.getAttributes,
    startsWith,
    "attributes"
  );
  cy.deleteProperElements(
    category.deleteCategory,
    category.getCategories,
    startsWith,
    "categories"
  );
}
