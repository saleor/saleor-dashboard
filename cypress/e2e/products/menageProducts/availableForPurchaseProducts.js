/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { productDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { getProductDetails } from "../../../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { isProductAvailableForPurchase } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import { updateProductIsAvailableForPurchase } from "../../../support/pages/catalog/products/productDetailsPage";

describe("Products available in listings", () => {
  const startsWith = "CyAvailForPurchase-";
  const name = `${startsWith}${faker.datatype.number()}`;
  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShippingStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);

    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addressesFixture => {
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address: addressesFixture.plAddress,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });

    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;
        },
      );
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

  it(
    "should update product to available for purchase",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      let product;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          isAvailableForPurchase: false,
        })
        .then(({ product: productResp }) => {
          product = productResp;
          const productUrl = productDetailsUrl(product.id);
          updateProductIsAvailableForPurchase(productUrl, true);
        })
        .then(() => {
          getProductDetails(product.id, defaultChannel.slug);
        })
        .then(resp => {
          expect(isProductAvailableForPurchase(resp)).to.be.eq(true);
        });
    },
  );

  it(
    "should update product to not available for purchase",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      let product;

      productsUtils
        .createProductInChannel({
          name: productName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
        })
        .then(({ product: productResp }) => {
          product = productResp;
          const productUrl = productDetailsUrl(product.id);
          updateProductIsAvailableForPurchase(productUrl, false);
        })
        .then(() => {
          getProductDetails(product.id, defaultChannel.slug);
        })
        .then(resp => {
          expect(isProductAvailableForPurchase(resp)).to.be.eq(false);
        });
    },
  );
});
