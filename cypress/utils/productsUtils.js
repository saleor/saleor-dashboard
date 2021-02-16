import Attribute from "../apiRequests/Attribute";
import Category from "../apiRequests/Category";
import Product from "../apiRequests/Product";
import Promises from "../support/promises/promises.js";

class ProductsUtils {
  promises = new Promises();
  productRequest = new Product();
  attributeRequest = new Attribute();
  categoryRequest = new Category();

  product;
  variants;
  productType;
  attribute;
  category;

  async createProductInChannel(
    name,
    channelId,
    warehouseId,
    quantityInWarehouse,
    productTypeId,
    attributeId,
    categoryId,
    price
  ) {
    await this.createProduct(attributeId, name, productTypeId, categoryId);
    this.updateChannelInProduct(this.product.id, channelId);
    await this.createVariant(
      this.product.id,
      name,
      warehouseId,
      quantityInWarehouse,
      channelId,
      price
    );
  }

  async createTypeAttributeAndCategoryForProduct(name) {
    await this.createAttribute(name);
    await this.createTypeProduct(name, this.attribute.id);
    await this.createCategory(name);
  }
  async createAttribute(name) {
    const respProm = await this.promises.createPromise(
      this.attributeRequest.createAttribute(name)
    );
    this.attribute = respProm.attributeCreate.attribute;
  }
  async createTypeProduct(name, attributeId) {
    const respProm = await this.promises.createPromise(
      this.productRequest.createTypeProduct(name, attributeId)
    );
    this.productType = respProm.productTypeCreate.productType;
  }
  async createCategory(name) {
    const respProm = await this.promises.createPromise(
      this.categoryRequest.createCategory(name)
    );
    this.category = respProm.categoryCreate.category;
  }
  async createProduct(attributeId, name, productTypeId, categoryId) {
    const respProm = await this.promises.createPromise(
      this.productRequest.createProduct(
        attributeId,
        name,
        productTypeId,
        categoryId
      )
    );
    this.product = respProm.productCreate.product;
  }
  async updateChannelInProduct(productId, channelId) {
    await this.promises.createPromise(
      this.productRequest.updateChannelInProduct(productId, channelId)
    );
  }
  async createVariant(
    productId,
    name,
    warehouseId,
    quantityInWarehouse,
    channelId,
    price
  ) {
    const respProm = await this.promises.createPromise(
      this.productRequest.createVariant(
        productId,
        name,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price
      )
    );
    this.variants = respProm.productVariantBulkCreate.productVariants;
  }

  getCreatedVariants() {
    return this.variants;
  }
  getProductType() {
    return this.productType;
  }
  getAttribute() {
    return this.attribute;
  }
  getCategory() {
    return this.category;
  }
  deleteProperProducts(startsWith) {
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
}
export default ProductsUtils;
