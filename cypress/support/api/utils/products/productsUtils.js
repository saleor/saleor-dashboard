import { returnValueDependsOnShopVersion } from "../../../formatData/dataDependingOnVersion";
import * as attributeRequest from "../../requests/Attribute";
import * as categoryRequest from "../../requests/Category";
import { createCollection } from "../../requests/Collections";
import * as productRequest from "../../requests/Product";
import {
  createDigitalContent,
  createTypeProduct,
  deleteProductType,
  getProductTypes,
  productAttributeAssignmentUpdate,
  setProductTypeAsDigital
} from "../../requests/ProductType";
import { deleteAttributesStartsWith } from "../attributes/attributeUtils";
import { deleteCollectionsStartsWith } from "../catalog/collectionsUtils";
import { getDefaultChannel } from "../channelsUtils";
import { createShipping, deleteShippingStartsWith } from "../shippingUtils";

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
  trackInventory = true,
  weight = 1,
  preorder,
  sku = name
}) {
  let product;
  let variantsList;
  return createProductInChannelWithoutVariants({
    name,
    channelId,
    productTypeId,
    attributeId,
    categoryId,
    isPublished,
    isAvailableForPurchase,
    visibleInListings,
    collectionId,
    description
  })
    .then(productResp => {
      product = productResp;
      productRequest.createVariant({
        productId: product.id,
        sku,
        attributeId,
        warehouseId,
        quantityInWarehouse,
        channelId,
        price,
        trackInventory,
        weight,
        preorder
      });
    })
    .then(variantsResp => {
      variantsList = variantsResp;
      return { product, variantsList };
    });
}

export function createTypeAttributeAndCategoryForProduct({
  name,
  attributeValues,
  kind = "NORMAL"
}) {
  let attribute;
  let productType;
  let category;
  return attributeRequest
    .createAttribute({ name, attributeValues })
    .then(attributeResp => {
      attribute = attributeResp;
      createTypeProduct({ name, attributeId: attributeResp.id, kind });
    })
    .then(productTypeResp => {
      productType = productTypeResp;
      const updateAssign = returnValueDependsOnShopVersion("3.1", true, false);
      if (updateAssign) {
        productAttributeAssignmentUpdate({
          productTypeId: productType.id,
          attributeId: attribute.id
        });
      }
      categoryRequest.createCategory(name);
    })
    .then(categoryResp => {
      category = categoryResp;
      return { attribute, category, productType };
    });
}

export function deleteProductsStartsWith(startsWith) {
  deleteAttributesStartsWith(startsWith);
  cy.deleteElementsStartsWith(deleteProductType, getProductTypes, startsWith);
  cy.deleteElementsStartsWith(
    categoryRequest.deleteCategory,
    categoryRequest.getCategories,
    startsWith
  );
  cy.deleteElementsStartsWith(
    productRequest.deleteProduct,
    productRequest.getFirstProducts,
    startsWith
  );
}

export function deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel({
  name,
  description = name,
  warehouseId,
  preorder,
  attributeValues = ["value"],
  sku = name,
  productPrice = 10
}) {
  let defaultChannel;
  let collection;
  let attribute;

  deleteProductsStartsWith(name);
  deleteCollectionsStartsWith(name);
  return getDefaultChannel()
    .then(channel => {
      defaultChannel = channel;
      createCollection(name);
    })
    .then(collectionResp => {
      collection = collectionResp;
      createTypeAttributeAndCategoryForProduct({ name, attributeValues });
    })
    .then(({ attribute: attributeResp, category, productType }) => {
      attribute = attributeResp;
      createProductInChannel({
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channelId: defaultChannel.id,
        name,
        collectionId: collection.id,
        description,
        warehouseId,
        price: productPrice,
        preorder,
        sku
      });
    })
    .then(({ product, variantsList }) => ({ product, variantsList }));
}

export function createProductWithShipping({
  name,
  attributeValues = ["value"],
  sku = name,
  productPrice = 10,
  shippingPrice = 10,
  preorder
}) {
  let address;
  let warehouse;
  let shippingMethod;
  let defaultChannel;
  let shippingZone;

  deleteShippingStartsWith(name);
  return cy
    .fixture("addresses")
    .then(addresses => {
      address = addresses.usAddress;
      getDefaultChannel();
    })
    .then(channelResp => {
      defaultChannel = channelResp;
      createShipping({
        channelId: defaultChannel.id,
        name,
        address,
        price: shippingPrice
      });
    })
    .then(
      ({
        warehouse: warehouseResp,
        shippingZone: shippingZoneResp,
        shippingMethod: shippingMethodResp
      }) => {
        warehouse = warehouseResp;
        shippingMethod = shippingMethodResp;
        shippingZone = shippingZoneResp;
        deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel({
          name,
          warehouseId: warehouse.id,
          productPrice,
          preorder,
          attributeValues,
          sku
        });
      }
    )
    .then(({ variantsList, product }) => ({
      variantsList,
      product,
      warehouse,
      shippingZone,
      defaultChannel,
      shippingMethod,
      address
    }));
}

export function createProductInChannelWithoutVariants({
  name,
  channelId,
  productTypeId,
  attributeId,
  categoryId,
  isPublished = true,
  isAvailableForPurchase = true,
  visibleInListings = true,
  collectionId = null,
  description = null
}) {
  let product;
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
    .then(() => product);
}

export function addDigitalContentAndUpdateProductType(
  variantId,
  productTypeId,
  channelId,
  price = 1
) {
  createDigitalContent(variantId);
  setProductTypeAsDigital(productTypeId);
  productRequest.updateVariantPrice({ variantId, channelId, price });
}
