import * as attributeRequest from "../../requests/Attribute";
import * as categoryRequest from "../../requests/Category";
import { createChannel } from "../../requests/Channels";
import { createCollection } from "../../requests/Collections";
import * as productRequest from "../../requests/Product";
import {
  createDigitalContent,
  createTypeProduct,
  deleteProductType,
  getProductTypes,
  productAttributeAssignmentUpdate,
  setProductTypeAsDigital,
} from "../../requests/ProductType";
import { deleteAttributesStartsWith } from "../attributes/attributeUtils";
import { getDefaultChannel } from "../channelsUtils";
import {
  createShipping,
  createShippingWithDefaultChannelAndAddress,
} from "../shippingUtils";

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
  sku = name,
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
    description,
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
        preorder,
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
  kind = "NORMAL",
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
      productAttributeAssignmentUpdate({
        productTypeId: productType.id,
        attributeId: attribute.id,
        variantSelection: true,
      });
      categoryRequest.createCategory({ name });
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
    startsWith,
  );
  cy.deleteElementsStartsWith(
    productRequest.deleteProduct,
    productRequest.getFirstProducts,
    startsWith,
  );
}

export function createNewProductWithNewDataAndDefaultChannel({
  name,
  description = name,
  warehouseId,
  preorder,
  attributeValues = ["value"],
  sku = name,
  productPrice = 10,
}) {
  return getDefaultChannel().then(channel => {
    createNewProductWithNewDataAndChannel({
      name,
      description,
      warehouseId,
      preorder,
      attributeValues,
      sku,
      productPrice,
      defaultChannel: channel,
    });
  });
}

export function createNewProductWithNewDataAndChannel({
  name,
  description = name,
  warehouseId,
  preorder,
  attributeValues = ["value"],
  sku = name,
  productPrice = 10,
  defaultChannel,
}) {
  let collection;
  let attribute;
  let category;
  let productType;

  return createCollection(name)
    .then(collectionResp => {
      collection = collectionResp;
      createTypeAttributeAndCategoryForProduct({ name, attributeValues });
    })
    .then(
      ({
        attribute: attributeResp,
        category: categoryResp,
        productType: productTypeResp,
      }) => {
        attribute = attributeResp;
        category = categoryResp;
        productType = productTypeResp;
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
          sku,
        });
      },
    )
    .then(({ product, variantsList }) => ({
      product,
      variantsList,
      attribute,
      category,
      productType,
    }));
}

