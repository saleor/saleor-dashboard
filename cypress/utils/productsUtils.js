import Attribute from "../apiRequests/Attribute";
import Category from "../apiRequests/Category";
import Product from "../apiRequests/Product";

class ProductsUtils {
  createdVariantId;
  productTypeId;
  attributeId;
  categoryId;

  updateChannelInProduct(productsList, channelId) {
    const product = new Product();
    productsList.forEach(productElement => {
      product.updateChannelInProduct(productElement.node.id, channelId);
      const variants = productElement.node.variants;
      variants.forEach(variant => {
        product.updateChannelPriceInVariant(variant.id, channelId);
      });
    });
  }
  createProductInChannel(
    name,
    channelId,
    warehouseId,
    quantityInWarehouse,
    productTypeId,
    attributeId,
    categoryId,
    price
  ) {
    const product = new Product();
    return product
      .createProduct(attributeId, name, productTypeId, categoryId)
      .then(createProductResp => {
        const productId = createProductResp.body.data.productCreate.product.id;
        return product.updateChannelInProduct(productId, channelId).then(() =>
          product
            .createVariant(
              productId,
              name,
              warehouseId,
              quantityInWarehouse,
              channelId,
              price
            )
            .then(createVariantResp => {
              this.createdVariantId =
                createVariantResp.body.data.productVariantBulkCreate.productVariants;
            })
        );
      });
  }

  createTypeAttributeAndCategoryForProduct(name) {
    const attribute = new Attribute();
    const category = new Category();
    const product = new Product();
    return attribute.createAttribute(name).then(createAttributeResp => {
      this.attributeId =
        createAttributeResp.body.data.attributeCreate.attribute.id;
      return product
        .createTypeProduct(name, this.attributeId)
        .then(createTypeProductResp => {
          this.productTypeId =
            createTypeProductResp.body.data.productTypeCreate.productType.id;
          return category.createCategory(name).then(categoryResp => {
            this.categoryId = categoryResp.body.data.categoryCreate.category.id;
          });
        });
    });
  }

  getCreatedVariants() {
    return this.createdVariantId;
  }
  getProductTypeId() {
    return this.productTypeId;
  }
  getAttributeId() {
    return this.attributeId;
  }
  getCategoryId() {
    return this.categoryId;
  }

  deleteProducts(startsWith) {
    const product = new Product();
    const attribute = new Attribute();
    const category = new Category();
    product.getProductTypes(100, startsWith).then(resp => {
      const productTypes = resp.body.data.productTypes.edges;
      productTypes.forEach(productType => {
        if (productType.node.name.includes(startsWith)) {
          product.deleteProductType(productType.node.id);
        }
      });
    });
    attribute.getAttributes(100, startsWith).then(resp => {
      const attributes = resp.body.data.attributes.edges;
      attributes.forEach(attributeElement => {
        if (attributeElement.node.name.includes(startsWith)) {
          attribute.deleteAttribute(attributeElement.node.id);
        }
      });
    });
    category.getCategories(100, startsWith).then(resp => {
      const categories = resp.body.data.categories.edges;
      categories.forEach(categoryElement => {
        if (categoryElement.node.name.includes(startsWith)) {
          category.deleteCategory(categoryElement.node.id);
        }
      });
    });
    product.getFirstProducts(100, startsWith).then(getProductResp => {
      const products = getProductResp.body.data.products.edges;
      products.forEach(productElement => {
        if (productElement.node.name.includes(startsWith)) {
          product.deleteProducts(productElement.node.id);
        }
      });
    });
  }
}
export default ProductsUtils;