export function createProductWithShipping({
  name,
  attributeValues = ["value"],
  sku = name,
  productPrice = 10,
  shippingPrice = 10,
  preorder,
  newChannel = false,
}) {
  let address;
  let warehouse;
  let shippingMethod;
  let defaultChannel;
  let shippingZone;

  return cy
    .fixture("addresses")
    .then(addresses => {
      address = addresses.usAddress;
      if (!newChannel) {
        getDefaultChannel();
      } else {
        createChannel({ name });
      }
    })
    .then(channelResp => {
      defaultChannel = channelResp;
      createShipping({
        channelId: defaultChannel.id,
        name,
        address,
        price: shippingPrice,
      });
    })
    .then(
      ({
        warehouse: warehouseResp,
        shippingZone: shippingZoneResp,
        shippingMethod: shippingMethodResp,
      }) => {
        warehouse = warehouseResp;
        shippingMethod = shippingMethodResp;
        shippingZone = shippingZoneResp;
        createNewProductWithNewDataAndChannel({
          name,
          warehouseId: warehouse.id,
          productPrice,
          preorder,
          attributeValues,
          sku,
          defaultChannel,
        });
      },
    )
    .then(({ variantsList, product, attribute, category, productType }) => ({
      variantsList,
      product,
      warehouse,
      shippingZone,
      defaultChannel,
      shippingMethod,
      address,
      attribute,
      category,
      productType,
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
  description = null,
}) {
  let product;
  return productRequest
    .createProduct({
      attributeId,
      name,
      productTypeId,
      categoryId,
      collectionId,
      description,
    })
    .then(productResp => {
      product = productResp;
      productRequest.updateChannelInProduct({
        productId: product.id,
        channelId,
        isPublished,
        isAvailableForPurchase,
        visibleInListings,
      });
    })
    .then(() => product);
}

export function addDigitalContentAndUpdateProductType(
  variantId,
  productTypeId,
  channelId,
  price = 1,
) {
  createDigitalContent(variantId);
  setProductTypeAsDigital(productTypeId);
  productRequest.updateVariantPrice({ variantId, channelId, price });
}

export function createDigitalAndPhysicalProductWithNewDataAndDefaultChannel({
  physicalProductName,
  digitalProductName,
}) {
  let physicalVariants;
  let digitalVariants;
  let warehouse;
  let attribute;
  let shippingMethod;
  let defaultChannel;
  let address;
  let category;
  let digitalProductType;

  return createProductWithShipping({
    name: physicalProductName,
    attributeValues: ["physical"],
  })
    .then(resp => {
      physicalVariants = resp.variantsList;
      warehouse = resp.warehouse;
      shippingMethod = resp.shippingMethod;
      attribute = resp.attribute;
      defaultChannel = resp.defaultChannel;
      address = resp.address;
      category = resp.category;

      createTypeProduct({
        name: digitalProductName,
        shippable: false,
        attributeId: attribute.id,
      });
    })
    .then(productType => {
      digitalProductType = productType;
      createProductInChannel({
        attributeId: attribute.id,
        productTypeId: productType.id,
        categoryId: category.id,
        channelId: defaultChannel.id,
        name: digitalProductName,
        warehouseId: warehouse.id,
      });
    })
    .then(({ variantsList }) => {
      digitalVariants = variantsList;
      addDigitalContentAndUpdateProductType(
        digitalVariants[0].id,
        digitalProductType.id,
        defaultChannel.id,
      );
    })
    .then(() => ({
      digitalVariants,
      physicalVariants,
      shippingMethod,
      defaultChannel,
      address,
    }));
}

export function createNewProductWithSeveralVariants(name, variantsData) {
  let address;
  let defaultChannel;
  let warehouse;
  let shippingMethod;
  const createdVariants = [];
  let attribute;
  let productType;
  let category;

  return cy
    .fixture("addresses")
    .then(addresses => {
      address = addresses.usAddress;
      getDefaultChannel();
    })
    .then(channel => {
      defaultChannel = channel;
      createShipping({
        channelId: defaultChannel.id,
        name,
        address,
      });
    })
    .then(
      ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
        warehouse = warehouseResp;
        shippingMethod = shippingMethodResp;

        const attributeValues = [];
        variantsData.forEach(variant => {
          attributeValues.push(variant.name);
        });

        createTypeAttributeAndCategoryForProduct({
          name,
          attributeValues,
        });
      },
    )
    .then(
      ({
        attribute: attributeResp,
        category: categoryResp,
        productType: productTypeResp,
      }) => {
        attribute = attributeResp;
        category = categoryResp;
        productType = productTypeResp;

        createProductInChannelWithoutVariants({
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
          channelId: defaultChannel.id,
          name,
        });
      },
    )
    .then(product => {
      variantsData.forEach(variant => {
        productRequest
          .createVariant({
            productId: product.id,
            attributeId: attribute.id,
            channelId: defaultChannel.id,
            attributeName: variant.name,
            trackInventory: variant.trackInventory,
            warehouseId: warehouse.id,
            quantityInWarehouse: variant.quantityInWarehouse,
          })
          .then(variants => {
            createdVariants.push(variants[0]);
          });
      });
    })
    .then(() => ({ createdVariants, address, shippingMethod, defaultChannel }));
}

export function createShippingProductTypeAttributeAndCategory(
  name,
  attributeValues,
) {
  let warehouse;
  let defaultChannel;

  return createShippingWithDefaultChannelAndAddress(name)
    .then(({ warehouse: warehouseResp, defaultChannel: channel }) => {
      warehouse = warehouseResp;
      defaultChannel = channel;

      createTypeAttributeAndCategoryForProduct({ name, attributeValues });
    })
    .then(({ attribute, productType, category }) => ({
      attribute,
      productType,
      category,
      warehouse,
      defaultChannel,
    }));
}

export function sendRequestForMediaThumbnails(thumbnailUrl, productId) {
  return cy
    .request({
      url: thumbnailUrl,
      followRedirect: false,
      failOnStatusCode: false,
    })
    .then(response => {
      if (response.status !== 302) {
        return `product: ${productId}, expectedStatus: 302, status: ${response.status}`;
      } else {
        cy.request({
          url: response.redirectedToUrl,
          failOnStatusCode: false,
        }).then(resp => {
          if (resp.status !== 200) {
            return `product: ${productId}, expectedStatus: 200, status: ${resp.status}`;
          } else {
            return null;
          }
        });
      }
    });
}

export function sendRequestForThumbnails(thumbnailUrl, productId) {
  return cy
    .request({ url: thumbnailUrl, failOnStatusCode: false })
    .then(response => {
      if (response.status !== 200) {
        return `product: ${productId}, expectedStatus: 200, status: ${response.status}`;
      } else {
        return null;
      }
    });
}

export function checkThumbnailTypeAndSendRequest(thumbnailUrl, productId) {
  if (!thumbnailUrl.includes("/media/thumbnails")) {
    return sendRequestForMediaThumbnails(thumbnailUrl, productId).then(
      notCorrectStatus => notCorrectStatus,
    );
  } else {
    return sendRequestForThumbnails(thumbnailUrl, productId).then(
      notCorrectStatus => notCorrectStatus,
    );
  }
}

export function iterateThroughThumbnails(productsWithThumbnails) {
  const failedRequests = [];
  productsWithThumbnails.forEach(product => {
    const thumbnailUrl = product.node.thumbnail.url;
    checkThumbnailTypeAndSendRequest(thumbnailUrl, product.node.id).then(
      notCorrectStatus => {
        if (notCorrectStatus) {
          failedRequests.push(notCorrectStatus);
        }
      },
    );
  });
  return failedRequests;
}
